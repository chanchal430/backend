import { Request, Response, NextFunction } from 'express';
import AuthService from '../services';
import { sendResponse, handleError } from '../../../helpers/response.helper';
import { IUserModel } from '../../../config/models/user.model';
import { CompleteTaskBody, DefinedTask } from '../interface';
import AuthValidation from '../validation';

interface AuthenticatedRequest extends Request {
  user: IUserModel;
  body: {
    taskId?: number;
    taskType?: string;
    points?: number;
    frequency?: 'daily' | 'weekly' | 'monthly';
  };
}

interface TaskResponse {
  success: boolean;
  dailyTasks?: DefinedTask[];
  weeklyTasks?: DefinedTask[];
  monthlyTasks?: DefinedTask[];
}

export async function tasks(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
        const result = await AuthService.tasks(req.body, req.user);
        sendResponse(
            res,
            result.success ? 200 : 400,
            result.success ? 'Tasks fetched successfully' : 'Task fetch failed',
            result,
        );
    } catch (error) {
        handleError(error, res, next);
    }
}

export async function completeTask(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
        const { error, value } = AuthValidation.completeTask(req.body);

        if (error) {
            return sendResponse(
                res,
                400,
                error.details[0].message.replace(/"/g, ''),
                null,
                true,
            );
        }

        const validatedBody = value as CompleteTaskBody;

        const result = await AuthService.completeTask(validatedBody, req.user);

        sendResponse(
            res,
            result ? 200 : 400,
            result ? 'Task Completed Successfully' : 'Task Completion Failed',
            null,
            !result,
        );
    } catch (error) {
        handleError(error, res, next);
    }
}
