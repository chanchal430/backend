import { Request, Response, NextFunction } from 'express';
import AuthService from '../services';
import { sendResponse, handleError } from '../../../helpers/response.helper'
import userModel from '../../../config/models/user.model';

export async function updateTapPoints(req: any, res: Response, next: NextFunction) {
  try {
    const user = await userModel.findOne({ telegramUserId: req.user.telegramUserId });

    if (!user) {
      return sendResponse(res, 404, 'User not found', null, true);
    }

    const result = await AuthService.updateTapPoints(req.body, user);

    sendResponse(
      res,
      result === 1 ? 200 : 400,
      result === 1 ? 'User Tap points updated successfully' : 'Bad Request',
      null,
      result !== 1
    );
  } catch (error) {
    handleError(error, res, next);
  }
}

export async function saveGamePoints(req: any, res: Response, next: NextFunction) {
  try {
    const user = await userModel.findOne({ telegramUserId: req.user.telegramUserId });

    if (!user) {
      return sendResponse(res, 404, 'User not found', null, true);
    }

    const result = await AuthService.saveGamePoints(req.body, user);
    sendResponse(
      res,
      result === 1 ? 200 : 400,
      result === 1 ? 'User game points saved successfully' : 'Bad Request',
      null,
      result !== 1
    );
  } catch (error) {
    handleError(error, res, next);
  }
}

