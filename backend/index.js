const express = require('express');
const cors = require('cors');
const { Telegraf } = require('telegraf');
require('dotenv').config();
const supabase = require('./supabase');
const { setupBotLogic } = require('./bot');
require('./cron'); // Start cron scheduler

const app = express();

app.use(express.json());
app.use(cors({ origin: '*' }));

const bots = new Map();

// Функция инициализации одного бота
async function initSingleBot(token, businessId) {
  if (bots.has(token)) return;

  try {
    const bot = new Telegraf(token);
    setupBotLogic(bot, businessId);

    // В продакшне используем Webhooks
    if (process.env.APP_URL) {
      const secretPath = `/webhook/${token}`;
      await bot.telegram.setWebhook(`${process.env.APP_URL}${secretPath}`);
      
      app.post(secretPath, (req, res) => {
        bot.handleUpdate(req.body, res);
      });
      console.log(`Bot for business ${businessId} set up with webhook`);
    } else {
      // Для локальной разработки используем Polling
      bot.launch();
      console.log(`Bot for business ${businessId} set up with polling (local)`);
    }

    bots.set(token, bot);
  } catch (err) {
    console.error(`Failed to init bot for business ${businessId}:`, err.message);
  }
}

// Загрузка всех ботов из БД
async function loadAllBots() {
  const { data: businesses, error } = await supabase
    .from('businesses')
    .select('id, bot_token')
    .not('bot_token', 'is', null);

  if (error) {
    console.error('Error loading businesses:', error);
    return;
  }

  for (const b of businesses) {
    await initSingleBot(b.bot_token, b.id);
  }
}

// API для регистрации нового бота (будет вызываться из фронтенда)
app.post('/api/register-bot', async (req, res) => {
  const { businessId, token } = req.body;
  
  if (!businessId || !token) {
    return res.status(400).json({ error: 'Missing businessId or token' });
  }

  try {
    // Проверка токена через Telegram API
    const testBot = new Telegraf(token);
    const botInfo = await testBot.telegram.getMe();

    // Сохранение в базу
    const { error } = await supabase
      .from('businesses')
      .update({ bot_token: token })
      .eq('id', businessId);

    if (error) throw error;

    await initSingleBot(token, businessId);
    res.json({ success: true, botUsername: botInfo.username });
  } catch (err) {
    res.status(400).json({ error: `Invalid token or DB error: ${err.message}` });
  }
});

// Health Check for Render/Railway
app.get('/health', (req, res) => res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() }));

const PORT = parseInt(process.env.PORT) || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is running on port ${PORT} (0.0.0.0)`);
  loadAllBots().catch(err => console.error('CRITICAL: Failed to load bots:', err));
});

// Graceful stop
process.once('SIGINT', () => {
    for (const bot of bots.values()) bot.stop('SIGINT');
});
process.once('SIGTERM', () => {
    for (const bot of bots.values()) bot.stop('SIGTERM');
});
