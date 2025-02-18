const User = require("../models/User"); // Ensure correct path to your User model

const fetchuser = async (req, res, next) => {
  try {
    let walletAddress = req.headers["wallet-address"];

    if (!walletAddress) {
      return res.status(401).json({ error: "Wallet address is required for authentication" });
    }

    // Validate wallet address length
    if (walletAddress.length <= 40) {
      return res.status(400).json({ error: "Invalid wallet address format" });
    }

    // Find the user in the database
    let user = await User.findOne({ walletAddress });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Attach user data to request object
    req.user = user;

    // Proceed to the next middleware
    next();
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = fetchuser;