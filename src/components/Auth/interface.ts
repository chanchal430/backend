import { CompletedTask, IUserModel } from '../../config/models/user.model';

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
  saveTelegramId(body: { telegramUserId: string }): Promise<IUserModel>;
  updateUser(
    body: Partial<Pick<IUserModel, 'firstName' | 'lastName' | 'email'>>,
    user: Pick<IUserModel, 'telegramUserId'>
  ): Promise<IUserModel>;
  user(
    _: unknown,
    usr: Pick<IUserModel, 'telegramUserId'>
  ): Promise<{ success: boolean; user: Partial<IUserModel> | null }>;
}

export interface IGameService {
    /**
     * @param {IUserModel} userModel
     * @returns {Promise<IUserModel>}
     * @memberof AuthService
     */
    saveGamePoints(body: { gamePoints: number }, user: IUserModel): Promise<1 | 0>;

    /**
     * @param {IUserModel} userModel
     * @returns {Promise<IUserModel>}
     * @memberof AuthService
     */
    updateTapPoints(body: { tapPoints: number }, user: IUserModel): Promise<1 | 0>;

}

export interface IInviteService {
    /**
     * @param {IUserModel} userModel
     * @returns {Promise<IUserModel>}
     * @memberof AuthService
     */
    invite(body: { recipient: string }, user: IUserModel): Promise<{ success: boolean; referralId?: string }>;
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
  completeTask(body: CompleteTaskBody, user: IUserModel): Promise<boolean>;
  tasks(body: { frequency?: TaskType }, user: IUserModel): Promise<TaskResponse>;
}

export type TaskType = 'daily' | 'weekly' | 'monthly';
export interface Task {
  id: number;
  platform: string;
  description: string;
  coins: number;
  link: string;
  icon: string;
}

export interface CompleteTaskBody {
  taskId: number;
  taskType: string;
  points: number;
}

export interface TaskResponse {
  success: boolean;
  dailyTasks?: DefinedTask[];
  weeklyTasks?: DefinedTask[];
  monthlyTasks?: DefinedTask[];
}

export interface DefinedTask extends Task {
  completed: boolean;
}
