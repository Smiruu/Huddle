import {Server, Socket} from 'socket.io'
import { LobbyService } from './lobby.services';
import { AuthenticatedSocket } from '../../socket/socket.types';
class LobbySocketHandler{
    private joinedLobbies = new Set<string>();

    constructor(
    private io: Server,
    private socket: AuthenticatedSocket
  ) {
    this.registerEvents();
  }

  private registerEvents() {
    this.socket.on("join_lobby", this.onJoinLobby);
    this.socket.on("leave_lobby", this.onLeaveLobby);
    this.socket.on("disconnect", this.onDisconnect);
  }

  private onJoinLobby = async({lobbyId}: {lobbyId:string}) => {
    if (!lobbyId || !this.socket.userId || !this.socket.username) {
      return this.socket.emit("lobby_join_error", { message: "Missing data" });
    }

    try {
        const result = await LobbyService.joinLobby(
            this.socket.userId, lobbyId, this.socket.username
        )

        this.socket.join(lobbyId);
        this.joinedLobbies.add(lobbyId);
        this.socket.emit("joined_lobby_success", { lobbyId, participants: result.participant });
        this.socket.to(lobbyId).emit("user_joined", result.newParticipant);
        this.io.to('dashboard').emit('lobby_count_update', { lobbyId, count: result.count });
    } catch (err) {
        this.socket.emit("lobby_join_error", { message: "Server error" });
    }
    };

    private onLeaveLobby = async ({lobbyId}: {lobbyId:string}) => {
        if (!lobbyId || !this.socket.userId) return;

        try {
            const result = await LobbyService.leaveLobby(this.socket.userId, lobbyId);

            this.socket.leave(lobbyId);
      this.joinedLobbies.delete(lobbyId);

      this.socket.to(lobbyId).emit('user_left', { userId: this.socket.userId });
      this.io.to('dashboard').emit('lobby_count_update', { lobbyId, count: result.count });
        } catch (err: any) {
            console.error(`Error handling leave:`, err.message);
        }
    }

    private onDisconnect = async () => {
    if (!this.socket.userId) return;

    
    for (const lobbyId of this.joinedLobbies) {
      const result = await LobbyService.leaveLobby(this.socket.userId, lobbyId);
      this.socket.to(lobbyId).emit('user_left', { userId: this.socket.userId });
      this.io.to('dashboard').emit('lobby_count_update', { lobbyId, count: result.count });
    }
  };
}

export default LobbySocketHandler