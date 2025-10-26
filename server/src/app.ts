import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import errorHandler from './middleware/errorHandler';

import authRoutes from './apps/authentication/auth.routes';

//allow environment variables
dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URL,
}));
app.use(cookieParser());

//--ROUTES--
app.get('/', (req: Request, res: Response) => {
  res.send('Server is alive!');
});
app.use("/api/auth", authRoutes);

// Error Handling Middleware
app.use(errorHandler);

export default app;

