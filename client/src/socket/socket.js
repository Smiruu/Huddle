import {io} from "socket.io-client"
import {useAuthStore} from "../store/authStore"

const URL = import.meta.env.VITE_SOCKET_URL;

export const socket = io(URL, {
    autoConnect: false
})

export const connectSocket = () => {

    const token = useAuthStore.getState().token;

    if(token){
        socket.auth = {
            token: token
        }

        //connect
        socket.connect();
    } else {
        console.error('Socket: Could not connect. No auth token found in memory.');
    }
};

socket.on('connect', () => {
  console.log('✅ Connected to socket server');
});