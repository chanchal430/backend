// import { Telegraf } from "telegraf";
// import config from "../env/index";

// class botHelper {
//     public async start(): Promise<any> {
//         try {
//             console.log("🚀 Bot is Initialized"); // Debug log
//             const BOT_TOKEN = config.botToken;
//             const WEB_APP_URL = config.webAppUrl;
//             const bot = new Telegraf(BOT_TOKEN);
//             bot.start((ctx: any) => {
//                 console.log("📩 Received /start command"); // Debug log
//                 const startPayload = ctx.payload; // Get the value after ?start=
//                 if (startPayload === "webapp") {
//                     ctx.reply("🚀 Open Your TG MINI APP Now", {
//                         reply_markup: {
//                             inline_keyboard: [
//                                 [{ text: "🚀 Open TG MINI App", web_app: { url: WEB_APP_URL } }],
//                             ],
//                         },
//                     });
//                 } else {
//                     ctx.reply("Welcome! Open Your TG MINI APP Now", {
//                         reply_markup: {
//                             inline_keyboard: [
//                                 [{ text: "🚀 Open TG MINI App", web_app: { url: WEB_APP_URL } }],
//                             ],
//                         },
//                     });
//                 }
//             });
//             bot
//                 .launch()
//                 .then(() => console.log("✅ TG Mini App bot is running..."))
//                 .catch((err: any) => console.error("❌ Bot launch failed:", err));
//         }
//         catch (error) {
//             console.log("Error -> ", error);
//         }
//     }
// }

// export default new botHelper();
