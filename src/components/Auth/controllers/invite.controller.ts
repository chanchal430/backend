import { Request, Response, NextFunction } from 'express';
import AuthService from '../services';
import { sendResponse, handleError } from '../../../helpers/response.helper'

export async function invite(req: any, res: Response, next: NextFunction) {
  try {
    const result = await AuthService.invite(req.body, req.user);
    result?.success
      ? sendResponse(res, 200, 'Invite code generated successfully', result.referralId)
      : sendResponse(res, 400, 'Failed to send invite', null, true);
  } catch (error) {
    handleError(error, res, next);
  }
}
