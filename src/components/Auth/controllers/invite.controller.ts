import { Request, Response, NextFunction } from 'express';
import AuthService from '../services';
import { sendResponse, handleError } from '../../../helpers/response.helper';
import { IUserModel } from '../../../config/models/user.model';

interface InviteRequestBody {
  recipient: string;
}

interface AuthenticatedRequest extends Request {
  user: IUserModel;
  body: InviteRequestBody;
}

interface InviteResult {
  success: boolean;
  referralId?: string;
}

export async function invite(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
): Promise<void> {
    try {
        if (!req.body.recipient) {
            sendResponse(res, 400, 'Recipient is required', null, true);

            return;
        }

        const result: InviteResult = await AuthService.invite(req.body, req.user);

        if (result.success) {
            sendResponse(res, 200, 'Invite code generated successfully', { referralId: result.referralId });
        } else {
            sendResponse(res, 400, 'Failed to send invite', null, true);
        }
    } catch (error) {
        handleError(error, res, next);
    }
}
