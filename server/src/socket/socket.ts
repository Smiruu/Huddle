// src/socket/socket.ts
import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import dotenv from "dotenv";

// Import your new, separated logic
import { AuthenticatedSocket } from "./socket.types";
import { authMiddleware } from "./socket.auth";
import LobbySocketHandler from "../apps/lobby/lobby.socket"; // Adjust path if needed

dotenv.config();

/**
 * This is our "connection router".
 * It's called for every new socket that connects.
 */
const onConnection = (io: Server) => (socket: AuthenticatedSocket) => {
  console.log(`User connected: ${socket.username} (ID: ${socket.userId})`);

  // 1. Join the general-purpose dashboard room
  socket.join('dashboard');

  // 2. Register all lobby events for this socket
  // This one line replaces ALL of your old event listeners
  new LobbySocketHandler(io, socket);

  // 3. (In the future) You could add more handlers here
  // new ChatSocketHandler(io, socket);
  // new NotificationSocketHandler(io, socket);
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