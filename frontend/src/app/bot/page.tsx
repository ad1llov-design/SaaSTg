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
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase">No-Code <span className="font-premium text-indigo-500 italic lowercase tracking-tight">Architect</span></h1>
          <p className="text-slate-500 mt-2 font-bold text-sm">Проектируйте поведение вашего бота в реальном времени.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-10 py-5 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-indigo-600/20 disabled:opacity-50 uppercase tracking-widest text-[11px]"
        >
          {saved ? <CheckCircle2 className="w-5 h-5" /> : <Save className="w-5 h-5" />}
          {loading ? 'Синхронизация...' : saved ? 'Сохранено' : 'Опубликовать изменения'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Панель настроек */}
        <div className="space-y-6">
          <div className="premium-card !p-8">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/20">
                <MessageSquare className="w-6 h-6 text-indigo-500" />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight">Контент Сообщений</h3>
            </div>

            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block ml-1">Welcome Hook (/start)</label>
                <textarea 
                  rows={3}
                  className="w-full bg-input border-2 border-transparent focus:border-indigo-500/50 rounded-[1.5rem] px-6 py-5 focus:outline-none transition-all font-bold text-sm resize-none shadow-sm"
                  value={config.welcome_text}
                  onChange={(e) => setConfig({...config, welcome_text: e.target.value})}
                  placeholder="Напишите, что бот должен сказать первым делом..."
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block ml-1">Brand Story (О нас)</label>
                <textarea 
                  rows={3}
                  className="w-full bg-input border-2 border-transparent focus:border-indigo-500/50 rounded-[1.5rem] px-6 py-5 focus:outline-none transition-all font-bold text-sm resize-none shadow-sm"
                  value={config.about_text}
                  onChange={(e) => setConfig({...config, about_text: e.target.value})}
                  placeholder="Расскажите о преимуществах вашего бизнеса..."
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block ml-1">Contact Matrix (Адрес/Связь)</label>
                <textarea 
                  rows={2}
                  className="w-full bg-input border-2 border-transparent focus:border-indigo-500/50 rounded-[1.5rem] px-6 py-5 focus:outline-none transition-all font-bold text-sm resize-none shadow-sm"
                  value={config.contact_info}
                  onChange={(e) => setConfig({...config, contact_info: e.target.value})}
                  placeholder="Адрес, телефон, ссылки..."
                />
              </div>
            </div>
          </div>

          <div className="premium-card !p-8">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center border border-amber-500/20">
                <Palette className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight">Visual Identity</h3>
            </div>

            <div className="space-y-6">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block ml-1">System Emoji Accent</label>
              <div className="grid grid-cols-5 gap-4">
                {['✨', '📅', '✂️', '💅', '🔥', '💎', '🚀', '📍', '🛍️', '✅'].map((emo) => (
                  <button
                    key={emo}
                    onClick={() => setConfig({...config, theme_emoji: emo})}
                    className={`h-14 flex items-center justify-center text-2xl rounded-2xl transition-all border-2 ${config.theme_emoji === emo ? 'border-indigo-500 bg-indigo-500/10 scale-105 shadow-lg shadow-indigo-500/10' : 'border-transparent bg-input hover:bg-slate-200 dark:hover:bg-white/5'}`}
                  >
                    {emo}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Прямой предпросмотр (Симуляция Telegram) */}
        <div className="space-y-8">
            <div className="sticky top-10 flex flex-col items-center">
              <div className="mb-6 px-4 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                 <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] flex items-center gap-2">
                   <Eye className="w-3 h-3" /> Live Simulator
                 </span>
              </div>
              
              <div className="w-full max-w-[340px] bg-[#1c242d] rounded-[3rem] border-[12px] border-slate-900 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden aspect-[9/18.5] flex flex-col relative scale-[0.95] origin-top">
                {/* iPhone Dynamic Island Style Notch */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full z-20" />

                {/* Telegram Header */}
                <div className="bg-[#212d3b] pt-8 pb-4 px-5 flex items-center gap-4 border-b border-black/20">
                  <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center font-black text-white text-[12px] shadow-lg">
                    {business?.name?.[0] || 'A'}
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-[12px] font-black leading-none tracking-tight">{business?.name || 'AuraSync Bot'}</p>
                    <p className="text-[#6ab2f2] text-[10px] mt-1 font-bold">bot</p>
                  </div>
                </div>

                {/* Message Area */}
                <div className="flex-1 p-5 space-y-4 overflow-y-auto bg-[rgba(14,22,33,0.7)]">
                  <div className="bg-[#1e2c3a] p-4 rounded-[1.25rem] rounded-tl-none border border-white/5 max-w-[85%] shadow-xl">
                     <p className="text-[#fafafa] text-[12px] leading-relaxed whitespace-pre-wrap font-medium">
                       {config.welcome_text}
                     </p>
                     <p className="text-[#fafafa] text-[12px] leading-relaxed mt-4 font-medium opacity-90">
                       Я помогу вам записаться на прием. Выберите действие:
                     </p>
                  </div>
                </div>

                {/* Telegram Buttons */}
                <div className="p-5 bg-[#17212b] border-t border-white/5 space-y-3">
                  <div className="bg-[#3e5d8a] py-3.5 rounded-xl text-center text-white text-[11px] font-black shadow-lg">
                    {config.theme_emoji} Записаться
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-1 bg-[#3e5d8a] py-3.5 rounded-xl text-center text-white text-[11px] font-black">
                       ℹ️ О нас
                    </div>
                    <div className="flex-1 bg-[#3e5d8a] py-3.5 rounded-xl text-center text-white text-[11px] font-black">
                       📍 Контакты
                    </div>
                  </div>
                  <div className="bg-[#242f3d]/50 py-3 rounded-xl text-center text-slate-400 text-[10px] font-black border border-white/5">
                     📋 Мои записи
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}
