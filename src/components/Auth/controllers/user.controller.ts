import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken'
import AuthService from '../services';
import { sendResponse, handleError } from '../../../helpers/response.helper';
import { IUser, IUserModel } from '../../../config/models/user.model';
import config from '../../../config/env/index'

interface AuthenticatedRequest extends Request {
  user: IUserModel;
}

export async function saveTelegramId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        if (!config.jwtSecret) {
            throw new Error('JWT_SECRET is not defined in environment variables');
        }

        const result = await AuthService.saveTelegramId(req.body);

        console.log('THE RESULT ', result)

        const payload = { telegramUserId: result.telegramUserId };
        console.log('THE PAYLOAD ', payload)
        
        const token = jwt.sign(
            { user: payload }, 
            config.jwtSecret, 
            { expiresIn: "1d" }
        );

        sendResponse(res, 200, "Telegram ID saved successfully", { token });
    } catch (error) {
        handleError(error, res, next);
    }
}
export async function updateUser(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
        const result = await AuthService.updateUser(req.body, req.user);

        console.log('result', result)

        sendResponse(
            res,
            result ? 200 : 400,
            result ? 'User profile updated successfully' : 'Email has already been registered',
            null,
            !result,
        );
    } catch (error) {
        handleError(error, res, next);
    }
}

export async function getUser(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
        const result = await AuthService.user(req.body, req.user);

        console.log('result', result)

        sendResponse(
            res,
            result ? 200 : 400,
            result ? 'User data fetched successfully' : 'Failed to fetch user data',
            null,
            !result,
        );
    } catch (error) {
        handleError(error, res, next);
    }
}
