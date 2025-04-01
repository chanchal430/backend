import { Request, Response, NextFunction } from 'express';
import AuthService from '../services';
import { sendResponse, handleError } from '../../../helpers/response.helper'

export async function tasks(req: any, res: Response, next: NextFunction) {
  try {
    const result = await AuthService.tasks(req.body, req.user);
    result?.success
      ? sendResponse(res, 200, 'Tasks fetched successfully', result)
      : sendResponse(res, 400, 'Task Completion Failed', null, true);
  } catch (error) {
    handleError(error, res, next);
  }
}

export async function completeTask(req: any, res: Response, next: NextFunction) {
  try {
    const result = await AuthService.completeTask(req.body, req.user);
    sendResponse(
      res,
      result === 1 ? 200 : 400,
      result === 1 ? 'Task Completed Successfully' : 'Task Completion Failed',
      null,
      result !== 1
    );
  } catch (error) {
    handleError(error, res, next);
  }
}
