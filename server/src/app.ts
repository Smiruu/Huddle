import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import errorHandler from './middleware/errorHandler';

//allow environment variables
dotenv.config();
const app = express();

app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URL,
}));

app.use(errorHandler);

export default app;

