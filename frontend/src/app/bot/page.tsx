"use client";
import React, { useState, useEffect } from 'react';
import { Bot, MessageSquare, Sparkles, Save, Layout, Palette, CheckCircle2, Eye } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import { motion } from 'framer-motion';

export default function BotCustomizePage() {
  const { business, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [config, setConfig] = useState({
    welcome_text: '👋 Добро пожаловать!',
    about_text: 'Мы лучший сервис в городе!',
    theme_emoji: '✨',
    contact_info: 'Наш адрес: ул. Примерная, 10'
  });

  useEffect(() => {
    if (business?.bot_config) {
      setConfig({ ...config, ...business.bot_config });
    }
  }, [business]);

  const handleSave = async () => {
    if (!business?.id) return;
    setLoading(true);
    setSaved(false);

    const { error } = await supabase
      .from('businesses')
      .update({ bot_config: config })
      .eq('id', business.id);

    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">Премиум <span className="font-premium text-emerald-500 italic">Конструктор</span></h1>
          <p className="text-slate-500 mt-2 font-medium">Кастомизируйте своего бота под стиль вашего бренда.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-8 py-4 bg-emerald-500 text-white font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-emerald-500/20 disabled:opacity-50"
        >
          {saved ? <CheckCircle2 className="w-5 h-5" /> : <Save className="w-5 h-5" />}
          {loading ? 'Сохранение...' : saved ? 'Готово!' : 'Сохранить изменения'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Панель настроек */}
        <div className="space-y-6">
          <div className="premium-card">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-emerald-500" />
              </div>
              <h3 className="text-lg font-bold">Тексты и Сообщения</h3>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block ml-1">Приветствие (/start)</label>
                <textarea 
                  rows={3}
                  className="w-full bg-input border border-transparent focus:border-emerald-500 rounded-2xl px-5 py-4 focus:outline-none transition-all font-bold text-sm resize-none"
                  value={config.welcome_text}
                  onChange={(e) => setConfig({...config, welcome_text: e.target.value})}
                  placeholder="Напишите, что бот должен сказать первым делом..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block ml-1">О нас / Информация</label>
                <textarea 
                  rows={3}
                  className="w-full bg-input border border-transparent focus:border-emerald-500 rounded-2xl px-5 py-4 focus:outline-none transition-all font-bold text-sm resize-none"
                  value={config.about_text}
                  onChange={(e) => setConfig({...config, about_text: e.target.value})}
                  placeholder="Расскажите о преимуществах вашего бизнеса..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block ml-1">Контакты / Адрес</label>
                <textarea 
                  rows={2}
                  className="w-full bg-input border border-transparent focus:border-emerald-500 rounded-2xl px-5 py-4 focus:outline-none transition-all font-bold text-sm resize-none"
                  value={config.contact_info}
                  onChange={(e) => setConfig({...config, contact_info: e.target.value})}
                  placeholder="Адрес, телефон, ссылки..."
                />
              </div>
            </div>
          </div>

          <div className="premium-card">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center">
                <Palette className="w-5 h-5 text-amber-500" />
              </div>
              <h3 className="text-lg font-bold">Стиль и Эмодзи</h3>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block ml-1">Главный эмодзи кнопок</label>
              <div className="grid grid-cols-5 gap-3">
                {['✨', '📅', '✂️', '💅', '🔥', '💎', '🚀', '📍', '🛍️', '✅'].map((emo) => (
                  <button
                    key={emo}
                    onClick={() => setConfig({...config, theme_emoji: emo})}
                    className={`h-12 flex items-center justify-center text-xl rounded-xl transition-all border-2 ${config.theme_emoji === emo ? 'border-emerald-500 bg-emerald-500/10 scale-110' : 'border-transparent bg-input hover:bg-slate-200'}`}
                  >
                    {emo}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Прямой предпросмотр (Симуляция Telegram) */}
        <div className="space-y-6">
           <div className="sticky top-10">
              <div className="text-center mb-4">
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                   <Eye className="w-3 h-3" /> Live Preview
                 </span>
              </div>
              
              <div className="w-full max-w-[320px] mx-auto bg-[#17212b] rounded-[2.5rem] border-[8px] border-slate-800 shadow-2xl overflow-hidden aspect-[9/16] flex flex-col">
                {/* Telegram Header */}
                <div className="bg-[#242f3d] p-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center font-bold text-white text-[10px]">
                    {business?.name?.[0] || 'A'}
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-[11px] font-bold leading-none">{business?.name || 'AuraSync Bot'}</p>
                    <p className="text-blue-400 text-[9px] mt-1">bot</p>
                  </div>
                </div>

                {/* Message Area */}
                <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                  <div className="bg-[#182533] p-3 rounded-2xl rounded-tl-none border border-white/5 max-w-[85%] animate-in fade-in slide-in-from-left-2">
                     <p className="text-white text-[11px] leading-relaxed whitespace-pre-wrap">
                       {config.welcome_text}
                     </p>
                     <p className="text-white text-[11px] leading-relaxed mt-4">
                       Я помогу вам записаться на прием. Выберите действие:
                     </p>
                  </div>
                </div>

                {/* Telegram Buttons */}
                <div className="p-4 bg-black/20 space-y-2">
                  <div className="bg-[#2b5278] py-2 rounded-lg text-center text-white text-[10px] font-bold shadow-lg">
                    {config.theme_emoji} Записаться
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-[#2b5278] py-2 rounded-lg text-center text-white text-[10px] font-bold">
                       📋 Мои записи
                    </div>
                    <div className="flex-1 bg-[#2b5278] py-2 rounded-lg text-center text-white text-[10px] font-bold">
                       ❌ Отмена
                    </div>
                  </div>
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
