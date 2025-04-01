import { Request, Response, NextFunction } from 'express';
import AuthService from '../services';
import { sendResponse, handleError } from '../../../helpers/response.helper'

export async function updateTapPoints(req: any, res: Response, next: NextFunction) {
  try {
    const result = await AuthService.updateTapPoints(req.body, req.user);
    sendResponse(res, result === 1 ? 200 : 400, result === 1 ? 'User Tap points updated successfully' : 'Bad Request', null, result !== 1);
  } catch (error) {
    handleError(error, res, next);
  }
}

export async function saveGamePoints(req: any, res: Response, next: NextFunction) {
  try {
    const result = await AuthService.saveGamePoints(req.body, req.user);
    result?.success
      ? sendResponse(res, 200, 'User game points saved successfully', result.user)
      : sendResponse(res, 400, 'Failed to save game points', null, true);
  } catch (error) {
    handleError(error, res, next);
  }
}
