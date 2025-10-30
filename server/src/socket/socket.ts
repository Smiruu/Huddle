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

    socket.on("join_lobby", async ({ lobbyId }) => {
      if (!lobbyId || !socket.userId) {
        return socket.emit("lobby_join_error", {
          message: "Missing lobby ID or user auth",
        });
      }
      console.log("Joining");
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

            if (insertError) throw insertError;
          }

          //add user to the Socket.io room
          socket.join(lobbyId);

          const { data: participantsList, error: listError } = await supabase
            .from("lobbies_participants") // <-- FIXED
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
        }
       catch (err: any) {
        console.error("Error joining lobby:", err.message);
        socket.emit("lobby_join_error", {
          message: "Server error while joining lobby",
        });
      }
    });

    socket.on("disconnect", () => {
      console.log(`❌ User disconnected: ${socket.username}`);
    });
  });

  return io;
};
