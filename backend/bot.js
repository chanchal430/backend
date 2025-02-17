const { Telegraf } = require("telegraf");

console.log("🚀 Bot is Initialized"); // Debug log

const BOT_TOKEN = process.env.BOT_TOKEN;
// const WEB_APP_URL = "https://tg-mini-app-nine-ruddy.vercel.app/";
const WEB_APP_URL = process.env.WEB_APP_URL;

const bot = new Telegraf(BOT_TOKEN);
// console.log("🚀 Bot is BOT_TOKEN ===",BOT_TOKEN); // Debug log
// console.log("🚀 Bot is WEB_APP_URL ===",WEB_APP_URL); // Debug log



bot.start((ctx) => {
  console.log("📩 Received /start command"); // Debug log

  const startPayload = ctx.payload; // Get the value after ?start=

  if (startPayload === "webapp") {
    ctx.reply("🚀 Open Your TG MINI APP Now", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "🚀 Open TG MINI App", web_app: { url: WEB_APP_URL } }],
        ],
      },
    });
  } else {
    ctx.reply("Welcome! Open Your TG MINI APP Now", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "🚀 Open TG MINI App", web_app: { url: WEB_APP_URL } }],
        ],
      },
    });
  }
});

bot
  .launch()
  .then(() => console.log("✅ TG Mini App bot is running..."))
  .catch((err) => console.error("❌ Bot launch failed:", err));
