import { Document, Schema } from 'mongoose';
import * as connections from '../connection/connection';



/**
 * @export
 * @interface IUserModel
 * @extends {Document}
 */
export interface IUserModel extends Document {
    telegramUserId: string;
    firstName: string;
    lastName: string;
    email: string;
    taskPoints: number;
    tapPoints: number;
    gamePoints: number;
    totalPoints: number;
    completedDailyTasks: [];
    completedWeeklyTasks: [];
    completedMonthlyTasks: [];
    gameHistory: [];
    lastResetDate: number;
    lastDailyReset: number;
    lastWeeklyReset: number;
    lastMonthlyReset: number;
    lastTapTimestamp: number;
}

const UserSchema: Schema = new Schema({
    
    telegramUserId:
    {
        type: String,
        required: true,
        unique: true
    },
    firstName:
    {
        type: String,
        default: ""
    },
    lastName:
    {
        type: String,
        default: ""
    },
    email:
    {
        type: String,
        // unique: true,
        default: ""
    },
    // Task Points Management
    taskPoints:
    {
        type: Number,
        default: 0
    },
    tapPoints:
    {
        type: Number,
        default: 0
    },
    gamePoints:
    {
        type: Number,
        default: 0
    },
    totalPoints:
    {
        type: Number,
        default: 0
    },
    // Task Completion Tracking with Completion Status
    completedDailyTasks: [
        {
            taskId: { type: Number, required: true },
            completed: { type: Boolean, default: false },
            completedAt: { type: Date, default: null },
        },
    ],
    completedWeeklyTasks: [
        {
            taskId: { type: Number, required: true },
            completed: { type: Boolean, default: false },
            completedAt: { type: Date, default: null },
        },
    ],
    completedMonthlyTasks: [
        {
            taskId: { type: Number, required: true },
            completed: { type: Boolean, default: false },
            completedAt: { type: Date, default: null },
        },
    ],
    // Tracks games played today
    gameHistory: [
        {
            gameId: { type: Number, required: true },
            date: { type: String, required: true }, // Stores as 'YYYY-MM-DD'
            played: { type: Boolean, default: false }, //  True if played, false if not
        },
    ],

    lastResetDate: {
        type: Number,
        default: Date.now()
    },
    lastDailyReset:
    {
        type: Number,
        default: Date.now()
    },
    lastWeeklyReset:
    {
        type: Number,
        default: Date.now()
    },
    lastMonthlyReset:
    {
        type: Number,
        default: Date.now()
    },
    lastTapTimestamp:
    {
        type: Number,
        default: null
    },
}, {
    collection: 'users',
    versionKey: false,
    timestamps: true
});


export default connections.db.model<IUserModel>('users', UserSchema);
