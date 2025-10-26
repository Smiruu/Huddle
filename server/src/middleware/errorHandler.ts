import { Request, Response, NextFunction } from "express";
import { stat } from "fs";

interface AppError extends Error {
    statusCode: number;
}

const errorHandler = (
    err: AppError,
    req: Request,
    res: Response,
    next: NextFunction
) => {

    const statusCode = err.statusCode || 500;
    console.error("Error: ", err.stack);
    
    res.status(statusCode).json({
        status: "error",
        statusCode: statusCode,
        message: err.message || "Internal Server Error",
    });
}

export default errorHandler;