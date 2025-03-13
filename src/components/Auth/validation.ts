import * as Joi from 'joi';
import Validation from '../validation';
import { IUserModel } from '../../config/models/user.model';

/**
 * @export
 * @class AuthValidation
 * @extends Validation
 */
class AuthValidation extends Validation {
    /**
     * Creates an instance of AuthValidation.
     * @memberof AuthValidation
     */
    constructor() {
        super();
    }

    /**
     * @param {IUserModel} params
     * @returns {Joi.ValidationResult}
     * @memberof UserValidation
     */
    saveTelegramId(
        params: IUserModel,
    ): Joi.ValidationResult {
        const schema: Joi.Schema = Joi.object().keys({
            telegramUserId: Joi.string().trim().pattern(/^[0-9]+$/).min(1).required(),
        });

        return schema.validate(params);
    }


    /**
     * @param {IUserModel} params
     * @returns {Joi.ValidationResult}
     * @memberof UserValidation
     */
    saveGamePoints(
        params: IUserModel,
    ): Joi.ValidationResult {
        const schema: Joi.Schema = Joi.object().keys({
            gameId:Joi.number().min(1).required(),
            gameCoins:Joi.number().min(0).required()
        });

        return schema.validate(params);
    }


    /**updateUser
     * @param {IUserModel} params
     * @returns {Joi.ValidationResult}
     * @memberof UserValidation
     */
    invite(
        params: IUserModel,
    ): Joi.ValidationResult {
        const schema: Joi.Schema = Joi.object().keys({
            
        });

        return schema.validate(params);
    }


    /**
     * @param {IUserModel} params
     * @returns {Joi.ValidationResult}
     * @memberof UserValidation
     */
    completeTask(
        params: IUserModel,
    ): Joi.ValidationResult {
        const schema: Joi.Schema = Joi.object().keys({
            taskId:Joi.number().min(1).required(),
            taskType:Joi.string().trim().valid('dailyTasks', 'weeklyTasks', 'monthlyTasks').required(),
            points:Joi.number().min(1).required(),
        });

        return schema.validate(params);
    }


    /**
     * @param {IUserModel} params
     * @returns {Joi.ValidationResult}
     * @memberof UserValidation
     */
    updateTapPoints(
        params: IUserModel,
    ): Joi.ValidationResult {
        const schema: Joi.Schema = Joi.object().keys({
            points:Joi.number().min(0).max(500).required(),
        });

        return schema.validate(params);
    }


    /**
     * @param {IUserModel} params
     * @returns {Joi.ValidationResult}
     * @memberof UserValidation
     */
    updateUser(
        params: IUserModel,
    ): Joi.ValidationResult {
        const schema: Joi.Schema = Joi.object().keys({
            firstName: Joi.string().lowercase().trim().regex(/^[a-z]+$/).min(2).max(20).allow(''),
            lastName: Joi.string().lowercase().trim().regex(/^[a-z]+$/).min(2).max(20).allow(''),
            email: Joi.string().trim().email({
                minDomainSegments: 2,
            }).min(0).allow(''),
        });

        return schema.validate(params);
    }


    /**
     * @param {IUserModel} params
     * @returns {Joi.ValidationResult}
     * @memberof UserValidation
     */
    getQuestions(
        params: IUserModel,
    ): Joi.ValidationResult {
        const schema: Joi.Schema = Joi.object().keys({
            
        });

        return schema.validate(params);
    }



    /**
     * @param {IUserModel} params
     * @returns {Joi.ValidationResult}
     * @memberof UserValidation
     */
    user(
        params: IUserModel,
    ): Joi.ValidationResult {
        const schema: Joi.Schema = Joi.object().keys({
        });

        return schema.validate(params);
    }


    /**
     * @param {IUserModel} params
     * @returns {Joi.ValidationResult}
     * @memberof UserValidation
     */
    tasks(
        params: IUserModel,
    ): Joi.ValidationResult {
        const schema: Joi.Schema = Joi.object().keys({
        });

        return schema.validate(params);
    }


}

export default new AuthValidation();
