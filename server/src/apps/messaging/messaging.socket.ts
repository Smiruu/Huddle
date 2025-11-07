import { Server } from "socket.io";
import { MessagingServices } from "./messaging.services";
import { AuthenticatedSocket } from '../../socket/socket.types';


class MessagingHandler{
    constructor(
        private io : Server,
        private socket: AuthenticatedSocket
    ){
        this.registerEvents();
    }

    private registerEvents() {
        this.socket.on("send message", this.sendMessage);
    }

    private sendMessage = async({lobbyId}: {lobbyId:string}, content:string) => {
        if (!this.socket.userId){
            throw new Error("No username")
        }
        try {
            const message = await MessagingServices.sendMessage(
                content,this.socket.userId, lobbyId
            )

            this.io.to(lobbyId).emit('sending message', message)
        } catch (err) {
            console.error("messaging.socket.ts: sendMessage error", err)
        }
    }
}

export default MessagingHandler