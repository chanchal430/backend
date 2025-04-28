import { IUserModel } from "../../config/models/user.model";



interface TaskCompletion {
    taskId: number;
    completed: boolean;
    completedAt: Date | null;
  }
  
  interface GameHistoryEntry {
    gameId: number;
    date: string;
    played: boolean;
  }

export interface IUserService {
    
    /**
     * @param {IUserModel} userModel
     * @returns {Promise<IUserModel>}
     * @memberof AuthService
     */
    saveTelegramId(body: { telegramId: string }): Promise<IUserModel>;

    /**
     * @param {IUserModel} userModel
     * @returns {Promise<IUserModel>}
     * @memberof AuthService
     */
    updateUser(body: Partial<IUserModel>, user: IUserModel): Promise<IUserModel>;

    /**
     * @param {IUserModel} userModel
     * @returns {Promise<IUserModel>}
     * @memberof AuthService
     */
    user(body: Record<string, unknown>, user: IUserModel): Promise<IUserModel>;

}

export interface IGameService {
    /**
     * @param {IUserModel} userModel
     * @returns {Promise<IUserModel>}
     * @memberof AuthService
     */
    saveGamePoints(body: { gamePoints: number }, user: IUserModel): Promise<IUserModel>;


    /**
     * @param {IUserModel} userModel
     * @returns {Promise<IUserModel>}
     * @memberof AuthService
     */
    updateTapPoints(body: { tapPoints: number }, user: IUserModel): Promise<IUserModel>;

}

export interface IInviteService {
    /**
     * @param {IUserModel} userModel
     * @returns {Promise<IUserModel>}
     * @memberof AuthService
     */
    invite(body: { recipient: string }, user: IUserModel):  Promise<{ success: boolean; referralId?: string }>;
}

export interface IQuizService {
    /**
     * @param {IUserModel} userModel
     * @returns {Promise<IUserModel>}
     * @memberof AuthService
     */
    getQuestions(
      body: { category: string },
      user: IUserModel,
      host: string
    ): Promise<{
      success: boolean;
      questions?: ProcessedQuestion[];
    }>;  
}


export interface ProcessedQuestion {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
  images: string[];
  played: boolean;
}

export interface ITaskService {
    /**
     * @param {IUserModel} userModel
     * @returns {Promise<IUserModel>}
     * @memberof AuthService
     */
    completeTask(body: { taskId: number }, user: IUserModel): Promise<IUserModel>;

    /**
     * @param {IUserModel} userModel
     * @returns {Promise<IUserModel>}
     * @memberof AuthService
     */
    tasks(
        body: { frequency?: 'daily' | 'weekly' | 'monthly' },
        user: IUserModel
      ): Promise<{
        daily: TaskCompletion[];
        weekly: TaskCompletion[];
        monthly: TaskCompletion[];
      }>;
}