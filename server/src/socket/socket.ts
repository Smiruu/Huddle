import { Server, Socket } from "socket.io";
import { NextFunction as next } from "express";
import { Server as HttpServer } from "http";
import supabase from "../supabase/supabase";
import dotenv from "dotenv";

dotenv.config();

interface AuthenticatedSocket extends Socket {
  userId?: string;
  username?: string;
}

const handleLeaveLobby = async (socket: AuthenticatedSocket, lobbyId: string, io: Server) => {
  try {
    const { error: updateError } = await supabase
      .from('lobbies_participants')
      .update({ 
        is_active: false, 
        left_at: new Date().toISOString() 
      })
      .eq('user_id', socket.userId!)
      .eq('lobby_id', lobbyId)
      .eq('is_active', true);
    
      if (updateError) throw updateError;

      //remove user from the room
      socket.leave(lobbyId);

      //Notify others
      socket.to(lobbyId).emit('user_left', { 
      userId: socket.userId
    });

    // --- 2. THIS IS THE FIX ---
    // Call the lobby count function after leaving
    await handleLobbyCount(lobbyId, io);

  } catch (error: any) {
    console.error(`Error handling leave for user ${socket.userId} from lobby ${lobbyId}:`, error.message);
  }
};

const handleLobbyCount = async (lobbyId: string, io: Server) => {
  try {

    const {count, error} = await supabase
    .from('lobbies_participants')
    .select('*', {count: 'exact', head:true})
    .eq('lobby_id', lobbyId)
    .eq('is_active', true);

    if(error) throw error
    
    io.to('dashboard').emit('lobby_count_update', {
      lobbyId: lobbyId,
      count: count ?? 0
    });
  } catch (error: any) {
    console.error(`Error broadcasting count for lobby ${lobbyId}:`, error.message);
  }
}
export const initializeSocket = (httpServer: HttpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ["GET", "POST"],
    },
  });

  io.use(async (socket: AuthenticatedSocket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Authentication error: No token provided"));
    }

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    const { data, error: profileError } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", user?.id)
      .single();

    if (error || !user) {
      return next(new Error("Authentication error: Invalid token."));
    }

    socket.userId = user.id;
    socket.username = data?.username;
    next();
  });

  io.on("connection", (socket: AuthenticatedSocket) => {
    console.log(`User connected: ${socket.username} (ID: ${socket.userId})`);

    socket.join('dashboard');
    const joinedLobbies = new Set<string>();

    socket.on("join_lobby", async ({ lobbyId }) => {
      if (!lobbyId || !socket.userId) {
        return socket.emit("lobby_join_error", {
          message: "Missing lobby ID or user auth",
        });
      }
      
      try {
        const { data: existingParticipant, error: checkError } = await supabase
          .from("lobbies_participants")
          .select("id, is_active")
          .eq("user_id", socket.userId)
          .eq("lobby_id", lobbyId)
          .single();

        
        if (checkError && checkError.code !== "PGRST116") {
          throw checkError;
        }

        if (existingParticipant) {
          //handle rejoining
          if (!existingParticipant.is_active) {
            const { error: updateError } = await supabase
              .from("lobbies_participants")
              .update({ is_active: true, left_at: null })
              .eq("id", existingParticipant.id);

            if (updateError) throw updateError;
          }} else {
            // handle new joiner
            const { error: insertError } = await supabase
              .from("lobbies_participants")
              .insert({
                user_id: socket.userId,
                lobby_id: lobbyId,
                is_active: true,
              });

            if (insertError && insertError.code === '23505') {
              console.warn(`User ${socket.userId} tried to join lobby ${lobbyId} but is already a participant (duplicate key).`);
            } else if (insertError) {
              throw insertError;
            }
          }

          //add user to the Socket.io room
          socket.join(lobbyId);
          joinedLobbies.add(lobbyId)

          const { data: participantsList, error: listError } = await supabase
            .from("lobbies_participants") 
            .select(
              `
                user_id,
                profiles ( username ) 
            `
            )
            .eq("lobby_id", lobbyId)
            .eq("is_active", true);

          if (listError) throw listError;

          //Notify the joining user
          socket.emit("joined_lobby_success", {
            lobbyId,
            participants: participantsList || [],
          });

          //Notify others
          socket.to(lobbyId).emit("user_joined", {
            userId: socket.userId,
            profiles: { username: socket.username },
          });

          await handleLobbyCount(lobbyId, io);
        }
       catch (err: any) {
        console.error("Error joining lobby:", err.message);
        socket.emit("lobby_join_error", {
          message: "Server error while joining lobby",
        });
      }
    });

    socket.on('leave_lobby', async ({lobbyId}) => {
        console.log(`User ${socket.username} manually leaving lobby: ${lobbyId}`);
      await handleLeaveLobby(socket, lobbyId, io);
      joinedLobbies.delete(lobbyId);
    })

    socket.on("disconnect", () => {
      console.log(`❌ User disconnected: ${socket.username}`);
      joinedLobbies.forEach(lobbyId => {
        console.log(`Handling auto-leave for ${socket.username} from lobby: ${lobbyId}`);
        // We don't need to 'await' this, just fire and forget
        handleLeaveLobby(socket, lobbyId, io);
      });
    });
  });

  return io;
};
