-- LinkHub SaaS: Полная структура базы данных (v2)
-- Используйте этот файл для первичной настройки базы данных в Supabase

-- 1. Расширения
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Таблица businesses (Организации)
CREATE TABLE IF NOT EXISTS businesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  owner_email TEXT NOT NULL UNIQUE,
  owner_id UUID, -- Связь с Supabase Auth
  bot_token TEXT UNIQUE,
  admin_telegram_id BIGINT, -- Для уведомлений владельцу
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Индекс для быстрого поиска по владельцу
CREATE INDEX IF NOT EXISTS idx_businesses_owner ON businesses(owner_id);

-- 3. Таблица users (Клиенты в Telegram)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  telegram_id BIGINT UNIQUE NOT NULL,
  name TEXT,
  username TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Таблица services (Услуги)
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price DECIMAL(10, 2),
  duration_minutes INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Таблица appointments (Записи на прием)
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, confirmed, cancelled, completed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Таблица clients (База клиентов конкретного бизнеса)
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  telegram_id BIGINT NOT NULL,
  name TEXT,
  visits_count INTEGER DEFAULT 0,
  last_visit TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(business_id, telegram_id)
);

-- 7. Настройка ограничений доступа (RLS)
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- 8. Политики доступа
-- Businesses
CREATE POLICY "Users can view own business" ON businesses FOR SELECT USING (owner_id = auth.uid());
CREATE POLICY "Users can update own business" ON businesses FOR UPDATE USING (owner_id = auth.uid());
CREATE POLICY "Users can insert own business" ON businesses FOR INSERT WITH CHECK (owner_id = auth.uid());

-- Services
CREATE POLICY "Users track own services" ON services FOR ALL USING (business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid()));

-- Appointments
CREATE POLICY "Users track own appointments" ON appointments FOR ALL USING (business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid()));

-- Clients
CREATE POLICY "Users track own clients" ON clients FOR ALL USING (business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid()));
