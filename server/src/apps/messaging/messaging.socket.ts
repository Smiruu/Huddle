import { Server } from "socket.io";
import { MessagingServices } from "./messaging.services";
import { AuthenticatedSocket } from '../../socket/socket.types';

class MessagingHandler {
  constructor(
    private io: Server,
    private socket: AuthenticatedSocket
  ) {
    this.registerEvents();
  }

  private registerEvents() {
    // FIX 3 (Best Practice): Listen for a single object.
    this.socket.on("send message", this.sendMessage); 
    this.socket.on("chats", this.getChats);
  }

  // FIX 3 (Best Practice): Change signature to accept a single object
  // for consistency.
  private sendMessage = async ({ lobbyId, content }: { lobbyId: string, content: string }) => {
    if (!this.socket.userId) {
      throw new Error("No username");
    }
    try {
      const message = await MessagingServices.sendMessage(
        content, this.socket.userId, lobbyId
      );

      this.io.to(lobbyId).emit('sending message', message);
    } catch (err) {
      console.error("messaging.socket.ts: sendMessage error", err);
      this.socket.emit("error", "failed to send message");
    }
  }

  // FIX 2: Change signature to accept ONE object, matching the client emit
  private getChats = async ({ lobbyId, page }: { lobbyId: string, page: number }) => {
    try {
      const messages = await MessagingServices.getMessageOfLobby(
        lobbyId,
        page || 0 // Default to page 0
      );
      console.log(messages)
      // FIX 1: Send history ONLY to the user who asked.
      // this.io.to(lobbyId).emit(...) <-- This is WRONG, it sends to everyone.
      this.socket.emit('chat history', messages); // <-- This is CORRECT.

    } catch (err) {
      console.error("messaging.socket.ts: getChats error", err);
      this.socket.emit("error", "failed to fetch messages");
    }
  }
}

export default MessagingHandler;