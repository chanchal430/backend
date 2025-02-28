const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  walletAddress: {
    type: String,
    // required: true,
    unique: true,
    default: null,
    sparse: true,
  },

  telegramUserId: { type: String, required: true, unique: true },

  firstName: { type: String, default: "" },
  lastName: { type: String, default: "" },
  email: { type: String, unique: true, sparse: true, default: null },

  // Task Points Management
  taskPoints: { type: Number, default: 0 },
  tapPoints: { type: Number, default: 0 },
  gamePoints: { type: Number, default: 0 },
  totalPoints: { type: Number, default: 0 },

  // Task Completion Tracking with Completion Status
  completedDailyTasks: [
    {
      taskId: { type: Number, required: true },
      completed: { type: Boolean, default: false }, // ✅ NEW FLAG
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
  // Tracks games played today
  gameHistory: [
    {
      gameId: { type: Number, required: true },
      date: { type: String, required: true }, // Stores as 'YYYY-MM-DD'
      played: { type: Boolean, default: false }, // ✅ True if played, false if not
    },
  ],

  // Tracks number of times each game was played
  // playedGames: {
  //   type: Map,
  //   of: Number, // Maps gameId -> play count
  //   default: {},
  // },

  // ✅ Store Last Reset Time as Date (Includes both Date & Time)
  lastResetDate: { type: Date, default: Date.now },
  // Task Reset Time Tracking
  lastDailyReset: { type: Date, default: Date.now },
  lastWeeklyReset: { type: Date, default: Date.now },
  lastMonthlyReset: { type: Date, default: Date.now },

  // Last Tap Timestamp (For tap points system)
  lastTapTimestamp: { type: Date, default: null },

  // Timestamp tracking for user creation and updates
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Auto-update `updatedAt` before saving
UserSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
