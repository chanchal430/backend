import { Request, Response, NextFunction } from 'express';
import AuthService from '../services';
import { sendResponse, handleError } from '../../../helpers/response.helper'

export async function saveTelegramId(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await AuthService.saveTelegramId(req.body);
    sendResponse(res, result === 1 ? 200 : 400, result === 1 ? 'User Telegram Id connected successfully' : 'Bad Request', null, result !== 1);
  } catch (error) {
    handleError(error, res, next);
  }
}

export async function updateUser(req: any, res: Response, next: NextFunction) {
  try {
    const result = await AuthService.updateUser(req.body, req.user);
    const messages = {
      1: 'User profile updated successfully',
      2: 'Email has already been registered',
      0: 'Bad Request',
    } as any;
    sendResponse(res, result === 1 ? 200 : 400, messages[result] || 'Bad Request', null, result !== 1);
  } catch (error) {
    handleError(error, res, next);
  }
}

export async function getUser(req: any, res: Response, next: NextFunction) {
  try {
    const result = await AuthService.user(req.body, req.user);
    result?.success
      ? sendResponse(res, 200, 'User data fetched successfully', result.user)
      : sendResponse(res, 400, 'Failed to fetch user data', null, true);
  } catch (error) {
    handleError(error, res, next);
  }
}
