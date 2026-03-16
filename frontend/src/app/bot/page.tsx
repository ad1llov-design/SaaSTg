"use client";
import React, { useState, useEffect } from 'react';
import { Bot, MessageSquare, Save, Palette, CheckCircle2, Eye } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import { useLanguage } from '@/context/LanguageContext';

export default function BotCustomizePage() {
  const { business } = useAuth();
  const { t } = useLanguage();
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
    <div className="space-y-12 py-10 px-4 animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-slate-100 dark:border-white/5 pb-10">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {t.bot.title}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-2">{t.bot.subtitle}</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={loading}
          className="flex items-center justify-center gap-3 px-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50 text-sm uppercase tracking-wider"
        >
          {saved ? <CheckCircle2 className="w-5 h-5" /> : <Save className="w-5 h-5" />}
          {loading ? t.bot.saving : saved ? t.bot.saved : t.bot.deploy}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Панель настроек */}
        <div className="space-y-10">
          <div className="bg-white dark:bg-white/5 rounded-[2rem] border border-slate-200 dark:border-white/10 p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t.bot.section_logic}</h3>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-0.5">{t.bot.section_logic_desc}</p>
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block ml-1">{t.bot.welcome_label}</label>
                <textarea 
                  rows={3}
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium text-sm text-slate-900 dark:text-white resize-none"
                  value={config.welcome_text}
                  onChange={(e) => setConfig({...config, welcome_text: e.target.value})}
                  placeholder={t.bot.welcome_ph}
                />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block ml-1">{t.bot.about_label}</label>
                <textarea 
                  rows={3}
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium text-sm text-slate-900 dark:text-white resize-none"
                  value={config.about_text}
                  onChange={(e) => setConfig({...config, about_text: e.target.value})}
                  placeholder={t.bot.about_ph}
                />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block ml-1">{t.bot.contact_label}</label>
                <textarea 
                  rows={2}
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium text-sm text-slate-900 dark:text-white resize-none"
                  value={config.contact_info}
                  onChange={(e) => setConfig({...config, contact_info: e.target.value})}
                  placeholder={t.bot.contact_ph}
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-white/5 rounded-[2rem] border border-slate-200 dark:border-white/10 p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center">
                <Palette className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t.bot.section_visual}</h3>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-0.5">{t.bot.section_visual_desc}</p>
              </div>
            </div>

            <div className="space-y-6">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block ml-1">{t.bot.emoji_label}</label>
              <div className="grid grid-cols-5 gap-3">
                {['✨', '📅', '✂️', '💅', '🔥', '💎', '🚀', '📍', '🛍️', '✅'].map((emo) => (
                  <button
                    key={emo}
                    onClick={() => setConfig({...config, theme_emoji: emo})}
                    className={`h-14 flex items-center justify-center text-2xl rounded-xl transition-all border-2 ${config.theme_emoji === emo ? 'border-indigo-500 bg-indigo-500/5' : 'border-slate-100 dark:border-white/5 bg-transparent hover:bg-slate-50 dark:hover:bg-white/5'}`}
                  >
                    {emo}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Прямой предпросмотр (Симуляция Telegram) */}
        <div className="lg:sticky lg:top-10">
          <div className="flex flex-col items-center">
            <div className="mb-6 px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
               <span className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                 <Eye className="w-3.5 h-3.5" /> {t.bot.simulator_title}
               </span>
            </div>
            
            <div className="w-full max-w-[340px] bg-[#1c242d] rounded-[3rem] border-[10px] border-slate-900 shadow-2xl overflow-hidden aspect-[9/18.3] flex flex-col relative">
              {/* iPhone Notch */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full z-20" />

              {/* Telegram Header */}
              <div className="bg-[#212d3b] pt-9 pb-4 px-5 flex items-center gap-4 border-b border-black/10">
                <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center font-bold text-white text-sm shadow-md">
                  {business?.name?.[0] || 'A'}
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-bold truncate">{business?.name || 'AuraSync Bot'}</p>
                  <p className="text-[#6ab2f2] text-[10px] font-semibold uppercase tracking-wider">{t.bot.status_online}</p>
                </div>
              </div>

              {/* Message Area */}
              <div className="flex-1 p-5 space-y-4 overflow-y-auto bg-[rgba(14,22,33,0.7)]">
                <div className="bg-[#1e2c3a] p-4 rounded-2xl rounded-tl-none border border-white/5 max-w-[90%] shadow-lg">
                   <p className="text-white text-[13px] leading-relaxed whitespace-pre-wrap">
                     {config.welcome_text}
                   </p>
                </div>
              </div>

              {/* Telegram Buttons */}
              <div className="p-5 bg-[#17212b] border-t border-white/5 space-y-3">
                <div className="bg-[#3e5d8a] py-3.5 rounded-xl text-center text-white text-xs font-bold shadow-md hover:bg-[#4a6d9e] transition-colors">
                  {config.theme_emoji} {t.bot.btn_schedule}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#3e5d8a] py-3.5 rounded-xl text-center text-white text-[11px] font-bold">
                     {t.bot.btn_about}
                  </div>
                  <div className="bg-[#3e5d8a] py-3.5 rounded-xl text-center text-white text-[11px] font-bold">
                     {t.bot.btn_contacts}
                  </div>
                </div>
                <div className="bg-[#242f3d]/50 py-2.5 rounded-xl text-center text-slate-500 text-[10px] font-bold border border-white/5 uppercase tracking-wider">
                   {t.bot.btn_history}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
