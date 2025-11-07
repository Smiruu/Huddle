// src/socket/socket.ts
import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import dotenv from "dotenv";

// Import your new, separated logic
import { AuthenticatedSocket } from "./socket.types";
import { authMiddleware } from "./socket.auth";
import LobbySocketHandler from "../apps/lobby/lobby.socket"; // Adjust path if needed
import MessagingHandler from "../apps/messaging/messaging.socket";

dotenv.config();

const onConnection = (io: Server) => (socket: AuthenticatedSocket) => {
  console.log(`User connected: ${socket.username} (ID: ${socket.userId})`);


  socket.join('dashboard');

  new LobbySocketHandler(io, socket);
  new MessagingHandler(io, socket)

  
};


/**
 * Initializes and configures the Socket.IO server.
 */
export const initializeSocket = (httpServer: HttpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ["GET", "POST"],
    },
  });

  // 1. Use the authentication middleware for all connections
  io.use(authMiddleware);

  // 2. Register the connection "router"
  io.on("connection", onConnection(io));

  return io;
};