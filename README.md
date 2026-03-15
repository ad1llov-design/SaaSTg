# LinkHub SaaS - Система записи через Telegram

SaaS платформа для управления записями клиентов через Telegram-ботов.

## Структура проекта
- `/backend`: Node.js сервер, работающий с Telegram API (Telegraf) и Supabase.
- `/frontend`: Next.js админ-панель для владельцев бизнеса.
- `database.sql`: Скрипт инициализации базы данных.

## Быстрый старт

### 1. База данных (Supabase)
1. Создайте проект в [Supabase](https://supabase.com).
2. Перейдите в **SQL Editor** и выполните содержимое файла `database.sql` из корня проекта.

### 2. Настройка Backend
1. Зайдите в папку `backend`.
2. Переименуйте `.env.example` в `.env`.
3. Заполните `SUPABASE_URL` и `SUPABASE_SERVICE_ROLE_KEY`.
4. Введите `APP_URL` (ваш адрес сервера, например через ngrok или heroku).
5. Запустите: `npm run dev` (добавьте `"dev": "nodemon index.js"` в package.json).

### 3. Настройка Frontend
1. Зайдите в папку `frontend`.
2. Переименуйте `.env.local` в свой.
3. Заполните `NEXT_PUBLIC_SUPABASE_URL` и `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Запустите: `npm run dev`.

## Как пользоваться
1. Зайдите в админ-панель (`localhost:3000`).
2. Перейдите в **Bot Settings** и вставьте токен вашего бота от @BotFather.
3. Перейдите в **Services** и добавьте хотя бы одну услугу.
4. Откройте своего бота в Telegram и попробуйте записаться!

## Модель монетизации
Бизнес платит за доступ к этой админ-панели и за удобный интерфейс записи в Telegram.
