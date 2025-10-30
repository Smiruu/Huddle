import app from "./app";
import dotenv from "dotenv";
import { createServer } from 'http';
import { initializeSocket } from "./socket/socket";

dotenv.config();
const PORT = process.env.PORT ;

const httpServer = createServer(app);
const io = initializeSocket(httpServer);

app.listen(PORT, () => {
    console.log(`Server running on  http://localhost:${PORT}`)
})