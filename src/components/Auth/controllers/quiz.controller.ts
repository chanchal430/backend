import { Request, Response, NextFunction } from 'express';
import AuthService from '../services';
import { sendResponse, handleError } from '../../../helpers/response.helper';
import { IUserModel } from '../../../config/models/user.model';
interface QuizRequestBody {
  category?: string;
}

interface AuthenticatedRequest extends Request {
  user: IUserModel;
  body: QuizRequestBody;
}

interface QuestionResult {
  success: boolean;
  questions?: Array<{
    id: string;
    text: string;
    options: string[];
    correctAnswer: string;
  }>;
}

export async function getQuestions(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const host = req.get('host') || '';
    
    // Validate request input
    if (!req.body.category) {
      sendResponse(res, 400, 'Category is required', null, true);
      return;
    }

    const result: QuestionResult = await AuthService.getQuestions(
      { category: req.body.category },
      req.user,
      host
    );

    if (result.success && result.questions) {
      sendResponse(res, 200, 'Questions fetched successfully', result.questions);
    } else {
      sendResponse(res, 400, 'Failed to fetch quiz questions', null, true);
    }
  } catch (error) {
    handleError(error, res, next);
  }
}