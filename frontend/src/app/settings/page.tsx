"use client";
import React, { useState, useEffect } from 'react';
import { MessageSquare, Shield, CheckCircle2, AlertCircle, ExternalLink, Bell, Bot, Zap, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import { useLanguage } from '@/context/LanguageContext';
import DemoModal from '@/components/DemoModal';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const { business, user } = useAuth();
  const { t } = useLanguage();
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [botInfo, setBotInfo] = useState<{ username: string } | null>(null);
  const [showDemoModal, setShowDemoModal] = useState(false);

  useEffect(() => {
    if (business?.bot_token) {
      setToken(business.bot_token);
    } else if (!user) {
      setToken('6829103541:AAF_demo_token_example_linkhub');
      setBotInfo({ username: 'DemoSyncBot' });
    }
  }, [business, user]);

  const handleConnect = async () => {
    if (!user) { setShowDemoModal(true); return; }
    if (!token || !business?.id) return;
    setLoading(true); setStatus('idle'); setErrorMsg('');
    try {
      const response = await fetch(`https://api.telegram.org/bot${token}/getMe`);
      const data = await response.json();
      if (data.ok) {
        setBotInfo({ username: data.result.username });
        const { error } = await supabase.from('businesses').update({ bot_token: token }).eq('id', business.id);
        if (error) throw error;
        setStatus('success');
      } else { throw new Error(t.settings.invalid_token); }
    } catch (err: any) { setStatus('error'); setErrorMsg(err.message); }
    setLoading(false);
  };

  return (
    <div className="space-y-8 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <DemoModal isOpen={showDemoModal} onClose={() => setShowDemoModal(false)} />
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-slate-200 dark:border-white/10">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t.settings.title}
          </h1>
          <p className="text-slate-500 mt-2 text-sm">{t.settings.subtitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="premium-card !p-8 bg-white dark:bg-[#1a1c23]">
            <div className="flex items-center gap-5 mb-8">
              <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-100 dark:border-indigo-500/10 shadow-sm">
                <Bot className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.settings.integration}</h3>
                <p className="text-xl font-bold text-slate-900 dark:text-white">{t.settings.tg_api}</p>
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 tracking-wide block ml-1">{t.settings.bot_token}</label>
                <div className="relative group">
                  <input type="password" placeholder="123456:ABC-DEF..." className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-indigo-500 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-mono text-sm shadow-sm" value={token} onChange={(e) => setToken(e.target.value)} />
                </div>
              </div>

              <button onClick={handleConnect} disabled={loading} className="w-full py-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-md hover:shadow-indigo-600/20 disabled:opacity-50 flex items-center justify-center gap-3 text-sm">
                {loading ? t.settings.connecting : <><Zap className="w-4 h-4" /> {t.settings.connect_btn}</>}
              </button>

              {status === 'success' && (
                <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 p-6 rounded-2xl flex items-center gap-5 animate-in fade-in slide-in-from-top-4">
                  <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">{t.settings.success}</p>
                    <p className="text-xs text-emerald-600/80 dark:text-emerald-400/80 mt-1 font-medium">{t.settings.bot_live} <a href={`https://t.me/${botInfo?.username}`} target="_blank" className="underline font-bold">@{botInfo?.username}</a></p>
                  </div>
                </div>
              )}
              {status === 'error' && (
                 <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 p-6 rounded-2xl flex items-center gap-5 animate-in fade-in slide-in-from-top-4">
                  <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center shrink-0 shadow-md shadow-rose-500/20">
                    <AlertCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-rose-700 dark:text-rose-400">{t.settings.error}</p>
                    <p className="text-xs text-rose-600/80 dark:text-rose-400/80 mt-1 font-medium">{errorMsg}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="premium-card !p-8 bg-white dark:bg-[#1a1c23]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t.settings.notifications}</h3>
                <p className="text-xs font-medium text-slate-500 mt-1">{t.settings.notifications_desc}</p>
              </div>
              <Bell className="w-5 h-5 text-slate-400" />
            </div>
            <div className="bg-slate-50 dark:bg-white/[0.04] p-6 rounded-2xl border border-slate-100 dark:border-white/10 mb-6">
              <p className="font-semibold text-slate-900 dark:text-slate-100 mb-2">{t.settings.how_to_start}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{t.settings.how_to_start_desc} <span className="text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded">/start</span></p>
            </div>
            <div className="flex items-center justify-between p-5 bg-white dark:bg-input/40 rounded-xl border border-slate-100 dark:border-white/5 shadow-sm">
               <span className="text-xs font-semibold text-slate-500">{t.settings.system_status}</span>
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                 <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{t.settings.status_ok}</span>
               </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
           <div className="premium-card bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 !p-8">
              <div className="w-12 h-12 bg-white dark:bg-white/10 rounded-xl flex items-center justify-center mb-6 shadow-sm">
                <Shield className="w-6 h-6 text-slate-700 dark:text-slate-300" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">{t.settings.security}</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-6">{t.settings.security_desc}</p>
              <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 w-full opacity-80" />
              </div>
           </div>

           <div className="premium-card !p-8 bg-white dark:bg-[#1a1c23]">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-6">{t.settings.tips}</h3>
              <div className="space-y-5">
                 {[
                   t.settings.tip_1,
                   t.settings.tip_2,
                   t.settings.tip_3
                 ].map((tip, idx) => (
                   <div key={idx} className="flex gap-4 items-start group">
                      <div className="w-6 h-6 bg-slate-50 dark:bg-white/5 rounded-lg flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10 transition-colors">
                        <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-indigo-500" />
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">{tip}</p>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
