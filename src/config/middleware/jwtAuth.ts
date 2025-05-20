import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import userModel, { IUserModel } from '../models/user.model';
import config from '../env';

interface RequestWithUser extends Request {
    user: IUserModel
    telegramUserId: string;
}

export async function isAuthenticated(req: RequestWithUser, res: Response, next: NextFunction): Promise<void> {
    const authHeader = req.headers.authorization;

    console.log('authHeader', authHeader)
    
    if (!authHeader?.startsWith('Bearer ')) {
        return sendUnauthorized(res, 'Invalid authorization header format');
    }

    const token = authHeader.split(' ')[1];

    console.log('token--', token)
    
    try {
        // Verify JWT
        const decoded = jwt.verify(token, config.jwtSecret) as { user: { telegramUserId: string } };

        console.log('Decoded JWT:', decoded);
        
        // Find user in database
        const user = await userModel.findOne({ 
            telegramUserId: decoded.user.telegramUserId 
        });

        if (!user) {
            return sendUnauthorized(res, 'User not found');
        }

        // Attach user to request
        req.telegramUserId = user.telegramUserId;
        req.user = user;
        next();
    } catch (error) {
        handleAuthError(error, res);
    }
}

// Helper functions
function sendUnauthorized(res: Response, message: string): void {
    res.status(401).json({
        status: 401,
        error: true,
        message
    });
}

function handleAuthError(error: any, res: Response): void {
    let message = 'Unauthorized';
    
    if (error instanceof jwt.TokenExpiredError) {
        message = 'Token expired';
    } else if (error instanceof jwt.JsonWebTokenError) {
        message = 'Invalid token';
    }

    res.status(401).json({
        status: 401,
        error: true,
        message
    });
}