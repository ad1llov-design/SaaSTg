const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = (process.env.SUPABASE_URL || '').split('\n')[0].trim();
const supabaseKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').split('\n')[0].trim();

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
