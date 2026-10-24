const express = require("express");
const { Telegraf } = require("telegraf");

const app = express();
const bot = new Telegraf(process.env.BOT_TOKEN);

// Render health-check server
app.get("/", (req, res) => {
  res.send("SITA Welcome Bot is running!");
});

const PORT = process.env.PORT || 3000;

// Different welcome messages for different groups.
// Add each group's Telegram chat ID in Render Environment Variables.
const GROUP_MESSAGES = {
  [process.env.GROUP1_ID]: 
    "🎉 Welcome to SITA team! 💖\n\n💸 Start your earning now 🚀",

  [process.env.GROUP2_ID]: 
    "🔥 Welcome to our group! 🎊\n\n✨ Start your journey today 💰",
};

// Welcome new members with a clickable mention
bot.on("new_chat_members", async (ctx) => {
  try {
    for (const member of ctx.message.new_chat_members) {
      // Skip bots
      if (member.is_bot) continue;

      const name = [member.first_name, member.last_name]
        .filter(Boolean)
        .join(" ");

      const mention = `<a href="tg://user?id=${member.id}">${escapeHTML(name || "User")}</a>`;

      const groupMessage =
        GROUP_MESSAGES[String(ctx.chat.id)] ||
        "🎉 Welcome to SITA team! 💖\n\n💸 Start your earning now 🚀";

      await ctx.reply(
        `${mention}\n\n${groupMessage}`,
        {
          parse_mode: "HTML",
          reply_parameters: {
            message_id: ctx.message.message_id
          }
        }
      );
    }
  } catch (error) {
    console.error("Welcome error:", error.message);
  }
});

function escapeHTML(text) {
  return String(text).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

bot.catch((err) => {
  console.error("Telegram bot error:", err.message);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

bot.launch()
  .then(() => console.log("SITA Welcome Bot started"))
  .catch((err) => console.error("Bot startup error:", err.message));

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
