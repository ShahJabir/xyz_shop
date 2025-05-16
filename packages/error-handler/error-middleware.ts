import { AppError } from './index';
import { NextFunction, Request, Response } from 'express';

export const errorMiddleware = (err: Error, request:Request, response: Response, next: NextFunction) => {
    if (err instanceof AppError) {
        console.error(`Error: ${request.method} ${request.url} - ${err.message}`);
        return response.status(err.statusCode).json({
            status: 'error',
            message: err.message,
            ...(err.details && {details: err.details}),
        });
    }
    console.error(`Unhandled Error: ${err}`);
    return response.status(500).json({
        "message": 'Somthing went wrong, please try again later',
    });
    next();
}
