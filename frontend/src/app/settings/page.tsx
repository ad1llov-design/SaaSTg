"use client";
import React, { useState, useEffect } from 'react';
import { MessageSquare, Shield, CheckCircle2, AlertCircle, ExternalLink, Bell, Bot, Zap, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import DemoModal from '@/components/DemoModal';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const { business, user } = useAuth();
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
      } else { throw new Error('Некорректный токен бота'); }
    } catch (err: any) { setStatus('error'); setErrorMsg(err.message); }
    setLoading(false);
  };

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <DemoModal isOpen={showDemoModal} onClose={() => setShowDemoModal(false)} />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">Ядро <span className="font-premium text-emerald-500 italic">Синхронизации</span></h1>
          <p className="text-slate-500 mt-2 font-medium">Конфигурация вашего Telegram-интерфейса.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="premium-card">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center">
                <Bot className="w-6 h-6 text-emerald-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-500 uppercase tracking-widest text-[11px]">Настройка Telegram Токена</h3>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block ml-1">Bot Father API Token</label>
                <div className="relative group">
                  <input type="password" placeholder="123456:ABC-DEF..." className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4.5 focus:outline-none focus:border-emerald-500 transition-all font-mono text-sm leading-relaxed" value={token} onChange={(e) => setToken(e.target.value)} />
                </div>
              </div>

              <button onClick={handleConnect} disabled={loading} className="w-full py-5 bg-emerald-500 text-white font-bold rounded-2xl hover:scale-[1.01] active:scale-[0.99] transition-all shadow-xl shadow-emerald-500/20 disabled:opacity-50 flex items-center justify-center gap-3 group">
                {loading ? 'Синхронизация...' : <><Zap className="w-5 h-5 group-hover:animate-pulse" /> Подключить интеллект</>}
              </button>

              {status === 'success' && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-2xl flex items-center gap-4 animate-in fade-in slide-in-from-top-2">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-emerald-500">Успешное подключение!</p>
                    <p className="text-xs text-emerald-400 mt-0.5">Теперь ваш бот <a href={`https://t.me/${botInfo?.username}`} target="_blank" className="underline font-bold">@{botInfo?.username}</a> готов к работе.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="premium-card">
            <h3 className="text-xl font-bold mb-6">Уведомления для владельца</h3>
            <div className="bg-emerald-500/5 p-6 rounded-2xl border border-emerald-500/10 mb-6">
              <div className="flex items-start gap-4">
                <Bell className="w-6 h-6 text-emerald-500 mt-1" />
                <div>
                  <p className="font-bold text-slate-200 mb-1 leading-tight">Мгновенные Telegram оповещения</p>
                  <p className="text-sm text-slate-400">Чтобы получать уведомления о новых записях лично, отправьте команду <b>/start</b> вашему зарегистрированному боту.</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 glass rounded-xl">
               <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Статус оповещений</span>
               <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[10px] font-bold">Активен</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
           <div className="premium-card bg-gradient-to-br from-emerald-500/10 to-transparent">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-5 h-5 text-emerald-500" />
              </div>
              <h3 className="text-lg font-bold mb-3">Безопасность API</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-6">Ваши токены шифруются по стандарту AES-256 перед сохранением в базу данных. Мы никогда не передаем ваш API ключ третьим лицам.</p>
              <div className="h-1.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-full" />
              </div>
           </div>

           <div className="premium-card">
              <h3 className="text-lg font-bold mb-6">Быстрые советы</h3>
              <div className="space-y-4">
                 {[
                   'Используйте BotFather для настройки логотипа бота',
                   'Добавьте описание бота для повышения доверия',
                   'Настройте меню команд для быстрого доступа'
                 ].map((tip, idx) => (
                   <div key={idx} className="flex gap-3 items-start group">
                      <div className="w-5 h-5 bg-emerald-500/20 rounded-lg flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-110 transition-all">
                        <ArrowRight className="w-3 h-3 text-emerald-500" />
                      </div>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed">{tip}</p>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
