const { Bot, InlineKeyboard, webhookCallback } = require("grammy");
const express = require("express");

// ==================== CONFIG ====================
const BOT_TOKEN = process.env.BOT_TOKEN;
if (!BOT_TOKEN) {
  console.error("❌ BOT_TOKEN не установлен! Укажите переменную окружения.");
  process.exit(1);
}

const WEB_APP_URL = process.env.WEB_APP_URL || "https://taxi-eb8b7.web.app";
const PORT = parseInt(process.env.PORT || "3000", 10);
const WEBHOOK_URL = process.env.WEBHOOK_URL; // e.g. https://your-app.onrender.com

const bot = new Bot(BOT_TOKEN);

// ==================== COMMANDS ====================

bot.command("start", async (ctx) => {
  const keyboard = new InlineKeyboard().webApp(
    "🚖 Открыть PeopleHub",
    WEB_APP_URL
  );

  await ctx.reply(
    `👋 Добро пожаловать в *PeopleHub*!\n\n` +
      `Такси-платформа взаимного уважения:\n` +
      `✅ 0% комиссии для водителей\n` +
      `💳 100% предоплата — защита от неплательщиков\n` +
      `⭐ TrustScore — система репутации\n` +
      `🚫 Никаких звонков — только чат\n\n` +
      `Нажмите кнопку ниже, чтобы начать:`,
    {
      parse_mode: "Markdown",
      reply_markup: keyboard,
    }
  );
});

bot.command("help", async (ctx) => {
  await ctx.reply(
    `📖 *Команды PeopleHub Bot*\n\n` +
      `/start — Открыть приложение\n` +
      `/help — Помощь\n` +
      `/about — О платформе\n` +
      `/support — Поддержка`,
    { parse_mode: "Markdown" }
  );
});

bot.command("about", async (ctx) => {
  await ctx.reply(
    `ℹ️ *PeopleHub — Такси нового формата*\n\n` +
      `Мы убрали всё лишнее и оставили главное:\n\n` +
      `👤 *Для клиентов:*\n` +
      `• Быстрый заказ через Telegram\n` +
      `• Прозрачная цена до поездки\n` +
      `• Рейтинг водителей\n\n` +
      `🚗 *Для водителей:*\n` +
      `• 0% комиссии с поездок\n` +
      `• Абонентка всего 200 тг/день\n` +
      `• Защита от неплательщиков\n` +
      `• GPS-антифрод система\n\n` +
      `Версия MVP 1.0`,
    { parse_mode: "Markdown" }
  );
});

bot.command("support", async (ctx) => {
  await ctx.reply(
    `🆘 *Нужна помощь?*\n\n` +
      `Напишите нам: @peoplehub\\_support\n` +
      `Или отправьте сообщение прямо сюда — мы ответим!`,
    { parse_mode: "Markdown" }
  );
});

// Обработка текстовых сообщений
bot.on("message:text", async (ctx) => {
  const keyboard = new InlineKeyboard().webApp(
    "🚖 Открыть PeopleHub",
    WEB_APP_URL
  );

  await ctx.reply("Откройте приложение, чтобы заказать такси:", {
    reply_markup: keyboard,
  });
});

// Обработка ошибок
bot.catch((err) => {
  console.error("Bot error:", err.message);
});

// ==================== SERVER ====================

const app = express();

// Health check для Render
app.get("/", (_req, res) => {
  res.json({
    status: "ok",
    bot: "PeopleHub Bot",
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// ==================== START ====================

async function startBot() {
  if (WEBHOOK_URL) {
    // Webhook mode (production on Render)
    const webhookPath = `/webhook/${BOT_TOKEN.split(":")[0]}`;
    const fullUrl = `${WEBHOOK_URL}${webhookPath}`;

    app.use(webhookPath, webhookCallback(bot, "express"));

    await bot.api.setWebhook(fullUrl);
    console.log(`✅ Webhook set: ${fullUrl}`);

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🤖 Bot is live via webhook`);
      console.log(`🌐 Web App: ${WEB_APP_URL}`);
    });
  } else {
    // Long polling mode (local development)
    app.listen(PORT, () => {
      console.log(`🚀 Health server on port ${PORT}`);
    });

    await bot.api.deleteWebhook();
    console.log("🤖 Starting bot in polling mode...");
    console.log(`🌐 Web App: ${WEB_APP_URL}`);
    bot.start();
  }
}

startBot().catch((err) => {
  console.error("Failed to start:", err);
  process.exit(1);
});
