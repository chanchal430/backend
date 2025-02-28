require("dotenv").config();
const connectToMongo = require("./config/db");
var cors = require("cors");
const path = require("path");
const express = require("express");
const { spawn } = require("child_process"); 

connectToMongo();
const app = express();
const port = process.env.PORT;

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// const allowedOrigins = [
//   "http://localhost:3000",
//   "https://tg-mini-app-nine-ruddy.vercel.app/",
//   "http://13.233.237.195:3001",
//   "https://13.233.237.195:3001",
//   "https://13.233.237.195",
// ];

app.use(cors())

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true,
//   })
// );

app.use(
  "/assets/images",
  express.static(path.join(__dirname, "assets/images"))
);

// Available Routes
app.get("/", (req, res, next) => {
  res.send("Welcome to Tg Mini App Backend");
});
app.use("/api", require("./routes/auth"));

// Start Express Server
app.listen(port, "0.0.0.0", () => {
  console.log(`Tg Mini App Backend listening at http://localhost:${port}`);

  // Start abot.js as a child process
  const botProcess = spawn("node", ["bot.js"], {
    stdio: "inherit",
    shell: true,
  });

  botProcess.on("exit", (code) => {
    console.log(`bot.js process exited with code ${code}`);
  });

  botProcess.on("error", (err) => {
    console.error("Failed to start bot.js:", err);
  });
});
