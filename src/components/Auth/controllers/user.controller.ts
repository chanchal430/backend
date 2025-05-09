import { Request, Response, NextFunction } from 'express';
import AuthService from '../services';
import { sendResponse, handleError } from '../../../helpers/response.helper';
import { IUser, IUserModel } from '../../../config/models/user.model';

interface AuthenticatedRequest extends Request {
  user: IUserModel;
}

export async function saveTelegramId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const result = await AuthService.saveTelegramId(req.body);

        sendResponse(
            res,
            result ? 200 : 400,
            result ? 'User Telegram Id connected successfully' : 'Bad Request',
            null,
            !result,
        );
    } catch (error) {
        handleError(error, res, next);
    }
}

export async function updateUser(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
        const result = await AuthService.updateUser(req.body, req.user);

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
