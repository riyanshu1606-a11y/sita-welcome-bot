
const express = require("express");
const { Telegraf } = require("telegraf");

const app = express();
const PORT = process.env.PORT || 3000;
const TOKEN = process.env.BOT_TOKEN;

app.get("/", (req, res) => {
  res.status(200).send("SITA Welcome Bot is running!");
});

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Web server listening on port ${PORT}`);
});

if (!TOKEN) {
  console.error("BOT_TOKEN environment variable is missing!");
  process.exit(1);
}

const bot = new Telegraf(TOKEN);

bot.on("new_chat_members", async (ctx) => {
  for (const member of ctx.message.new_chat_members) {
    if (member.is_bot) continue;

    const name = member.first_name || "Friend";

    const message =
      `🎉 Welcome to SITA Team, ${name}! 💖\n\n` +
      `💸 Start your earning now! 🚀💰\n\n` +
      `🔥 Best of luck with your earning journey! ✨`;

    await ctx.reply(message);
  }
});

bot.launch()
  .then(() => console.log("SITA Welcome Bot started successfully!"))
  .catch((error) => {
    console.error("Telegram bot failed to start:", error);
    process.exit(1);
  });

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
