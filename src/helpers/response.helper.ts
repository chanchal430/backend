import { Response, NextFunction } from 'express';
import HttpError from '../config/error';

export const sendResponse = (
    res: Response,
    status: number,
    message: string,
    data: any = null,
    error: boolean = false,
) => {
    res.status(status).json({
        status,
        error,
        message,
        ...(data !== null && { data }),
    });
};

export const handleError = (error: any, res: Response, next: NextFunction) => {
    if (error.code === 500) {
        return next(new HttpError(error.message.status, error.message));
    }

    return res.status(400).json({
        status: 400,
        error: true,
        message: error.message || 'Bad Request',
    });
};
