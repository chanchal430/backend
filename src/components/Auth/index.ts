import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import app from '../../config/server/server';
import AuthService from './service';
import HttpError from '../../config/error';
import { IUserModel } from '../../config/models/user.model';


/**
 * @export
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise < void >}
 */
export async function saveTelegramId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const user = await AuthService.saveTelegramId(req.body);
        if (user == 1) {
            res.status(200).json({
                status: 200,
                error: false,
                message: 'User Telegram Id connected successfully',
            });
        }
        else {
            res.status(400).json({
                status: 400,
                error: true,
                message: 'Bad Request',
            });
        }

    } catch (error) {
        if (error.code === 500) {
            return next(new HttpError(error.message.status, error.message));
        }
        res.status(400).json({
            status: 400,
            error: true,
            message: error.message,
        });
    }
}



/**
 * @export
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise < void >}
 */
export async function updateUser(req: any, res: Response, next: NextFunction): Promise<void> {
    try {
        const user = await AuthService.updateUser(req.body,req.user);

        if (user == 1) {
            res.status(200).json({
                status: 200,
                error: false,
                message: 'User profile updated successfully',
            });
        }
        else if (user == 2) {
            res.status(400).json({
                status: 400,
                error: true,
                message: 'Email has already been registered',// Inavlid telegram ID,User doesnt exist
            });
        }
        else if (user == 0) {
            res.status(400).json({
                status: 400,
                error: true,
                message: 'Bad Request',// Inavlid telegram ID,User doesnt exist
            });
        }
        else {
            res.status(400).json({
                status: 400,
                error: true,
                message: 'Bad Request',
            });
        }

    } catch (error) {
        if (error.code === 500) {
            return next(new HttpError(error.message.status, error.message));
        }
        res.status(400).json({
            status: 400,
            error: true,
            message: error.message,
        });
    }
}



/**
 * @export
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise < void >}
 */
export async function updateTapPoints(req: any, res: Response, next: NextFunction): Promise<void> {
    try {
        const user = await AuthService.updateTapPoints(req.body, req.user);

        if (user == 1) {
            res.status(200).json({
                status: 200,
                error: false,
                message: 'User Tap points updated successfully',
            });
        }
        else if (user == 0) {
            res.status(400).json({
                status: 400,
                error: true,
                message: 'Bad Request',// Inavlid telegram ID,User doesnt exist
            });
        }
        else {
            res.status(400).json({
                status: 400,
                error: true,
                message: 'Bad Request',
            });
        }
    } catch (error) {
        if (error.code === 500) {
            return next(new HttpError(error.message.status, error.message));
        }
        res.status(400).json({
            status: 400,
            error: true,
            message: error.message,
        });
    }
}



/**
 * @export
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise < void >}
 */
export async function getQuestions(req: any, res: Response, next: NextFunction): Promise<void> {
    try {
        const host = req.get("host");
        const user = await AuthService.getQuestions(req.body,req.user,host);

        if (user == 0) {
            res.status(400).json({
                status: 400,
                error: true,
                message: 'Failed to fetch quiz questions',
            });
        }
        else if (user && user.success == true) {
            res.status(200).json({
                status: 200,
                error: false,
                message: 'Questions fetched successfully',
                data:user.questions
            });
        }
        else {
            res.status(400).json({
                status: 400,
                error: true,
                message: 'Bad Request',
            });
        }
    } catch (error) {
        if (error.code === 500) {
            return next(new HttpError(error.message.status, error.message));
        }
        res.status(400).json({
            status: 400,
            error: true,
            message: 'Bad Request',
        });
    }
}



/**
 * @export
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise < void >}
 */
export async function saveGamePoints(req: any, res: Response, next: NextFunction): Promise<void> {
    try {
        const user = await AuthService.saveGamePoints(req.body,req.user);

        if (user == 0) {
            res.status(400).json({
                status: 400,
                error: true,
                message: 'Failed to save game points',
            });
        }
        else if (user && user.success == true) {
            res.status(200).json({
                status: 200,
                error: false,
                message: 'User game points saved successfully',
                data: user.user
            });
        }
        else {
            res.status(400).json({
                status: 400,
                error: true,
                message: 'Bad Request',
            });
        }
    } catch (error) {
        if (error.code === 500) {
            return next(new HttpError(error.message.status, error.message));
        }
        res.status(400).json({
            status: 400,
            error: true,
            message: 'Bad Request',
        });
    }
}



/**
 * @export
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise < void >}
 */
export async function invite(req: any, res: Response, next: NextFunction): Promise<void> {
    try {
        const user = await AuthService.invite(req.body,req.user);
        if (user == 0) {
            res.status(400).json({
                status: 400,
                error: true,
                message: 'Failed to send invite',
            });
        }
        else if (user && user.success == true) {
            res.status(200).json({
                status: 200,
                error: false,
                message: 'Invite code generated successfully',
                data: user.referralId
            });
        }
        else {
            res.status(400).json({
                status: 400,
                error: true,
                message: 'Bad Request',
            });
        }
    } catch (error) {
        if (error.code === 500) {
            return next(new HttpError(error.message.status, error.message));
        }
        res.status(400).json({
            status: 400,
            error: true,
            message: 'Bad Request',
        });
    }
}



/**
 * @export
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise < void >}
 */
export async function user(req: any, res: Response, next: NextFunction): Promise<void> {
    try {
        const user = await AuthService.user(req.body, req.user);
        if (user && user.success == false) {
            res.status(400).json({
                status: 400,
                error: true,
                message: 'Failed to fetch user data',
            });
        }
        else if (user && user.success == true) {
            res.status(200).json({
                status: 200,
                error: false,
                message: 'User data fetched successfully',
                data: user.user
            });
        }
        else {
            res.status(400).json({
                status: 400,
                error: true,
                message: 'Bad Request',
            });
        }
    } catch (error) {
        if (error.code === 500) {
            return next(new HttpError(error.message.status, error.message));
        }
        res.status(400).json({
            status: 400,
            error: true,
            message: 'Bad Request',
        });
    }
}




/**
 * @export
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise < void >}
 */
export async function tasks(req: any, res: Response, next: NextFunction): Promise<void> {
    try {
        const user = await AuthService.tasks(req.body, req.user);
        if (user && user.success == false) {
            res.status(400).json({
                status: 400,
                error: true,
                message: 'Task Completion Failed',
            });
        }
        else if (user && user.success == true) {
            res.status(200).json({
                status: 200,
                error: false,
                message: 'Tasks fetched successfully',
                data: user
            });
        }
        else {
            res.status(400).json({
                status: 400,
                error: true,
                message: 'Bad Request',
            });
        }
    } catch (error) {
        if (error.code === 500) {
            return next(new HttpError(error.message.status, error.message));
        }
        res.status(400).json({
            status: 400,
            error: true,
            message: 'Bad Request',
        });
    }
}



/**
 * @export
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise < void >}
 */
export async function completeTask(req: any, res: Response, next: NextFunction): Promise<void> {
    try {
        const user = await AuthService.completeTask(req.body, req.user);
        if (user == 0) {
            res.status(400).json({
                status: 400,
                error: true,
                message: 'Task Completion Failed',
            });
        }
        else if (user == 1) {
            res.status(200).json({
                status: 200,
                error: false,
                message: 'Task Completed Successfully',
            });
        }
        else {
            res.status(400).json({
                status: 400,
                error: true,
                message: 'Bad Request',
            });
        }


    } catch (error) {
        if (error.code === 500) {
            return next(new HttpError(error.message.status, error.message));
        }
        res.status(400).json({
            status: 400,
            error: true,
            message: 'Bad Request',
        });
    }
}