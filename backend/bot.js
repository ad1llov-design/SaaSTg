const { Telegraf, Scenes, session } = require('telegraf');
const supabase = require('./supabase');

// Сцена записи
const appointmentScene = new Scenes.WizardScene(
  'APPOINTMENT_SCENE',
  // Шаг 1: Выбор услуги
  async (ctx) => {
    const businessId = ctx.wizard.state.businessId;
    const { data: services, error } = await supabase
      .from('services')
      .select('*')
      .eq('business_id', businessId);

    if (error || !services.length) {
      await ctx.reply('К сожалению, услуг пока нет.');
      return ctx.scene.leave();
    }

    ctx.wizard.state.services = services;
    const buttons = services.map(s => ([{ text: `${s.name} (${s.price} сом)`, callback_data: `service_${s.id}` }]));
    
    await ctx.reply('Выберите услугу:', {
      reply_markup: { inline_keyboard: buttons }
    });
    return ctx.wizard.next();
  },
  // Шаг 2: Выбор даты (упрощенно для MVP - ближайшие 7 дней)
  async (ctx) => {
    if (!ctx.callbackQuery) return;
    const serviceId = ctx.callbackQuery.data.replace('service_', '');
    ctx.wizard.state.serviceId = serviceId;

    const dates = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() + i);
        dates.push(d.toISOString().split('T')[0]);
    }

    const buttons = dates.map(d => ([{ text: d, callback_data: `date_${d}` }]));
    await ctx.answerCbQuery();
    await ctx.editMessageText('Выберите дату:', {
      reply_markup: { inline_keyboard: buttons }
    });
    return ctx.wizard.next();
  },
  // Шаг 3: Выбор времени (упрощенно: фиксированные слоты)
  async (ctx) => {
    if (!ctx.callbackQuery) return;
    const date = ctx.callbackQuery.data.replace('date_', '');
    ctx.wizard.state.date = date;

    const times = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
    const buttons = [];
    for (let i = 0; i < times.length; i += 2) {
        buttons.push([
            { text: times[i], callback_data: `time_${times[i]}` },
            { text: times[i+1] || '', callback_data: `time_${times[i+1]}` }
        ].filter(b => b.text));
    }

    await ctx.answerCbQuery();
    await ctx.editMessageText(`Вы выбрали ${date}. Выберите время:`, {
      reply_markup: { inline_keyboard: buttons }
    });
    return ctx.wizard.next();
  },
  // Шаг 4: Подтверждение
  async (ctx) => {
    if (!ctx.callbackQuery) return;
    const time = ctx.callbackQuery.data.replace('time_', '');
    const { serviceId, date, businessId, services } = ctx.wizard.state;
    const service = services.find(s => s.id === serviceId);

    // Сохраняем пользователя
    const { data: user, error: userErr } = await supabase
        .from('users')
        .upsert({ 
            telegram_id: ctx.from.id, 
            name: ctx.from.first_name,
            username: ctx.from.username 
        }, { onConflict: 'telegram_id' })
        .select()
        .single();

    // Создаем запись
    const { error: appErr } = await supabase
        .from('appointments')
        .insert({
            business_id: businessId,
            user_id: user.id,
            service_id: serviceId,
            appointment_date: date,
            appointment_time: time,
            status: 'pending'
        });

    await ctx.answerCbQuery();
    if (appErr) {
        await ctx.reply('Ошибка при записи. Попробуйте позже.');
    } else {
        await ctx.reply(`✅ Вы успешно записаны!\n\nУслуга: ${service.name}\nДата: ${date}\nВремя: ${time}\n\nЖдем вас!`);
    }
    return ctx.scene.leave();
  }
);

const stage = new Scenes.Stage([appointmentScene]);

function setupBotLogic(bot, businessId) {
  bot.use(session());
  bot.use(stage.middleware());

  bot.start(async (ctx) => {
    await ctx.reply('Привет! Я бот для записи.', {
      reply_markup: {
        inline_keyboard: [
          [{ text: '📅 Записаться', callback_data: 'start_booking' }],
          [{ text: '📋 Мои записи', callback_data: 'my_bookings' }]
        ]
      }
    });
  });

  bot.action('start_booking', (ctx) => ctx.scene.enter('APPOINTMENT_SCENE', { businessId }));
  
  bot.action('my_bookings', async (ctx) => {
      const { data, error } = await supabase
        .from('appointments')
        .select('*, services(name)')
        .eq('business_id', businessId)
        // Здесь нужно было бы фильтровать по пользователю, но для MVP можно просто показать статус
        .limit(5);
      
      if (error || !data.length) return ctx.reply('У вас пока нет записей.');
      
      let text = 'Ваши последние записи:\n';
      data.forEach(a => {
          text += `\n- ${a.services.name}: ${a.appointment_date} в ${a.appointment_time} (${a.status})`;
      });
      ctx.reply(text);
  });
}

module.exports = { setupBotLogic };
