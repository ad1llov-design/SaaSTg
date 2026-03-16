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
    <div className="space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-border pb-10">
        <div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter uppercase leading-none">Bot <span className="font-premium text-indigo-500 italic lowercase tracking-tight">Architect</span></h1>
          <p className="text-slate-500 mt-6 font-bold text-xs uppercase tracking-[0.3em] opacity-60 italic">Engineering autonomous client interaction protocols.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={loading}
          className="flex items-center justify-center gap-4 px-12 py-6 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-indigo-600/30 disabled:opacity-50 uppercase tracking-[0.25em] text-xs"
        >
          {saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {loading ? 'Synchronizing...' : saved ? 'Artifact Stored' : 'Deploy Protocol'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Панель настроек */}
        <div className="space-y-10">
          <div className="premium-card !p-10">
            <div className="flex items-center gap-5 mb-12">
              <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/10 shadow-inner">
                <MessageSquare className="w-7 h-7 text-indigo-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold uppercase tracking-tight">Logic Parameters</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Message Archetypes</p>
              </div>
            </div>

            <div className="space-y-10">
              <div className="space-y-4 text-center sm:text-left">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] block ml-1 opacity-70">Welcome Hook (/start)</label>
                <textarea 
                  rows={3}
                  className="w-full bg-input border-2 border-transparent focus:border-indigo-500/50 rounded-[2rem] px-8 py-6 focus:outline-none transition-all font-bold text-sm resize-none shadow-inner"
                  value={config.welcome_text}
                  onChange={(e) => setConfig({...config, welcome_text: e.target.value})}
                  placeholder="System initialization message..."
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] block ml-1 opacity-70">Brand Story (About)</label>
                <textarea 
                  rows={3}
                  className="w-full bg-input border-2 border-transparent focus:border-indigo-500/50 rounded-[2rem] px-8 py-6 focus:outline-none transition-all font-bold text-sm resize-none shadow-inner"
                  value={config.about_text}
                  onChange={(e) => setConfig({...config, about_text: e.target.value})}
                  placeholder="Corporate mission and values..."
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] block ml-1 opacity-70">Contact Matrix (Direct Access)</label>
                <textarea 
                  rows={2}
                  className="w-full bg-input border-2 border-transparent focus:border-indigo-500/50 rounded-[2rem] px-8 py-6 focus:outline-none transition-all font-bold text-sm resize-none shadow-inner"
                  value={config.contact_info}
                  onChange={(e) => setConfig({...config, contact_info: e.target.value})}
                  placeholder="Operational contact endpoints..."
                />
              </div>
            </div>
          </div>

          <div className="premium-card !p-10">
            <div className="flex items-center gap-5 mb-12">
              <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/10">
                <Palette className="w-7 h-7 text-indigo-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold uppercase tracking-tight">Visual Identity</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">UI Aesthetic Markers</p>
              </div>
            </div>

            <div className="space-y-8">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] block ml-1 opacity-70 text-center sm:text-left">Protocol Emoji Accent</label>
              <div className="grid grid-cols-5 gap-5">
                {['✨', '📅', '✂️', '💅', '🔥', '💎', '🚀', '📍', '🛍️', '✅'].map((emo) => (
                  <button
                    key={emo}
                    onClick={() => setConfig({...config, theme_emoji: emo})}
                    className={`h-16 flex items-center justify-center text-3xl rounded-2xl transition-all border-2 ${config.theme_emoji === emo ? 'border-indigo-500 bg-indigo-500/10 scale-105 shadow-2xl shadow-indigo-500/20' : 'border-slate-100 dark:border-white/5 bg-transparent hover:bg-slate-50 dark:hover:bg-white/[0.02]'}`}
                  >
                    {emo}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Прямой предпросмотр (Симуляция Telegram) */}
        <div className="space-y-10">
            <div className="sticky top-12 flex flex-col items-center">
              <div className="mb-8 px-6 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full shadow-sm">
                 <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-[0.4em] flex items-center gap-3">
                   <Eye className="w-3.5 h-3.5" /> Protocol Simulator
                 </span>
              </div>
              
              <div className="w-full max-w-[360px] bg-[#1c242d] rounded-[3.5rem] border-[12px] border-slate-900 shadow-[0_60px_120px_-30px_rgba(0,0,0,0.6)] overflow-hidden aspect-[9/18.5] flex flex-col relative scale-[0.95] origin-top">
                {/* iPhone Dynamic Island Style Notch */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-20" />

                {/* Telegram Header */}
                <div className="bg-[#212d3b] pt-10 pb-5 px-6 flex items-center gap-5 border-b border-black/20">
                  <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center font-bold text-white text-[14px] shadow-lg italic">
                    {business?.name?.[0] || 'A'}
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-[14px] font-bold leading-none tracking-tight">{business?.name || 'AuraSync Bot'}</p>
                    <p className="text-[#6ab2f2] text-[10px] mt-1.5 font-bold uppercase tracking-widest opacity-80">autonomous node</p>
                  </div>
                </div>

                {/* Message Area */}
                <div className="flex-1 p-6 space-y-6 overflow-y-auto bg-[rgba(14,22,33,0.7)] backdrop-blur-sm">
                  <div className="bg-[#1e2c3a] p-5 rounded-[1.5rem] rounded-tl-none border border-white/5 max-w-[90%] shadow-2xl">
                     <p className="text-[#fafafa] text-[13px] leading-relaxed whitespace-pre-wrap font-bold tracking-tight">
                       {config.welcome_text}
                     </p>
                     <p className="text-[#fafafa]/70 text-[11px] leading-relaxed mt-5 font-bold uppercase tracking-[0.1em]">
                       Select direct protocol action:
                     </p>
                  </div>
                </div>

                {/* Telegram Buttons */}
                <div className="p-6 bg-[#17212b] border-t border-white/5 space-y-4">
                  <div className="bg-[#3e5d8a] py-4 rounded-2xl text-center text-white text-[12px] font-bold shadow-2xl hover:bg-[#4a6d9e] transition-colors tracking-tight">
                    {config.theme_emoji} Schedule Session
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1 bg-[#3e5d8a] py-4 rounded-2xl text-center text-white text-[11px] font-bold tracking-tight">
                       ℹ️ Brand Story
                    </div>
                    <div className="flex-1 bg-[#3e5d8a] py-4 rounded-2xl text-center text-white text-[11px] font-bold tracking-tight">
                       📍 Contact
                    </div>
                  </div>
                  <div className="bg-[#242f3d]/50 py-3 rounded-2xl text-center text-slate-400 text-[9px] font-bold border border-white/10 uppercase tracking-[0.2em] shadow-inner mt-2">
                     📋 User Protocol History
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}
