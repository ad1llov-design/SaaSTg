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
      days_left: 'дн. осталось'
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
      days_left: 'days left'
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
      days_left: 'күн калды'
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
      days_left: 'kun qoldi'
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
