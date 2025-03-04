const mongoose = require("mongoose");
const { Schema } = mongoose;
const UserSchema = new Schema({
  walletAddress: {
    type: String,
    unique: true
  },
  telegramUserId: { type: String, required: true, unique: true },
  firstName: { type: String, default: "" },
  lastName: { type: String, default: "" },
  email: {
    type: String,
    unique: true
  },
  taskPoints: { type: Number, default: 0 },
  tapPoints: { type: Number, default: 0 },
  gamePoints: { type: Number, default: 0 },
  totalPoints: { type: Number, default: 0 },
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
  gameHistory: [
    {
      gameId: { type: Number, required: true },
      date: { type: String, required: true }, 
      played: { type: Boolean, default: false }, 
    },
  ],
  
  lastResetDate: { type: Date, default: Date.now },
  lastDailyReset: { type: Date, default: Date.now },
  lastWeeklyReset: { type: Date, default: Date.now },
  lastMonthlyReset: { type: Date, default: Date.now },
  lastTapTimestamp: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
UserSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});
const User = mongoose.model("User", UserSchema);
module.exports = User;