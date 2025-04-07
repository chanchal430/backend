import { ITaskService } from "../interface";
import AuthValidation from '../validation';
import UserModel from '../../../config/models/user.model';

const RESET_INTERVALS = {
  daily: 86400000,
  weekly: 604800000,
  monthly: 2592000000,
} as const;

type TaskType = keyof typeof RESET_INTERVALS;

type ResetField = 'lastDailyReset' | 'lastWeeklyReset' | 'lastMonthlyReset';
type CompletedField = 'completedDailyTasks' | 'completedWeeklyTasks' | 'completedMonthlyTasks';

const defineTasks = (type: TaskType, allTasks: any[], completedTaskIds: number[]) => {
  return allTasks.map(task => ({
    ...task,
    completed: completedTaskIds.includes(task.id),
  }));
};

const ALL_TASKS = {
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

const TaskService: ITaskService = {

  async tasks(_, reqUser) {
    const user = await UserModel.findOne({ telegramUserId: reqUser.telegramUserId });
    if (!user) throw new Error('User not found');

    const now = Date.now();
    let needsSave = false;

    (['daily', 'weekly', 'monthly'] as TaskType[]).forEach(type => {
      const resetField = `last${type.charAt(0).toUpperCase() + type.slice(1)}Reset` as ResetField;
      const completedField = `completed${type.charAt(0).toUpperCase() + type.slice(1)}Tasks` as CompletedField;

      if (!user[resetField]) user[resetField] = 0;
      if (!user[completedField]) user[completedField] = [];

      if (now - user[resetField] > RESET_INTERVALS[type]) {
        user[completedField] = [];
        user[resetField] = now;
        needsSave = true;
      }
    });

    if (needsSave) await user.save();

    return {
      success: true,
      dailyTasks: defineTasks('daily', ALL_TASKS.daily, user.completedDailyTasks?.map((t: any) => t.taskId) || []),
      weeklyTasks: defineTasks('weekly', ALL_TASKS.weekly, user.completedWeeklyTasks?.map((t: any) => t.taskId) || []),
      monthlyTasks: defineTasks('monthly', ALL_TASKS.monthly, user.completedMonthlyTasks?.map((t: any) => t.taskId) || []),
    };
  },

  async completeTask(body, reqUser) {
    const { error, value } = AuthValidation.completeTask(body);
    if (error) throw new Error(error.message);

    const user = await UserModel.findOne({ telegramUserId: reqUser.telegramUserId }) as any;

    if (!user) throw new Error('User not found');

    const { taskId, taskType, points } = value;
    const type = taskType.replace('Tasks', '').toLowerCase() as TaskType;
    if (!Object.keys(RESET_INTERVALS).includes(type)) {
      throw new Error('Invalid task type');
    }

    const now = Date.now();
    const resetField = `last${type.charAt(0).toUpperCase() + type.slice(1)}Reset` as ResetField;
    const completedField = `completed${type.charAt(0).toUpperCase() + type.slice(1)}Tasks` as CompletedField;

    if (!user[resetField]) user[resetField] = 0;
    if (!user[completedField]) user[completedField] = [];

    if (now - user[resetField] > RESET_INTERVALS[type]) {
      user[completedField] = [];
      user[resetField] = now;
    }

    const index = user[completedField].findIndex((task: any) => task.taskId === taskId);
    if (index !== -1 && user[completedField][index].completed) return 0;

    const newTask = { taskId, completed: true, completedAt: now };
    if (index === -1) user[completedField].push(newTask);
    else Object.assign(user[completedField][index], newTask);

    user.taskPoints += points;
    user.totalPoints = user.taskPoints + user.tapPoints + user.gamePoints;
    await user.save();
    return 1;
  },
};

export default TaskService;