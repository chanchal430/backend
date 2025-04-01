import { ITaskService } from "../interface";
import AuthValidation from '../validation'
import * as path from 'path';
import * as fs from 'fs';
import UserModel from '../../../config/models/user.model'
import { getToday, readJSON } from "../../../utils";

const TaskService: ITaskService = {

    async tasks(_, user) {
        const now = Date.now();
        const RESET = { daily: 86400000, weekly: 604800000, monthly: 2592000000 };
        let needsSave = false;

        if (!user.lastDailyReset || now - user.lastDailyReset > RESET.daily) {
            user.completedDailyTasks = [];
            user.lastDailyReset = now;
            needsSave = true;
        }
        if (!user.lastWeeklyReset || now - user.lastWeeklyReset > RESET.weekly) {
            user.completedWeeklyTasks = [];
            user.lastWeeklyReset = now;
            needsSave = true;
        }
        if (!user.lastMonthlyReset || now - user.lastMonthlyReset > RESET.monthly) {
            user.completedMonthlyTasks = [];
            user.lastMonthlyReset = now;
            needsSave = true;
        }

        if (needsSave) await user.save();

        const completed: any = {
            daily: user.completedDailyTasks.map((t: any) => t.taskId),
            weekly: user.completedWeeklyTasks.map((t: any) => t.taskId),
            monthly: user.completedMonthlyTasks.map((t: any) => t.taskId),
        };

        const defineTasks = (type: string, tasks: any[]) =>
            tasks.map(task => ({ ...task, completed: completed[type].includes(task.id) }));

        return {
            success: true,
            dailyTasks: defineTasks('daily', [
                { id: 1, platform: 'Youtube', description: 'Subscribe', coins: 10, link: 'https://www.youtube.com/', icon: 'https://cdn-icons-png.flaticon.com/512/1384/1384060.png' },
                { id: 2, platform: 'Instagram', description: 'Follow', coins: 20, link: 'https://www.instagram.com/', icon: 'https://cdn-icons-png.flaticon.com/512/174/174855.png' },
                { id: 3, platform: 'Twitter', description: 'Follow', coins: 30, link: 'https://twitter.com/', icon: 'https://cdn-icons-png.flaticon.com/512/733/733579.png' },
                { id: 4, platform: 'Linkedin', description: 'Connect', coins: 40, link: 'https://www.linkedin.com/', icon: 'https://cdn-icons-png.flaticon.com/512/174/174857.png' },
            ]),
            weeklyTasks: defineTasks('weekly', [
                { id: 5, platform: 'Twitter', description: 'Retweet', coins: 50, link: 'https://twitter.com/', icon: 'https://cdn-icons-png.flaticon.com/512/733/733579.png' },
                { id: 6, platform: 'Instagram', description: 'Like & comment', coins: 60, link: 'https://www.instagram.com/', icon: 'https://cdn-icons-png.flaticon.com/512/174/174855.png' },
                { id: 7, platform: 'LinkedIn', description: 'Engage', coins: 70, link: 'https://www.linkedin.com/', icon: 'https://cdn-icons-png.flaticon.com/512/174/174857.png' },
            ]),
            monthlyTasks: defineTasks('monthly', [
                { id: 8, platform: 'Facebook', description: 'Join group', coins: 80, link: 'https://www.facebook.com/', icon: 'https://cdn-icons-png.flaticon.com/512/124/124010.png' },
                { id: 9, platform: 'Reddit', description: 'Follow', coins: 90, link: 'https://www.reddit.com/', icon: 'https://cdn-icons-png.flaticon.com/512/2111/2111589.png' },
                { id: 10, platform: 'Medium', description: 'Follow', coins: 100, link: 'https://medium.com/', icon: 'https://cdn-icons-png.flaticon.com/512/5968/5968906.png' },
            ]),
        };
    },


    async completeTask(body, user) {
        const { error, value } = AuthValidation.completeTask(body);
        if (error) throw new Error(error.message);

        const { taskId, taskType, points } = value;
        const now = Date.now();
        const resetDurations: any = {
            daily: 86400000,
            weekly: 604800000,
            monthly: 2592000000,
        };

        const key = taskType.replace('Tasks', '');
        const completedField = `completed${key.charAt(0).toUpperCase() + key.slice(1)}Tasks`;
        const resetField = `last${key.charAt(0).toUpperCase() + key.slice(1)}Reset`;

        if (!user[resetField] || now - user[resetField] > resetDurations[key]) {
            user[completedField] = [];
            user[resetField] = now;
        }

        const index = user[completedField].findIndex((task: any) => task.taskId === taskId);
        if (index !== -1 && user[completedField][index].completed) return 0;

        if (index === -1) {
            user[completedField].push({ taskId, completed: true, completedAt: now });
        } else {
            user[completedField][index].completed = true;
            user[completedField][index].completedAt = now;
        }

        user.taskPoints += points;
        user.totalPoints = user.taskPoints + user.tapPoints + user.gamePoints;
        await user.save();
        return 1;
    },

}

export default TaskService;
