"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

export type Locale = 'ru' | 'en' | 'ky' | 'uz';

export const translations = {
  ru: {
    common: {
      dashboard: 'Дашборд',
      appointments: 'Записи',
      services: 'Услуги',
      clients: 'Клиенты',
      settings: 'Настройки бота',
      admin: 'Админ-панель',
      logout: 'Выйти',
      theme: 'Тема',
      language: 'Язык',
      upgrade: 'Улучшить',
      trial_expired: 'Истек',
      access: 'Доступ',
      days_left: 'дн. осталось',
      save: 'Сохранить',
      cancel: 'Отмена',
      currency: 'сом',
      minutes: 'мин',
      search_placeholder: 'Поиск по имени или ID...'
    },
    dashboard: {
      title: 'Главная',
      subtitle: 'Аналитика и активные терминалы',
      active_partner: 'Авторизованный партнер',
      active_apts: 'Активные записи',
      clients_base: 'База клиентов',
      revenue: 'Выручка (сом)',
      today_apts: 'Сегодняшние',
      recent_activity: 'Последняя активность',
      view_all: 'Смотреть аналитику',
      no_activity: 'Нет недавней активности',
      verified: 'Подтверждено',
      denied: 'Отменено',
      awaiting: 'Ожидает',
      promo_title: 'AuraSync Premium',
      promo_subtitle: 'Автоматизируйте свой бизнес сегодня.',
      promo_btn: 'Активировать'
    },
    services: {
      title: 'Услуги',
      subtitle: 'Управление каталогом услуг и ценами',
      add: 'Новая услуга',
      no_services: 'Услуги еще не добавлены',
      form_name: 'Название услуги',
      form_name_ph: 'например, Стрижка',
      form_price: 'Стоимость (сом)',
      duration: 'Длительность'
    },
    clients: {
      title: 'База клиентов',
      subtitle: 'История посещений и профили'
    },
    appointments: {
      title: 'Записи',
      subtitle: 'Управление расписанием и клиентами',
      status_verified: 'Подтверждено',
      status_denied: 'Отменено',
      status_awaiting: 'Ожидает'
    },
    settings: {
      title: 'Синхронизация Telegram',
      subtitle: 'Управление интеграцией с ботом',
      integration: 'Интеграция',
      tg_api: 'Связь с Telegram API',
      bot_token: 'Токен от BotFather',
      connecting: 'Подключение...',
      connect_btn: 'Авторизовать бота',
      success: 'Успешно подключено',
      bot_live: 'Бот активен по ссылке:',
      error: 'Ошибка подключения',
      notifications: 'Уведомления',
      notifications_desc: 'Статусы и настройки',
      how_to_start: 'Запуск уведомлений',
      how_to_start_desc: 'Для получения системных уведомлений отправьте команду',
      system_status: 'Статус системы',
      status_ok: 'Работает стабильно',
      security: 'Безопасность',
      security_desc: 'Ключи протокола защищены алгоритмом AES-256. Мы не имеем прямого доступа к вашим API-данным.',
      tips: 'Рекомендации',
      tip_1: 'Настройте логотип компании через BotFather',
      tip_2: 'Добавьте описание бренда для повышения доверия',
      tip_3: 'Настройте главное меню бота для удобной навигации'
    }
  },
  en: {
    common: {
      dashboard: 'Dashboard',
      appointments: 'Appointments',
      services: 'Services',
      clients: 'Clients',
      settings: 'Bot Settings',
      admin: 'Admin Panel',
      logout: 'Log Out',
      theme: 'Theme',
      language: 'Language',
      upgrade: 'Upgrade',
      trial_expired: 'Expired',
      access: 'Access',
      days_left: 'days left',
      save: 'Save',
      cancel: 'Cancel',
      currency: 'KGS',
      minutes: 'min',
      search_placeholder: 'Search by Name or ID...'
    },
    dashboard: {
      title: 'Overview',
      subtitle: 'System analytics and monitoring',
      active_partner: 'Authorized Partner',
      active_apts: 'Active Protocols',
      clients_base: 'Client Base',
      revenue: 'Revenue (KGS)',
      today_apts: 'Today\'s Traffic',
      recent_activity: 'Recent Activity',
      view_all: 'View Analytics',
      no_activity: 'No recent activity',
      verified: 'Verified',
      denied: 'Denied',
      awaiting: 'Awaiting',
      promo_title: 'AuraSync Premium',
      promo_subtitle: 'Autonomous infrastructure for global scale.',
      promo_btn: 'Initialize Protocol'
    },
    services: {
      title: 'Services',
      subtitle: 'Manage your service catalog and pricing',
      add: 'New Service',
      no_services: 'No services deployed yet',
      form_name: 'Service Name',
      form_name_ph: 'e.g., Haircut',
      form_price: 'Price (KGS)',
      duration: 'Duration'
    },
    clients: {
      title: 'Clients',
      subtitle: 'Client base and history'
    },
    appointments: {
      title: 'Schedule',
      subtitle: 'Manage your bookings and schedule',
      status_verified: 'Verified',
      status_denied: 'Denied',
      status_awaiting: 'Pending'
    },
    settings: {
      title: 'Telegram Sync',
      subtitle: 'Manage Bot Integration API',
      integration: 'Integration',
      tg_api: 'Telegram API Bridge',
      bot_token: 'BotFather Secure Token',
      connecting: 'Connecting...',
      connect_btn: 'Authorize Bot',
      success: 'Connection Authorized',
      bot_live: 'Bot is active at:',
      error: 'Connection Error',
      notifications: 'Operational Alerts',
      notifications_desc: 'Alert status and triggers',
      how_to_start: 'Initialize Alerts',
      how_to_start_desc: 'Send to your authorized node: ',
      system_status: 'Resilience Status',
      status_ok: 'Stable Node',
      security: 'Encryption Layer',
      security_desc: 'Keys are secured via AES-256 standards. We operate zero-knowledge architecture over your API credentials.',
      tips: 'Optimization Logs',
      tip_1: 'Set organizational logo in BotFather',
      tip_2: 'Define brand description to increase trust metric',
      tip_3: 'Initialize bot command menu for direct routing'
    }
  },
  ky: {
    common: {
      dashboard: 'Башкы бет',
      appointments: 'Жазылуулар',
      services: 'Кызматтар',
      clients: 'Кардарлар',
      settings: 'Жөндөөлөр',
      admin: 'Башкаруу',
      logout: 'Чыгуу',
      theme: 'Тема',
      language: 'Тил',
      upgrade: 'Жакшыртуу',
      trial_expired: 'Бүткөн',
      access: 'Кирүү',
      days_left: 'күн калды',
      save: 'Сактоо',
      cancel: 'Жокко чыгаруу',
      currency: 'сом',
      minutes: 'мүн',
      search_placeholder: 'Аты же ID боюнча издөө...'
    },
    dashboard: {
      title: 'Негизги',
      subtitle: 'Талдоо жана акыркы окуялар',
      active_partner: 'Ыйгарым укуктуу өнөктөш',
      active_apts: 'Активдүү жазылуулар',
      clients_base: 'Кардарлар базасы',
      revenue: 'Киреше (сом)',
      today_apts: 'Бүгүн жазылгандар',
      recent_activity: 'Акыркы аракеттер',
      view_all: 'Аналитика',
      no_activity: 'Аракеттер жок',
      verified: 'Тастыкталды',
      denied: 'Жокко чыгарылды',
      awaiting: 'Күтүүдө',
      promo_title: 'AuraSync Premium',
      promo_subtitle: 'Бизнесиңизди бүгүн автоматташтырыңыз.',
      promo_btn: 'Активдештирүү'
    },
    services: {
      title: 'Кызматтар',
      subtitle: 'Кызматтарды жана бааларды башкаруу',
      add: 'Жаңы кызмат',
      no_services: 'Кызматтар кошула элек',
      form_name: 'Кызматтын аты',
      form_name_ph: 'мисалы, Чач кыркуу',
      form_price: 'Баасы (сом)',
      duration: 'Узактыгы'
    },
    clients: {
      title: 'Кардарлар',
      subtitle: 'Келүү тарыхы жана профилдер'
    },
    appointments: {
      title: 'Жазылуулар',
      subtitle: 'Убакытты жана графиктерди башкаруу',
      status_verified: 'Тастыкталды',
      status_denied: 'Жокко чыгарылды',
      status_awaiting: 'Күтүүдө'
    },
    settings: {
      title: 'Telegram Синхрондоштуруу',
      subtitle: 'Ботту интеграциялоону башкаруу',
      integration: 'Интеграция',
      tg_api: 'Telegram API менен байланыш',
      bot_token: 'BotFather Токени',
      connecting: 'Туташууда...',
      connect_btn: 'Ботту авторизациялоо',
      success: 'Ийгиликтүү туташты',
      bot_live: 'Бот активдүү: ',
      error: 'Туташуу катасы',
      notifications: 'Билдирмелер',
      notifications_desc: 'Тартип жана статустар',
      how_to_start: 'Билдирмелерди иштетүү',
      how_to_start_desc: 'Билдирмелер үчүн буйрук жөнөтүңүз:',
      system_status: 'Системанын абалы',
      status_ok: 'Туруктуу иштөөдө',
      security: 'Коопсуздук',
      security_desc: 'Протокол ачкычтары AES-256 менен корголгон. Сиздин маалыматтарга түз кирүү жок.',
      tips: 'Кеңештер',
      tip_1: 'BotFather аркылуу логотипти орнотуңуз',
      tip_2: 'Ишенимди жогорулатуу үчүн брендди сүрөттөңүз',
      tip_3: 'Навигация үчүн боттун менюсун тууралаңыз'
    }
  },
  uz: {
    common: {
      dashboard: 'Bosh sahifa',
      appointments: 'Yozuvlar',
      services: 'Xizmatlar',
      clients: 'Mijozlar',
      settings: 'Sozlamalar',
      admin: 'Boshqaruv paneli',
      logout: 'Chiqish',
      theme: 'Mavzu',
      language: 'Til',
      upgrade: 'Yaxshilash',
      trial_expired: 'Muddati tugagan',
      access: 'Kirish',
      days_left: 'kun qoldi',
      save: 'Saqlash',
      cancel: 'Bekor qilish',
      currency: 'so\'m',
      minutes: 'daq',
      search_placeholder: 'Ism yoki ID bo\'yicha qidiruv...'
    },
    dashboard: {
      title: 'Asosiy',
      subtitle: 'Hisobot va faollik',
      active_partner: 'Vakolatli hamkor',
      active_apts: 'Faol yozuvlar',
      clients_base: 'Mijozlar bazasi',
      revenue: 'Daromad (som)',
      today_apts: 'Bugungi yozuvlar',
      recent_activity: 'So\'nggi faollik',
      view_all: 'Barchasini ko\'rish',
      no_activity: 'Faollik yo\'q',
      verified: 'Tasdiqlangan',
      denied: 'Bekor qilingan',
      awaiting: 'Kutilmoqda',
      promo_title: 'AuraSync Premium',
      promo_subtitle: 'Bugun biznesingizni avtomatlashtiring.',
      promo_btn: 'Faollashtirish'
    },
    services: {
      title: 'Xizmatlar',
      subtitle: 'Xizmatlar va narxlarni boshqarish',
      add: 'Yangi xizmat',
      no_services: 'Hali xizmatlar qo\'shilmagan',
      form_name: 'Xizmat nomi',
      form_name_ph: 'masalan, Soch kesish',
      form_price: 'Narxi (so\'m)',
      duration: 'Davomiyligi'
    },
    clients: {
      title: 'Mijozlar',
      subtitle: 'Tashriflar tarixi va profillar'
    },
    appointments: {
      title: 'Yozuvlar',
      subtitle: 'Jadval va mijozlarni boshqarish',
      status_verified: 'Tasdiqlangan',
      status_denied: 'Bekor qilingan',
      status_awaiting: 'Kutilmoqda'
    },
    settings: {
      title: 'Telegram bilan bog\'lanish',
      subtitle: 'Bot integratsiyasini boshqarish',
      integration: 'Integratsiya',
      tg_api: 'Telegram API aloqasi',
      bot_token: 'BotFather Tokeni',
      connecting: 'Ulanmoqda...',
      connect_btn: 'Botni tasdiqlash',
      success: 'Muvaffaqiyatli ulandi',
      bot_live: 'Bot faol havolasi:',
      error: 'Ulanishda xato',
      notifications: 'Bildirishnomalar',
      notifications_desc: 'Holatlar va sozlamalar',
      how_to_start: 'Bildirishnomalarni yoqish',
      how_to_start_desc: 'Tizim xabarlari uchun buyruq yuboring:',
      system_status: 'Tizim holati',
      status_ok: 'Barqaror ishlamoqda',
      security: 'Xavfsizlik',
      security_desc: 'Protokol kalitlari AES-256 orqali himoyalangan. API ma\'lumotlariga to\'g\'ridan to\'g\'ri kirish yo\'q.',
      tips: 'Tavsiyalar',
      tip_1: 'BotFather orqali logotipni sozlang',
      tip_2: 'Ishonchni oshirish uchun brendingizni ta\'riflang',
      tip_3: 'Oson navigatsiya uchun bot menyusini sozlang'
    }
  }
};

type LanguageContextType = {
  locale: Locale;
  setLocale: (lang: Locale) => void;
  t: typeof translations.ru;
};

const LanguageContext = createContext<LanguageContextType>({} as LanguageContextType);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [locale, setLocaleState] = useState<Locale>('ru');

  useEffect(() => {
    const saved = localStorage.getItem('app_locale') as Locale;
    if (saved && ['ru', 'en', 'ky', 'uz'].includes(saved)) {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = (lang: Locale) => {
    setLocaleState(lang);
    localStorage.setItem('app_locale', lang);
  };

  const t = translations[locale] || translations.ru;

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
