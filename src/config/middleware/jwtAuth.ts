import { NextFunction, Request, Response } from 'express';
import userModel from '../models/user.model';

interface RequestWithUser extends Request {
    user: object | string;
    telegramUserId: string;
}

export async function isAuthenticated(req: RequestWithUser, res: Response, next: NextFunction): Promise<void> {
    const token: string | string[] = req.headers['telegram-id'];
    if (token) {
        try {
            const user = await userModel.findOne({ telegramUserId: token });
            if (!user) {
                res.status(401).json({
                    status: 401,
                    error: true,
                    message: 'Unauthorized',
                });
            }
            if (!user.telegramUserId) {
                res.status(401).json({
                    status: 401,
                    error: true,
                    message: 'Unauthorized',
                });
            }
            // Attach Telegram user ID to request
            req.telegramUserId = user.telegramUserId;
            req.user = user;

            return next();
        } catch (error) {
            res.status(401).json({
                status: 401,
                error: true,
                message: 'Unauthorized',
            });
        }
    }
    res.status(400).json({
        status: 400,
        error: true,
        message: 'No Token provided',
    });
}
