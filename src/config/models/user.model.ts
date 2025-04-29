import { Document, Schema } from 'mongoose';
import * as connections from '../connection/connection';

export interface CompletedTask {
    taskId: number;
    completed: boolean;
    completedAt: Date | null;
  }

interface GameHistoryEntry {
  gameId: number;
  date: string; 
  played: boolean;
}

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
    completedDailyTasks: CompletedTask[];
    completedWeeklyTasks: CompletedTask[];
    completedMonthlyTasks: CompletedTask[];
    gameHistory: GameHistoryEntry[];
    lastResetDate: number;
    lastDailyReset: number;
    lastWeeklyReset: number;
    lastMonthlyReset: number;
    lastTapTimestamp: number;
}

const UserSchema: Schema = new Schema({
    telegramUserId: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        default: ""
    },
    lastName: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        default: ""
    },
    taskPoints: {
        type: Number,
        default: 0
    },
    tapPoints: {
        type: Number,
        default: 0
    },
    gamePoints: {
        type: Number,
        default: 0
    },
    totalPoints: {
        type: Number,
        default: 0
    },
    completedDailyTasks: [{
        taskId: { type: Number, required: true },
        completed: { type: Boolean, default: false },
        completedAt: { type: Date, default: null },
    }],
    completedWeeklyTasks: [{
        taskId: { type: Number, required: true },
        completed: { type: Boolean, default: false },
        completedAt: { type: Date, default: null },
    }],
    completedMonthlyTasks: [{
        taskId: { type: Number, required: true },
        completed: { type: Boolean, default: false },
        completedAt: { type: Date, default: null },
    }],
    gameHistory: [{
        gameId: { type: Number, required: true },
        date: { type: String, required: true },
        played: { type: Boolean, default: false },
    }],
    lastResetDate: {
        type: Number,
        default: Date.now
    },
    lastDailyReset: {
        type: Number,
        default: Date.now
    },
    lastWeeklyReset: {
        type: Number,
        default: Date.now
    },
    lastMonthlyReset: {
        type: Number,
        default: Date.now
    },
    lastTapTimestamp: {
        type: Number,
        default: null
    },
}, {
    collection: 'users',
    versionKey: false,
    timestamps: true
});

export default connections.db.model<IUserModel>('users', UserSchema);