import * as Joi from 'joi';
import AuthValidation from './validation';
import UserModel, { IUserModel } from '../../config/models/user.model';
import { IAuthService } from './interface';
import * as path from "path";
import * as fs from "fs";
/**
 * @export
 * @implements {IAuthService}
 */
const AuthService: IAuthService = {
    /**
     * @param {IUserModel} body
     * @returns {Promise <IUserModel>}
     * @memberof AuthService
     */
    async saveTelegramId(body: any): Promise<any> {
        try {
            const validate: Joi.ValidationResult = AuthValidation.saveTelegramId(body);
            if (validate.error) {
                throw new Error(validate.error.message);
            }
            const obj = validate.value;
            let user;
            user = await UserModel.findOne({ telegramUserId: obj.telegramUserId });
            if (!user) {
                user = new UserModel({
                    telegramUserId: obj.telegramUserId,
                    firstName: "",
                    lastName: "",
                    taskPoints: 0,
                    tapPoints: 0,
                    gamePoints: 0,
                    totalPoints: 0,
                });
                await user.save();
                return 1;
            }
            else {
                return 1;
            }
        } catch (error) {
            throw new Error(error);
        }
    },
    /**
     * @param {IUserModel} body
     * @returns {Promise <IUserModel>}
     * @memberof AuthService
     */
    async saveGamePoints(body: IUserModel, User: any): Promise<any> {
        try {
            const validate: Joi.ValidationResult = AuthValidation.saveGamePoints(body);

            if (validate.error) {
                throw new Error(validate.error.message);
            }

            const { gameId, gameCoins } = validate.value;
            let user = User;

            //Load game data from JSON file
            const gamesFilePath = path.join(
                __dirname,
                "../assets/data/questions.json"
            );
            const gamesData = JSON.parse(fs.readFileSync(gamesFilePath, "utf-8"));
            //Validate game ID
            const game = gamesData.find((g: any) => g.id === gameId);
            if (!game) {
                return 0;
            }

            // Get current date in YYYY-MM-DD format
            const now = new Date();
            const today = now.toISOString().split("T")[0]; // e.g., "2025-02-11"
            const lastReset = user.lastResetDate
                ? new Date(user.lastResetDate)
                : null;
            const lastResetDate = lastReset
                ? lastReset.toISOString().split("T")[0]
                : null;

            // Reset game history if a new day has started
            if (!lastReset || lastResetDate !== today) {
                user.gameHistory = []; // Reset game history
                user.lastResetDate = now; // Update last reset date with current timestamp
            }

            // Check if the user has already played this game today
            const hasPlayedToday = user.gameHistory.some(
                (entry: any) => entry.gameId === gameId && entry.date === today
            );

            if (hasPlayedToday) {
                return 0;
            }

            //Add game to history
            user.gameHistory.push({ gameId, date: today, played: true });

            //Increment game points
            user.gamePoints += gameCoins;

            //Update total points
            user.totalPoints = user.taskPoints + user.tapPoints + user.gamePoints;

            await user.save();

            return 1;
        } catch (error) {
            throw new Error(error);
        }
    },
    /**
     * @param {IUserModel} body
     * @returns {Promise <IUserModel>}
     * @memberof AuthService
     */
    async invite(body: any, User: any): Promise<any> {
        try {
            const validate: Joi.ValidationResult = AuthValidation.invite(body);
            if (validate.error) {
                throw new Error(validate.error.message);
            }
            const telegramUserId = User.telegramUserId;
            // Find the user by wallet address and get their referral ID
            const usr = await UserModel.findOne({ telegramUserId });
            if (!usr || !usr._id) {
                return 0;
            }
            const referralId = usr._id;
            if (!referralId) {
                return 0
            }
            return {
                success: true,
                referralId
            };
        } catch (error) {
            throw new Error(error);
        }
    },
    /**
     * @param {IUserModel} body
     * @returns {Promise <IUserModel>}
     * @memberof AuthService
     */
    async completeTask(body: any, User: any): Promise<any> {
        try {
            const validate: Joi.ValidationResult = AuthValidation.completeTask(body);

            if (validate.error) {
                throw new Error(validate.error.message);
            }
            const { taskId, taskType, points } = validate.value;
            let user = User;
            const now = Date.now();
            // Define reset durations
            const RESET_TIMES: any = {
                daily: 24 * 60 * 60 * 1000, // 24 hours
                weekly: 7 * 24 * 60 * 60 * 1000, // 7 days
                monthly: 30 * 24 * 60 * 60 * 1000, // 30 days
            };
            const typeKey = taskType.replace("Tasks", ""); // Convert "dailyTasks" -> "daily"
            const completedTasksField = `completed${typeKey.charAt(0).toUpperCase() + typeKey.slice(1)
                }Tasks`;
            const lastResetField = `last${typeKey.charAt(0).toUpperCase() + typeKey.slice(1)
                }Reset`;

            // Reset tasks if the reset time has passed
            if (
                !user[lastResetField] ||
                now - user[lastResetField] > RESET_TIMES[typeKey]
            ) {
                user[completedTasksField] = []; // Reset completed tasks
                user[lastResetField] = now; // Update reset timestamp
            }

            // Check if task is already completed
            const taskIndex = user[completedTasksField].findIndex(
                (task: any) => task.taskId === taskId
            );

            if (taskIndex !== -1 && user[completedTasksField][taskIndex].completed) {
                return 0;
            }

            if (taskIndex === -1) {
                // New task completion
                user[completedTasksField].push({
                    taskId,
                    completed: true,
                    completedAt: now,
                });
            } else {
                // Update existing task status
                user[completedTasksField][taskIndex].completed = true;
                user[completedTasksField][taskIndex].completedAt = now;
            }

            // Update user points securely
            user.taskPoints += points;
            user.totalPoints = user.taskPoints + user.tapPoints + user.gamePoints;

            await user.save();
            return 1;


        } catch (error) {
            throw new Error(error);
        }
    },
    /**
     * @param {IUserModel} body
     * @returns {Promise <IUserModel>}
     * @memberof AuthService
     */
    async updateTapPoints(body: any, user: any): Promise<any> {
        try {
            const validate: Joi.ValidationResult = AuthValidation.updateTapPoints(body);

            if (validate.error) {
                throw new Error(validate.error.message);
            }
            const points = validate.value.points;
            const MAX_TAP_POINTS = 20; // Daily limit for tap points
            const TAP_RESET_HOURS = 24; // Time before tap points reset
            
            let User = user; // User fetched from middleware

            const now = Date.now();
            const lastTap = User.lastTapTimestamp || new Date(0); // Default to epoch if null
            const timeDifference = (now - lastTap) / (1000 * 60 * 60); // Difference in hours

            // If 24 hours have passed, reset tapPoints
            if (timeDifference >= TAP_RESET_HOURS) {
                User.tapPoints = 0;
                User.lastTapTimestamp = now;
            }

            // Ensure tapPoints do not exceed MAX_TAP_POINTS
            if (User.tapPoints + points > MAX_TAP_POINTS) {
                throw new Error(`You have reached the daily limit of ${MAX_TAP_POINTS} tap points. Try again in ${Math.ceil(
                    TAP_RESET_HOURS - timeDifference
                )} hours.`)
            }
            // Increment tapPoints and update totalPoints
            User.tapPoints += points;
            User.totalPoints = User.taskPoints + User.tapPoints + User.gamePoints;
            User.lastTapTimestamp = now; // Update last tap time

            await user.save();

            return 1;
        }
        catch (error) {
            throw new Error(error);
        }
    },
    /**
     * @param {IUserModel} body
     * @returns {Promise <IUserModel>}
     * @memberof AuthService
     */
    async updateUser(body: any, User: any): Promise<any> {
        try {
            const validate: Joi.ValidationResult = AuthValidation.updateUser(body);

            if (validate.error) {
                throw new Error(validate.error.message);
            }
            const obj = validate.value;
            let result: any = {};

            if (obj.firstName == "" || !obj.firstName) {
            }
            else {
                result['firstName'] = obj.firstName
            }

            if (obj.lastName == "" || !obj.lastName) {
            }
            else {
                result['lastName'] = obj.lastName
            }

            if (obj.email == "" || !obj.email) {
            }
            else {
                const dupEmailcheck = await UserModel.findOne({
                    email: obj.email,
                });
                if (dupEmailcheck && dupEmailcheck.telegramUserId != User.telegramUserId) {
                    return 2;
                }
                else {
                    result['email'] = obj.email
                }
            }



            let user = await UserModel.findOne({ telegramUserId: User.telegramUserId });

            if (!user) {
                return 0;
            }

            else {
                const newUser = await UserModel.findOneAndUpdate({
                    telegramUserId: User.telegramUserId
                }, {
                    ...result
                }, {
                    new: true
                })

                return 1;
            }


        } catch (error) {
            throw new Error(error);
        }
    },
    /**
     * @param {IUserModel} body
     * @returns {Promise <IUserModel>}
     * @memberof AuthService
     */
    async getQuestions(body: any, User: any, host: any): Promise<any> {
        try {
            const validate: Joi.ValidationResult = AuthValidation.getQuestions(body);

            if (validate.error) {
                throw new Error(validate.error.message);
            }

            let user = User;

            const questionsFilePath = path.join(__dirname, "../../../assets/data/questions.json");

            // Check if file exists before reading
            if (!fs.existsSync(questionsFilePath)) {
                console.error("Error: File not found -", questionsFilePath);
                return 0;
            }

            // Read JSON file safely
            let questions = JSON.parse(fs.readFileSync(questionsFilePath, "utf-8"));

            // Get today's date (YYYY-MM-DD)
            const today = new Date().toISOString().split("T")[0];

            // Initialize game history if not present
            if (!user.gameHistory) {
                user.gameHistory = [];
            }

            const baseUrl = `https://${host}`
            
            // Add `played` flag (true if played today, false otherwise)
            questions = questions.map((question: any, index: any) => {
                const gameId = index + 1;
                const gamePlayed = user.gameHistory.some(
                    (entry: any) => entry.gameId === gameId && entry.date === today
                );

                return {
                    ...question,
                    images: question.images.map((img: any) => `${baseUrl}/assets/images/${img}`),
                    played: gamePlayed, // Indicates if the game was already played today
                };
            });

            return { success: true, questions };

        } catch (error) {
            throw new Error(error);
        }
    },
    /**
     * @param {IUserModel} body
     * @returns {Promise <IUserModel>}
     * @memberof AuthService
     */
    async user(body: any, usr: any): Promise<any> {
        try {
            const validate: Joi.ValidationResult = AuthValidation.user(body);

            if (validate.error) {
                throw new Error(validate.error.message);
            }

            const Usr: IUserModel = await UserModel.findOne({
                telegramUserId: usr.telegramUserId,
            }).select(["firstName", "lastName", "email", "taskPoints", "tapPoints", "totalPoints", "-_id"]);


            return {
                success: true,
                user: Usr
            }


        } catch (error) {
            throw new Error(error);
        }
    },
    /**
     * @param {IUserModel} body
     * @returns {Promise <IUserModel>}
     * @memberof AuthService
     */
    async tasks(body: any, user: any): Promise<any> {
        try {
            const validate: Joi.ValidationResult = AuthValidation.tasks(body);
            if (validate.error) {
                throw new Error(validate.error.message);
            }
            const now = Date.now();
            // Reset durations
            const RESET_TIMES = {
                daily: 24 * 60 * 60 * 1000, // 24 hours
                weekly: 7 * 24 * 60 * 60 * 1000, // 7 days
                monthly: 30 * 24 * 60 * 60 * 1000, // 30 days
            };
            let needsUpdate = false;
            // **Auto Reset Mechanism**
            if (!user.lastDailyReset || now - user.lastDailyReset > RESET_TIMES.daily) {
                user.completedDailyTasks = []; // Reset daily tasks
                user.lastDailyReset = now;
                needsUpdate = true;
            }
            if (
                !user.lastWeeklyReset ||
                now - user.lastWeeklyReset > RESET_TIMES.weekly
            ) {
                user.completedWeeklyTasks = []; // Reset weekly tasks
                user.lastWeeklyReset = now;
                needsUpdate = true;
            }
            if (
                !user.lastMonthlyReset ||
                now - user.lastMonthlyReset > RESET_TIMES.monthly
            ) {
                user.completedMonthlyTasks = []; // Reset monthly tasks
                user.lastMonthlyReset = now;
                needsUpdate = true;
            }
            // Save changes only if needed
            if (needsUpdate) {
                await user.save();
            }
            // **Fetch Completed Tasks from MongoDB**
            const completedDailyTaskIds = user.completedDailyTasks.map(
                (task: any) => task.taskId
            );
            const completedWeeklyTaskIds = user.completedWeeklyTasks.map(
                (task: any) => task.taskId
            );
            const completedMonthlyTaskIds = user.completedMonthlyTasks.map(
                (task: any) => task.taskId
            );
            // **Define Tasks**
            const dailyTasks = [
                {
                    id: 1,
                    platform: "Youtube",
                    description: "Subscribe to our YouTube channel",
                    coins: 10,
                    link: "https://www.youtube.com/",
                    icon: "https://cdn-icons-png.flaticon.com/512/1384/1384060.png",
                },
                {
                    id: 2,
                    platform: "Instagram",
                    description: "Follow us on Instagram",
                    coins: 20,
                    link: "https://www.instagram.com/",
                    icon: "https://cdn-icons-png.flaticon.com/512/174/174855.png",
                },
                {
                    id: 3,
                    platform: "Twitter",
                    description: "Follow us on Twitter",
                    coins: 30,
                    link: "https://twitter.com/",
                    icon: "https://cdn-icons-png.flaticon.com/512/733/733579.png",
                },
                {
                    id: 4,
                    platform: "Linkedin",
                    description: "Connect with us on LinkedIn",
                    coins: 40,
                    link: "https://www.linkedin.com/",
                    icon: "https://cdn-icons-png.flaticon.com/512/174/174857.png",
                },
            ].map((task) => ({
                ...task,
                completed: completedDailyTaskIds.includes(task.id),
            }));

            const weeklyTasks = [
                {
                    id: 5,
                    platform: "Twitter",
                    description: "Retweet our latest post",
                    coins: 50,
                    link: "https://twitter.com/",
                    icon: "https://cdn-icons-png.flaticon.com/512/733/733579.png",
                },
                {
                    id: 6,
                    platform: "Instagram",
                    description: "Like and comment on our latest post",
                    coins: 60,
                    link: "https://www.instagram.com/",
                    icon: "https://cdn-icons-png.flaticon.com/512/174/174855.png",
                },
                {
                    id: 7,
                    platform: "LinkedIn",
                    description: "Engage with our latest post",
                    coins: 70,
                    link: "https://www.linkedin.com/",
                    icon: "https://cdn-icons-png.flaticon.com/512/174/174857.png",
                },
            ].map((task) => ({
                ...task,
                completed: completedWeeklyTaskIds.includes(task.id),
            }));

            const monthlyTasks = [
                {
                    id: 8,
                    platform: "Facebook",
                    description: "Join our Facebook group",
                    coins: 80,
                    link: "https://www.facebook.com/",
                    icon: "https://cdn-icons-png.flaticon.com/512/124/124010.png",
                },
                {
                    id: 9,
                    platform: "Reddit",
                    description: "Follow us on Reddit",
                    coins: 90,
                    link: "https://www.reddit.com/",
                    icon: "https://cdn-icons-png.flaticon.com/512/2111/2111589.png",
                },
                {
                    id: 10,
                    platform: "Medium",
                    description: "Follow us on Medium",
                    coins: 100,
                    link: "https://medium.com/",
                    icon: "https://cdn-icons-png.flaticon.com/512/5968/5968906.png",
                },
            ].map((task) => ({
                ...task,
                completed: completedMonthlyTaskIds.includes(task.id),
            }));

            return {
                success: true,
                dailyTasks,
                weeklyTasks,
                monthlyTasks,
            };

        } catch (error) {
            throw new Error(error);
        }
    },
};

export default AuthService;
