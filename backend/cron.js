const cron = require('node-cron');
const supabase = require('./supabase');
const { Telegraf } = require('telegraf');

// Функция для рассылки напоминаний
async function sendReminders() {
    console.log('Running reminder check...');
    
    // Вычисляем время через 2 часа (упрощенно)
    const now = new Date();
    const targetTime = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    const targetDateStr = targetTime.toISOString().split('T')[0];
    const targetTimeStr = targetTime.toTimeString().split(' ')[0].substring(0, 5); // HH:mm

    const { data: apps, error } = await supabase
        .from('appointments')
        .select('*, users(telegram_id), businesses(bot_token), services(name)')
        .eq('appointment_date', targetDateStr)
        .eq('appointment_time', targetTimeStr)
        .eq('status', 'pending');

    if (error) {
        console.error('Cron error:', error);
        return;
    }

    for (const app of apps) {
        try {
            const bot = new Telegraf(app.businesses.bot_token);
            await bot.telegram.sendMessage(
                app.users.telegram_id,
                `🔔 Напоминание! У вас запись сегодня в ${app.appointment_time} на услугу "${app.services.name}".`
            );
            console.log(`Reminder sent to ${app.users.telegram_id}`);
        } catch (err) {
            console.error(`Failed to send reminder for app ${app.id}:`, err.message);
        }
    }
}

// Запуск каждые 10 минут
cron.schedule('*/10 * * * *', () => {
    sendReminders();
});

module.exports = { sendReminders };
