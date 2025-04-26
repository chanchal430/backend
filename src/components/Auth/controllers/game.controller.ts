import { Request, Response, NextFunction } from 'express';
import AuthService from '../services';
import { sendResponse, handleError } from '../../../helpers/response.helper'
import userModel from '../../../config/models/user.model';

interface AuthenticatedRequest extends Request {
  user: {
    telegramUserId: string;
  };
}

export async function updateTapPoints(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = await userModel.findOne({ telegramUserId: req.user.telegramUserId });

    if (!user) {
      sendResponse(res, 404, 'User not found', null, true);
      return;
    }

    // Validate and type cast the request body
    const tapPoints = Number(req.body.tapPoints) || 0;
    const updateResult = await AuthService.updateTapPoints({ tapPoints }, user);

    sendResponse(
      res,
      updateResult ? 200 : 400,
      updateResult ? 'Tap points updated successfully' : 'Update failed',
      null,
      !updateResult
    );
  } catch (error) {
    handleError(error, res, next);
  }
}

export async function saveGamePoints(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = await userModel.findOne({ telegramUserId: req.user.telegramUserId });

    if (!user) {
      sendResponse(res, 404, 'User not found', null, true);
      return;
    }

    const gamePoints = Number(req.body.gamePoints) || 0;
    const updateResult = await AuthService.saveGamePoints({ gamePoints }, user);

    sendResponse(
      res,
      updateResult ? 200 : 400,
      updateResult ? 'Game points saved successfully' : 'Save failed',
      null,
      !updateResult
    );
  } catch (error) {
    handleError(error, res, next);
  }
}

