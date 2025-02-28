const express = require("express");
const router = express.Router();
// const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var fetchuser = require("../middleware/fetchuser");
const multer = require("multer");
const User = require("../models/User");
const path = require("path");
const fs = require("fs");
const { message } = require("telegraf/filters");

// API to connect wallet and create a user with empty fields

// Route: POST /api/save-telegram-id
router.post("/save-telegram-id", async (req, res) => {
  const { telegramUserId } = req.body;

  if (!telegramUserId) {
    return res.status(400).json({ error: "Telegram user ID is required" });
  }

  try {
    let user;

    // if (walletAddress) {
    //   user = await User.findOne({ walletAddress });

    //   if (!user) {
    //     return res.status(404).json({ error: "User not found" });
    //   }
    // } else {
    // Optionally handle creating or finding a user based only on telegramUserId
    user = await User.findOne({ telegramUserId });

    if (!user) {
      // Create new user if doesn't exist (optional logic)
      // user = new User({ telegramUserId });
      user = new User({
        telegramUserId,
        walletAddress: undefined,
        firstName: "",
        lastName: "",
        email: undefined,
        taskPoints: 0,
        tapPoints: 0,
        gamePoints: 0,
        totalPoints: 0,
      });
      // }
      await user.save();

      return res.status(200).json({
        message: "Telegram user ID successfully saved",
        // telegramUserId: user.telegramUserId,
        user,
      });
    }

    // Update Telegram User ID
    // user.telegramUserId = telegramUserId;
    return res.json({
      success: true,
      message: "User With this Telegram ID already exist",
      user,
    });
  } catch (error) {
    console.error("Error saving Telegram ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post(
  "/connectWallet",
  [
    // Validate wallet address length
    body("walletAddress", "Not A Valid Address").isLength({ min: 42 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { walletAddress } = req.body;

      // Check if the wallet address already exists
      let user = await User.findOne({ walletAddress });

      if (user) {
        return res.json({
          success: true,
          message: "User With this Wallet Address already exist",
          user,
        });
      }

      // Create a new user with default values
      user = new User({
        walletAddress,
        firstName: "",
        lastName: "",
        email: undefined,
        taskPoints: 0,
        tapPoints: 0,
        gamePoints: 0,
        totalPoints: 0,
      });

      await user.save();

      return res.json({
        success: true,
        message: "User Created Successfully",
        user,
      });

      // res.json({ success: true, user });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  }
);

// API to update user details (name and email) while keeping walletAddress fixed
router.put(
  "/updateUser",
  [
    // body("walletAddress", "Not A Valid Address").isLength({ min: 40 }),
    body("telegramUserId", "Not A Valid Telegram ID").isLength({ min: 3 }),
    body("firstName").optional().isString().trim(),
    body("lastName").optional().isString().trim(),
    body("email").optional().isEmail().trim(),
  ],
  fetchuser, // Middleware to authenticate user

  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      // const { walletAddress, firstName, lastName, email } = req.body;
      const { telegramUserId, firstName, lastName, email } = req.body;

      // Find user by wallet address
      let user = await User.findOne({ telegramUserId });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }

      // Ensure wallet address remains unchanged
      // if (user.walletAddress !== walletAddress) {
      //   return res.status(400).json({
      //     success: false,
      //     error: "Wallet address cannot be changed",
      //   });
      // }
      if (user.telegramUserId !== telegramUserId) {
        return res.status(400).json({
          success: false,
          error: "Telegram ID cannot be changed",
        });
      }

      // Update only provided fields
      if (firstName !== undefined && firstName.trim() !== "") {
        user.firstName = firstName;
      }
      if (lastName !== undefined && lastName.trim() !== "") {
        user.lastName = lastName;
      }
      if (email !== undefined && email.trim() !== "") {
        user.email = email;
      }

      await user.save();

      res.json({ success: true, user });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  }
);

router.post(
  "/updateTapPoints",
  [body("points").optional().isInt({ min: 1 })],
  fetchuser,
  async (req, res) => {
    const MAX_TAP_POINTS = 20; // Daily limit for tap points
    const TAP_RESET_HOURS = 24; // Time before tap points reset
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { points = 2 } = req.body;
      let user = req.user; // User fetched from middleware

      const now = new Date();
      const lastTap = user.lastTapTimestamp || new Date(0); // Default to epoch if null
      const timeDifference = (now - lastTap) / (1000 * 60 * 60); // Difference in hours

      // If 24 hours have passed, reset tapPoints
      if (timeDifference >= TAP_RESET_HOURS) {
        user.tapPoints = 0;
        user.lastTapTimestamp = now;
      }

      // Ensure tapPoints do not exceed MAX_TAP_POINTS
      if (user.tapPoints + points > MAX_TAP_POINTS) {
        return res.status(400).json({
          success: false,
          error: `You have reached the daily limit of ${MAX_TAP_POINTS} tap points. Try again in ${Math.ceil(
            TAP_RESET_HOURS - timeDifference
          )} hours.`,
        });
      }

      // Increment tapPoints and update totalPoints
      user.tapPoints += points;
      user.totalPoints = user.taskPoints + user.tapPoints + user.gamePoints;
      user.lastTapTimestamp = now; // Update last tap time

      await user.save();

      return res.json({ success: true, message: "Tap points updated", user });
    } catch (error) {
      console.error(error.message);
      return res
        .status(500)
        .json({ success: false, error: "Internal Server Error" });
    }
  }
);

// Fetch All Games (Only for Logged-In Users)
router.get("/getQuestions", fetchuser, async (req, res) => {
  try {
    let user = req.user;

    const questionsFilePath = path.join(
      __dirname,
      "../assets/data/questions.json"
    );
    // console.log("questionsFilePath ===>", questionsFilePath);

    //Check if file exists before reading
    if (!fs.existsSync(questionsFilePath)) {
      console.error("Error: File not found -", questionsFilePath);
      return res
        .status(404)
        .json({ success: false, error: "Questions file not found" });
    }

    //Read JSON file safely
    let questions = JSON.parse(fs.readFileSync(questionsFilePath, "utf-8"));

    //Get today's date (YYYY-MM-DD)
    const today = new Date().toISOString().split("T")[0];

    //Initialize game history if not present
    if (!user.gameHistory) {
      user.gameHistory = [];
    }

    //Add `played` flag (true if played today, false otherwise)
    questions = questions.map((question, index) => {
      const gameId = index + 1;
      const gamePlayed = user.gameHistory.some(
        (entry) => entry.gameId === gameId && entry.date === today
      );

      return {
        ...question,
        images: question.images.map(
          (img) => `${req.protocol}://${req.get("host")}/assets/images/${img}`
        ),
        played: gamePlayed, //Indicates if the game was already played today
      };
    });

    return res.json({ success: true, questions });
  } catch (error) {
    console.error("Error:", error.message);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
});

router.post(
  "/saveGamePoints",
  [
    body("gameId").isInt({ min: 1 }).withMessage("Invalid game ID"),
    body("gameCoins").isInt({ min: 0 }).withMessage("Coins must be at least 1"),
  ],
  fetchuser,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { gameId, gameCoins } = req.body;
      let user = req.user;

      //Load game data from JSON file
      const gamesFilePath = path.join(
        __dirname,
        "../assets/data/questions.json"
      );
      const gamesData = JSON.parse(fs.readFileSync(gamesFilePath, "utf-8"));
      //Validate game ID
      const game = gamesData.find((g) => g.id === gameId);
      if (!game) {
        return res
          .status(400)
          .json({ success: false, error: "Invalid game ID" });
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
        (entry) => entry.gameId === gameId && entry.date === today
      );

      if (hasPlayedToday) {
        return res.status(400).json({
          success: false,
          message: "You have already played this game today!",
        });
      }

      //Add game to history
      user.gameHistory.push({ gameId, date: today, played: true });

      //Increment game points
      user.gamePoints += gameCoins;

      //Update total points
      user.totalPoints = user.taskPoints + user.tapPoints + user.gamePoints;

      await user.save();

      return res.json({ success: true, message: "Game points saved!", user });
    } catch (error) {
      console.error(error.message);
      return res
        .status(500)
        .json({ success: false, error: "Internal Server Error" });
    }
  }
);

router.post("/invite", fetchuser, async (req, res) => {
  try {
    // Validate user object from middleware
    if (!req.user || !req.user.telegramUserId) {
      return res.status(400).json({
        success: false,
        error: "Invalid User. Telegram ID is required",
      });
    }

    // const walletAddress = req.user.walletAddress; // Extract wallet address
    const telegramUserId = req.user.telegramUserId;
    // console.log("Wallet Address:", walletAddress);

    // Find the user by wallet address and get their referral ID
    const user = await User.findOne({ telegramUserId });

    if (!user || !user._id) {
      return res.status(404).json({
        success: false,
        error: "User not found or invalid referral ID",
      });
    }

    const referralId = user._id; // Use user's ObjectId as referralId
    // console.log("Referral ID:", referralId);

    if (!referralId) {
      return res
        .status(400)
        .json({ success: false, error: "Referral ID cannot be blank or null" });
    }

    const userId = req.user._id; // Fetched from middleware
    // console.log("User ID:", userId);

    // Your logic to update game points or referral tracking
    // Example:
    // await User.findByIdAndUpdate(userId, { $inc: { gamePoints: 10 } });

    return res.json({
      success: true,
      message: "Refferal Code Sent!",
      referralId,
    });
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
});

router.get("/user", fetchuser, async (req, res) => {
  try {
    // The authenticated user's wallet address is available in req.user
    console.log(req.user); // { walletAddress: '0x1234...', firstName: 'John', lastName: 'Doe' }

    // if (req.user.walletAddress !== req.params.walletAddress) {
    //   return res
    //     .status(401)
    //     .json({ success: false, error: "Unauthorized Access" });
    // }

    // Find user by wallet address and exclude sensitive fields like password
    // const user = await User.findOne({
    //   walletAddress: req.user.walletAddress,
    // });
    const user = await User.findOne({
      telegramUserId: req.user.telegramUserId,
    });

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

router.get("/tasks", fetchuser, async (req, res) => {
  try {
    const user = req.user; // Get user from middleware
    const now = new Date();

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
      (task) => task.taskId
    );
    const completedWeeklyTaskIds = user.completedWeeklyTasks.map(
      (task) => task.taskId
    );
    const completedMonthlyTaskIds = user.completedMonthlyTasks.map(
      (task) => task.taskId
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

    return res.json({
      success: true,
      dailyTasks,
      weeklyTasks,
      monthlyTasks,
    });
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
});

router.post(
  "/completeTask",
  [
    body("taskId").isInt({ min: 1 }).withMessage("Invalid task ID"),
    body("taskType")
      .isIn(["dailyTasks", "weeklyTasks", "monthlyTasks"])
      .withMessage("Invalid task type"),
    body("points").isInt({ min: 1 }).withMessage("Points must be at least 1"),
  ],
  fetchuser, // Middleware to get authenticated user
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { taskId, taskType, points } = req.body;
      let user = req.user;
      const now = new Date();

      // Define reset durations
      const RESET_TIMES = {
        daily: 24 * 60 * 60 * 1000, // 24 hours
        weekly: 7 * 24 * 60 * 60 * 1000, // 7 days
        monthly: 30 * 24 * 60 * 60 * 1000, // 30 days
      };

      const typeKey = taskType.replace("Tasks", ""); // Convert "dailyTasks" -> "daily"
      const completedTasksField = `completed${
        typeKey.charAt(0).toUpperCase() + typeKey.slice(1)
      }Tasks`;
      const lastResetField = `last${
        typeKey.charAt(0).toUpperCase() + typeKey.slice(1)
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
        (task) => task.taskId === taskId
      );

      if (taskIndex !== -1 && user[completedTasksField][taskIndex].completed) {
        return res.status(400).json({
          success: false,
          error: "Task already completed. Please wait for reset time.",
        });
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

      return res.json({
        success: true,
        message: "Task completed successfully",
        completedTasks: user[completedTasksField], // Send updated list of completed tasks
      });
    } catch (error) {
      console.error(error.message);
      return res
        .status(500)
        .json({ success: false, error: "Internal Server Error" });
    }
  }
);

module.exports = router;
