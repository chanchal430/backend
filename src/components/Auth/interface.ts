
/**
 * @export
 * @interaface IAuthService
 */
export interface IAuthService {
    /**
     * @param {IUserModel} userModel
     * @returns {Promise<IUserModel>}
     * @memberof AuthService
     */
    saveTelegramId(body: any): Promise<any>;

    /**
     * @param {IUserModel} userModel
     * @returns {Promise<IUserModel>}
     * @memberof AuthService
     */
    saveGamePoints(body: any,user:any): Promise<any>;

    /**
     * @param {IUserModel} userModel
     * @returns {Promise<IUserModel>}
     * @memberof AuthService
     */
    invite(body: any,user:any): Promise<any>;

    /**
     * @param {IUserModel} userModel
     * @returns {Promise<IUserModel>}
     * @memberof AuthService
     */
    completeTask(body: any,user:any): Promise<any>;


    /**
     * @param {IUserModel} userModel
     * @returns {Promise<IUserModel>}
     * @memberof AuthService
     */
    updateTapPoints(body: any,user:any): Promise<any>;


    /**
     * @param {IUserModel} userModel
     * @returns {Promise<IUserModel>}
     * @memberof AuthService
     */
    updateUser(body: any,user:any): Promise<any>;

    /**
     * @param {IUserModel} userModel
     * @returns {Promise<IUserModel>}
     * @memberof AuthService
     */
    getQuestions(body: any,user:any,host:any): Promise<any>;


    /**
     * @param {IUserModel} userModel
     * @returns {Promise<IUserModel>}
     * @memberof AuthService
     */
    user(body: any,user:any): Promise<any>;


    /**
     * @param {IUserModel} userModel
     * @returns {Promise<IUserModel>}
     * @memberof AuthService
     */
    tasks(body: any,user:any): Promise<any>;

}
