import { Request, Response, NextFunction } from 'express';
import AuthService from '../services';
import { sendResponse, handleError } from '../../../helpers/response.helper'

export async function getQuestions(req: any, res: Response, next: NextFunction) {
  try {
    const host = req.get('host');
    const result = await AuthService.getQuestions(req.body, req.user, host);
    result?.success
      ? sendResponse(res, 200, 'Questions fetched successfully', result.questions)
      : sendResponse(res, 400, 'Failed to fetch quiz questions', null, true);
  } catch (error) {
    handleError(error, res, next);
  }
}
