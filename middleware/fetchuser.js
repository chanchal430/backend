const User = require("../models/User"); // Ensure correct path to your User model

const fetchuser = async (req, res, next) => {
  try {
    // console.log("🔹 RAW Headers Received:", req.rawHeaders);
    // console.log("🔹 Processed Headers:", req.headers);
    const telegramUserId = req.headers["telegram-id"];
    // const telegramUserId = req.get("telegram_id");
    // const telegramUserId = req.get("telegram_id") || req.get("X-Telegram-ID");


    // if (!telegramUserId) {
    //   return res.status(401).json({ 
    //     error: "telegram_id is required for authentication11111111111",
    //     receivedHeaders: req.headers , // Log headers for debugging
    //     rawHeaders: req.rawHeaders // Log raw headers for deeper debugging
    //   });
    // }

    if (!telegramUserId) {
      return res.status(401).json({ error: "telegram_id is required for authentication" });
    }

    // if (walletAddress.length <= 40) {
    //   return res.status(400).json({ error: "Invalid wallet address format" });
    // }

    const user = await User.findOne({ telegramUserId });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.telegramUserId) {
      return res.status(404).json({ error: "Telegram User ID not found for this user" });
    }

    // Attach Telegram user ID to request
    req.telegramUserId = user.telegramUserId;
    req.user = user;

    next();
  } catch (error) {
    console.error("Middleware error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = fetchuser;




// const User = require("../models/User"); // Ensure correct path to your User model

// const fetchuser = async (req, res, next) => {
//   try {
//     let walletAddress = req.headers["wallet-address"];

//     if (!walletAddress) {
//       return res.status(401).json({ error: "Wallet address is required for authentication" });
//     }

//     // Validate wallet address length
//     if (walletAddress.length <= 40) {
//       return res.status(400).json({ error: "Invalid wallet address format" });
//     }

//     // Find the user in the database
//     let user = await User.findOne({ walletAddress });

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     // Attach user data to request object
//     req.user = user;

//     // Proceed to the next middleware
//     next();
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// module.exports = fetchuser;