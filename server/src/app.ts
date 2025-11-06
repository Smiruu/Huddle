import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import errorHandler from './middleware/errorHandler';
import morgan from 'morgan';


import authRoutes from './apps/authentication/auth.routes';
import lobbyRoutes from './apps/lobby/lobby.routes'
import profileRoutes from './apps/profile/profile.routes'

//allow environment variables
dotenv.config();
const app = express();
;
// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(cookieParser());
app.use(morgan('dev'))

//--ROUTES--
app.get('/', (req: Request, res: Response) => {
  res.send('Server is alive!');
});
app.use("/api/auth", authRoutes);
app.use("/api/lobby", lobbyRoutes);
app.use("/api/profile", profileRoutes)

// Error Handling Middleware
app.use(errorHandler);

export default app;

