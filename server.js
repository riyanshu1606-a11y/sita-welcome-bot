const { Telegraf } = require("telegraf");

const token = process.env.BOT_TOKEN;

if (!token) {
  throw new Error("BOT_TOKEN is missing!");
}

const bot = new Telegraf(token);

bot.on("new_chat_members", async (ctx) => {
  const members = ctx.message.new_chat_members;

  for (const member of members) {
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
  .then(() => console.log("SITA Welcome Bot is running!"))
  .catch((error) => {
    console.error("Bot failed to start:", error);
    process.exit(1);
  });

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
