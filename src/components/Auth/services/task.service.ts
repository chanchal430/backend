import { ITaskService } from "../interface";
import AuthValidation from '../validation';
import UserModel, { CompletedTask } from '../../../config/models/user.model';
import { IUserModel } from "../../../config/models/user.model";


type TaskType = 'daily' | 'weekly' | 'monthly';
type ResetField = 'lastDailyReset' | 'lastWeeklyReset' | 'lastMonthlyReset';
type CompletedField = 'completedDailyTasks' | 'completedWeeklyTasks' | 'completedMonthlyTasks';

interface Task {
  id: number;
  platform: string;
  description: string;
  coins: number;
  link: string;
  icon: string;
}

interface PlatformTask {
  id: number;
  platform: string;
  description: string;
  coins: number;
  link: string;
  icon: string;
}

const RESET_INTERVALS: Record<TaskType, number> = {
  daily: 86400000,
  weekly: 604800000,
  monthly: 2592000000,
};

const ALL_TASKS: Record<TaskType, Task[]> = {
  daily: [
    { id: 1, platform: 'Youtube', description: 'Subscribe', coins: 10, link: 'https://www.youtube.com/', icon: 'https://cdn-icons-png.flaticon.com/512/1384/1384060.png' },
    { id: 2, platform: 'Instagram', description: 'Follow', coins: 20, link: 'https://www.instagram.com/', icon: 'https://cdn-icons-png.flaticon.com/512/174/174855.png' },
    { id: 3, platform: 'Twitter', description: 'Follow', coins: 30, link: 'https://twitter.com/', icon: 'https://cdn-icons-png.flaticon.com/512/733/733579.png' },
    { id: 4, platform: 'Linkedin', description: 'Connect', coins: 40, link: 'https://www.linkedin.com/', icon: 'https://cdn-icons-png.flaticon.com/512/174/174857.png' },
  ],
  weekly: [
    { id: 5, platform: 'Twitter', description: 'Retweet', coins: 50, link: 'https://twitter.com/', icon: 'https://cdn-icons-png.flaticon.com/512/733/733579.png' },
    { id: 6, platform: 'Instagram', description: 'Like & comment', coins: 60, link: 'https://www.instagram.com/', icon: 'https://cdn-icons-png.flaticon.com/512/174/174855.png' },
    { id: 7, platform: 'LinkedIn', description: 'Engage', coins: 70, link: 'https://www.linkedin.com/', icon: 'https://cdn-icons-png.flaticon.com/512/174/174857.png' },
  ],
  monthly: [
    { id: 8, platform: 'Facebook', description: 'Join group', coins: 80, link: 'https://www.facebook.com/', icon: 'https://cdn-icons-png.flaticon.com/512/124/124010.png' },
    { id: 9, platform: 'Reddit', description: 'Follow', coins: 90, link: 'https://www.reddit.com/', icon: 'https://cdn-icons-png.flaticon.com/512/2111/2111589.png' },
    { id: 10, platform: 'Medium', description: 'Follow', coins: 100, link: 'https://medium.com/', icon: 'https://cdn-icons-png.flaticon.com/512/5968/5968906.png' },
  ],
};

const defineTasks = (
  type: TaskType,
  allTasks: PlatformTask[],
  completedTasks: CompletedTask[]
): Array<PlatformTask & { completed: boolean }> => {
  const completedIds = completedTasks
    .filter(t => t.completed)
    .map(t => t.taskId);
    
  return allTasks.map(task => ({
    ...task,
    completed: completedIds.includes(task.id)
  }));
};

const TaskService: ITaskService = {
  async tasks(body: { frequency?: TaskType }, user: IUserModel) {
    const now = Date.now();
    let needsSave = false;

    (['daily', 'weekly', 'monthly'] as TaskType[]).forEach(type => {
      const resetField = `last${type.charAt(0).toUpperCase() + type.slice(1)}Reset` as ResetField;
      const completedField = `completed${type.charAt(0).toUpperCase() + type.slice(1)}Tasks` as CompletedField;

      const currentReset = user[resetField] || 0;
      const currentCompleted = user[completedField];

      if (now - currentReset > RESET_INTERVALS[type]) {
        user[resetField] = now;
        user[completedField] = [];
        needsSave = true;
      }
    });

    if (needsSave) await user.save();

    return {
      success: true,
      dailyTasks: defineTasks('daily', ALL_TASKS.daily, user.completedDailyTasks),
      weeklyTasks: defineTasks('weekly', ALL_TASKS.weekly, user.completedWeeklyTasks),
      monthlyTasks: defineTasks('monthly', ALL_TASKS.monthly, user.completedMonthlyTasks)
    };
  },

  async completeTask(body: { taskId: number; taskType: string; points: number }, user: IUserModel): Promise<boolean> {
    const { error, value } = AuthValidation.completeTask(body);
    if (error) throw new Error(error.message);

    const { taskId, taskType, points } = value;
    const type = taskType.replace('Tasks', '').toLowerCase() as TaskType;
    
    if (!(type in RESET_INTERVALS)) {
      throw new Error('Invalid task type');
    }

    const resetField = `last${type.charAt(0).toUpperCase() + type.slice(1)}Reset` as ResetField;
    const completedField = `completed${type.charAt(0).toUpperCase() + type.slice(1)}Tasks` as CompletedField;

    const currentCompleted = user[completedField];
    const currentReset = user[resetField] || 0;

    if (Date.now() - currentReset > RESET_INTERVALS[type]) {
      user[resetField] = Date.now();
      user[completedField] = [];
    }

    const existingTask = currentCompleted.find(t => t.taskId === taskId);
    if (existingTask?.completed) return false;

    if (existingTask) {
      existingTask.completed = true;
      existingTask.completedAt = new Date();
    } else {
      currentCompleted.push({ 
        taskId, 
        completed: true, 
        completedAt: new Date() 
      });
    }

    user.taskPoints += points;
    user.totalPoints = user.taskPoints + user.tapPoints + user.gamePoints;
    await user.save();
    return true;
  },
};

export default TaskService;
