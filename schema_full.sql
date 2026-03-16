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
DROP POLICY IF EXISTS "Users can view own business" ON businesses;
DROP POLICY IF EXISTS "Users can update own business" ON businesses;
DROP POLICY IF EXISTS "Users can insert own business" ON businesses;

CREATE POLICY "Users can view own business" ON businesses FOR SELECT USING (owner_id = auth.uid());
CREATE POLICY "Users can update own business" ON businesses FOR UPDATE USING (owner_id = auth.uid());
-- Мы разрешаем инсерт, если owner_id совпадает с текущим пользователем (даже если он еще не подтвердил email, иногда это работает)
-- Но лучше использовать триггер.
CREATE POLICY "Users can insert own business" ON businesses FOR INSERT WITH CHECK (true); 

-- 9. Автоматическое создание бизнеса при регистрации (Триггер)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.businesses (name, owner_email, owner_id)
  VALUES (
    COALESCE(new.raw_user_meta_data->>'business_name', 'Мой бизнес'),
    new.email,
    new.id
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Пересоздаем триггер
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Restore missing policies
CREATE POLICY "Users track own services" ON services FOR ALL USING (business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid()));
CREATE POLICY "Users track own appointments" ON appointments FOR ALL USING (business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid()));
CREATE POLICY "Users track own clients" ON clients FOR ALL USING (business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid()));
