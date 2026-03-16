-- Миграция v2: добавление полей для аутентификации и уведомлений
-- Запустите этот SQL в Supabase SQL Editor

-- Добавляем поле owner_id для связки с Supabase Auth
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS owner_id UUID;

-- Добавляем поле admin_telegram_id для уведомлений владельцу
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS admin_telegram_id BIGINT;

-- Создаем индекс для быстрого поиска бизнеса по владельцу
CREATE INDEX IF NOT EXISTS idx_businesses_owner ON businesses(owner_id);

-- Обновляем RLS для businesses (Row Level Security)
-- Включаем RLS
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;

-- Политика: владелец видит только свой бизнес
CREATE POLICY "Users can view own business" ON businesses
  FOR SELECT USING (owner_id = auth.uid());

CREATE POLICY "Users can update own business" ON businesses
  FOR UPDATE USING (owner_id = auth.uid());

CREATE POLICY "Users can insert own business" ON businesses
  FOR INSERT WITH CHECK (owner_id = auth.uid());

-- RLS для services
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own services" ON services
  FOR ALL USING (business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid()));

-- RLS для appointments
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own appointments" ON appointments
  FOR ALL USING (business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid()));

-- RLS для clients
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own clients" ON clients
  FOR ALL USING (business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid()));

-- Разрешаем service_role обходить RLS (для бэкенда)
-- Это делается автоматически в Supabase при использовании service_role key
