const { Telegraf, Scenes, session } = require('telegraf');
const supabase = require('./supabase');

// Функция отправки уведомления админу
async function notifyAdmin(businessId, message) {
  try {
    const { data: biz } = await supabase
      .from('businesses')
      .select('bot_token, admin_telegram_id, name')
      .eq('id', businessId)
      .single();
    
    if (biz?.admin_telegram_id && biz?.bot_token) {
      const bot = new Telegraf(biz.bot_token);
      await bot.telegram.sendMessage(biz.admin_telegram_id, message, { parse_mode: 'HTML' });
    }
  } catch (err) {
    console.error('Failed to notify admin:', err.message);
  }
}

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
      await ctx.reply('К сожалению, услуг пока нет. Обратитесь к администратору.');
      return ctx.scene.leave();
    }

    ctx.wizard.state.services = services;
    const buttons = services.map(s => ([{ text: `${s.name} — ${s.price} сом`, callback_data: `service_${s.id}` }]));
    
    await ctx.reply('🛍 Выберите услугу:', {
      reply_markup: { inline_keyboard: buttons }
    });
    return ctx.wizard.next();
  },
  // Шаг 2: Выбор даты
  async (ctx) => {
    if (!ctx.callbackQuery) return;
    const serviceId = ctx.callbackQuery.data.replace('service_', '');
    ctx.wizard.state.serviceId = serviceId;

    const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    const months = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
    const dates = [];
    for (let i = 1; i <= 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const label = `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]}`;
      dates.push({ label, value: d.toISOString().split('T')[0] });
    }

    const buttons = dates.map(d => ([{ text: `📅 ${d.label}`, callback_data: `date_${d.value}` }]));
    await ctx.answerCbQuery();
    await ctx.editMessageText('📆 Выберите удобную дату:', {
      reply_markup: { inline_keyboard: buttons }
    });
    return ctx.wizard.next();
  },
  // Шаг 3: Выбор времени
  async (ctx) => {
    if (!ctx.callbackQuery) return;
    const date = ctx.callbackQuery.data.replace('date_', '');
    ctx.wizard.state.date = date;

    const times = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];
    
    // Проверяем занятые слоты
    const { data: existingApts } = await supabase
      .from('appointments')
      .select('appointment_time')
      .eq('business_id', ctx.wizard.state.businessId)
      .eq('appointment_date', date)
      .neq('status', 'cancelled');
    
    const busyTimes = (existingApts || []).map(a => a.appointment_time?.substring(0, 5));
    const availableTimes = times.filter(t => !busyTimes.includes(t));
    
    if (availableTimes.length === 0) {
      await ctx.answerCbQuery();
      await ctx.editMessageText('😔 К сожалению, на эту дату нет свободных слотов. Попробуйте другую дату.');
      return ctx.scene.leave();
    }

    const buttons = [];
    for (let i = 0; i < availableTimes.length; i += 2) {
      const row = [{ text: `🕐 ${availableTimes[i]}`, callback_data: `time_${availableTimes[i]}` }];
      if (availableTimes[i+1]) {
        row.push({ text: `🕐 ${availableTimes[i+1]}`, callback_data: `time_${availableTimes[i+1]}` });
      }
      buttons.push(row);
    }

    await ctx.answerCbQuery();
    await ctx.editMessageText(`Вы выбрали: ${date}\n\n⏰ Выберите время:`, {
      reply_markup: { inline_keyboard: buttons }
    });
    return ctx.wizard.next();
  },
  // Шаг 4: Подтверждение и сохранение
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
        name: ctx.from.first_name + (ctx.from.last_name ? ' ' + ctx.from.last_name : ''),
        username: ctx.from.username 
      }, { onConflict: 'telegram_id' })
      .select()
      .single();

    if (userErr) {
      await ctx.answerCbQuery();
      await ctx.reply('⚠️ Ошибка при создании профиля. Попробуйте позже.');
      return ctx.scene.leave();
    }

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

    // Обновляем клиента
    await supabase
      .from('clients')
      .upsert({
        business_id: businessId,
        telegram_id: ctx.from.id,
        name: ctx.from.first_name + (ctx.from.last_name ? ' ' + ctx.from.last_name : ''),
        visits_count: 1,
        last_visit: new Date().toISOString()
      }, { onConflict: 'business_id,telegram_id' });

    await ctx.answerCbQuery();
    
    if (appErr) {
      await ctx.reply('⚠️ Ошибка при записи. Попробуйте позже.');
    } else {
      await ctx.editMessageText(
        `✅ <b>Запись подтверждена!</b>\n\n` +
        `🛍 <b>Услуга:</b> ${service.name}\n` +
        `💰 <b>Стоимость:</b> ${service.price} сом\n` +
        `📅 <b>Дата:</b> ${date}\n` +
        `🕐 <b>Время:</b> ${time}\n\n` +
        `Ждем вас! Вы получите напоминание за 2 часа.`,
        { parse_mode: 'HTML' }
      );

      // 🔔 Уведомление для администратора
      const clientName = ctx.from.first_name + (ctx.from.last_name ? ' ' + ctx.from.last_name : '');
      await notifyAdmin(
        businessId,
        `🔔 <b>Новая запись!</b>\n\n` +
        `👤 <b>Клиент:</b> ${clientName} (@${ctx.from.username || '—'})\n` +
        `🛍 <b>Услуга:</b> ${service.name}\n` +
        `💰 <b>Цена:</b> ${service.price} сом\n` +
        `📅 <b>Дата:</b> ${date}\n` +
        `🕐 <b>Время:</b> ${time}`
      );
    }
    return ctx.scene.leave();
  }
);

const stage = new Scenes.Stage([appointmentScene]);

function setupBotLogic(bot, businessId) {
  bot.use(session());
  bot.use(stage.middleware());

  bot.start(async (ctx) => {
    const { data: biz } = await supabase
      .from('businesses')
      .select('name')
      .eq('id', businessId)
      .single();

    await ctx.reply(
      `👋 Добро пожаловать в <b>${biz?.name || 'сервис записи'}</b>!\n\n` +
      `Я помогу вам записаться на прием. Выберите действие:`,
      {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [{ text: '📅 Записаться', callback_data: 'start_booking' }],
            [{ text: '📋 Мои записи', callback_data: 'my_bookings' }],
            [{ text: '❌ Отменить запись', callback_data: 'cancel_booking' }]
          ]
        }
      }
    );

    // Сохраняем admin_telegram_id если это первый /start от владельца
    // (упрощенная логика: владелец — первый кто написал /start)
    const { data: bizData } = await supabase
      .from('businesses')
      .select('admin_telegram_id')
      .eq('id', businessId)
      .single();
    
    if (!bizData?.admin_telegram_id) {
      await supabase
        .from('businesses')
        .update({ admin_telegram_id: ctx.from.id })
        .eq('id', businessId);
      
      await ctx.reply(
        '🔔 Вы зарегистрированы как администратор этого бота. ' +
        'Вы будете получать уведомления о новых записях!'
      );
    }
  });

  bot.action('start_booking', (ctx) => {
    ctx.answerCbQuery();
    return ctx.scene.enter('APPOINTMENT_SCENE', { businessId });
  });
  
  bot.action('my_bookings', async (ctx) => {
    await ctx.answerCbQuery();

    // Находим пользователя по telegram_id
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('telegram_id', ctx.from.id)
      .single();

    if (!user) return ctx.reply('У вас пока нет записей.');

    const { data, error } = await supabase
      .from('appointments')
      .select('*, services(name, price)')
      .eq('business_id', businessId)
      .eq('user_id', user.id)
      .neq('status', 'cancelled')
      .order('appointment_date', { ascending: true })
      .limit(5);
    
    if (error || !data?.length) return ctx.reply('📋 У вас пока нет активных записей.');
    
    let text = '📋 <b>Ваши записи:</b>\n';
    data.forEach((a, i) => {
      const statusIcon = a.status === 'confirmed' ? '✅' : '⏳';
      text += `\n${i + 1}. ${statusIcon} <b>${a.services.name}</b>\n   📅 ${a.appointment_date} в ${a.appointment_time}\n   💰 ${a.services.price} сом\n`;
    });
    ctx.reply(text, { parse_mode: 'HTML' });
  });

  bot.action('cancel_booking', async (ctx) => {
    await ctx.answerCbQuery();

    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('telegram_id', ctx.from.id)
      .single();

    if (!user) return ctx.reply('У вас нет записей для отмены.');

    const { data: apts } = await supabase
      .from('appointments')
      .select('*, services(name)')
      .eq('business_id', businessId)
      .eq('user_id', user.id)
      .in('status', ['pending', 'confirmed'])
      .order('appointment_date', { ascending: true })
      .limit(5);

    if (!apts?.length) return ctx.reply('У вас нет активных записей для отмены.');

    const buttons = apts.map(a => ([{
      text: `❌ ${a.services.name} — ${a.appointment_date} ${a.appointment_time}`,
      callback_data: `cancel_${a.id}`
    }]));

    await ctx.reply('Выберите запись для отмены:', {
      reply_markup: { inline_keyboard: buttons }
    });
  });

  // Обработка отмены конкретной записи
  bot.action(/^cancel_(.+)$/, async (ctx) => {
    await ctx.answerCbQuery();
    const appointmentId = ctx.match[1];

    const { error } = await supabase
      .from('appointments')
      .update({ status: 'cancelled' })
      .eq('id', appointmentId);

    if (error) {
      await ctx.reply('⚠️ Ошибка при отмене. Попробуйте позже.');
    } else {
      await ctx.editMessageText('✅ Запись успешно отменена.');
      
      // Уведомляем админа об отмене
      const clientName = ctx.from.first_name;
      await notifyAdmin(
        businessId,
        `❌ <b>Запись отменена</b>\n\n👤 Клиент: ${clientName}`
      );
    }
  });
}

module.exports = { setupBotLogic };
