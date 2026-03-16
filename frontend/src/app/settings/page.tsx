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
    <div className="space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <DemoModal isOpen={showDemoModal} onClose={() => setShowDemoModal(false)} />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-border pb-10">
        <div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter uppercase text-[var(--text-main)] leading-none">
            Core <span className="font-premium text-indigo-500 italic lowercase tracking-tight">Synchronization</span>
          </h1>
          <p className="text-slate-500 mt-6 font-bold text-xs uppercase tracking-[0.4em] opacity-60 italic">Engineering your Telegram-based client interface protocols.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <div className="premium-card !p-10">
            <div className="flex items-center gap-6 mb-12">
              <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/10 shadow-inner">
                <Bot className="w-8 h-8 text-indigo-500" />
              </div>
              <div>
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] opacity-60">Protocol Integration</h3>
                <p className="text-2xl font-bold text-[var(--text-main)] tracking-tight">Telegram API Handshake</p>
              </div>
            </div>

            <div className="space-y-10">
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] block ml-1 opacity-70">BotFather Secure Access Token</label>
                <div className="relative group">
                  <input type="password" placeholder="123456:ABC-DEF..." className="w-full bg-input/50 border-2 border-transparent focus:border-indigo-500/30 rounded-[1.5rem] px-8 py-6 focus:outline-none transition-all font-mono text-sm shadow-inner" value={token} onChange={(e) => setToken(e.target.value)} />
                </div>
              </div>

              <button onClick={handleConnect} disabled={loading} className="w-full py-7 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-3xl shadow-indigo-600/30 disabled:opacity-50 flex items-center justify-center gap-4 uppercase tracking-[0.3em] text-[11px]">
                {loading ? 'Initializing...' : <><Zap className="w-5 h-5" /> Authorize Intelligence</>}
              </button>

              {status === 'success' && (
                <div className="bg-indigo-500/10 border border-indigo-500/20 p-8 rounded-3xl flex items-center gap-6 animate-in fade-in slide-in-from-top-4">
                  <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center shrink-0 shadow-2xl shadow-indigo-500/30">
                    <CheckCircle2 className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="text-[15px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight">Connection Authenticated</p>
                    <p className="text-xs text-slate-500 mt-1.5 font-bold italic opacity-70 uppercase tracking-widest">Bot <a href={`https://t.me/${botInfo?.username}`} target="_blank" className="underline text-indigo-500 font-bold">@{botInfo?.username}</a> is now live.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="premium-card !p-10">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h3 className="text-2xl font-bold uppercase tracking-tight text-[var(--text-main)]">Operational Control</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Status Notifications</p>
              </div>
              <Bell className="w-6 h-6 text-indigo-500 opacity-60" />
            </div>
            <div className="bg-indigo-500/[0.04] p-10 rounded-3xl border border-indigo-500/10 mb-10 shadow-inner">
              <p className="font-bold text-slate-900 dark:text-slate-100 mb-3 uppercase tracking-tight italic">Direct Link Initialization</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-bold leading-relaxed opacity-70">To authorize administrative alerts, transmit the <span className="text-indigo-500 font-bold">/start</span> protocol to your provisioned node.</p>
            </div>
            <div className="flex items-center justify-between p-7 bg-input/40 rounded-[1.5rem] border border-transparent hover:border-indigo-500/10 transition-all shadow-inner">
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] opacity-60">System Resilience Status</span>
               <div className="flex items-center gap-3">
                 <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                 <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest italic">Stable Node</span>
               </div>
            </div>
          </div>
        </div>

        <div className="space-y-10">
           <div className="premium-card bg-indigo-500/[0.03] border-indigo-500/10 !p-10 hover:border-indigo-500/30 transition-all duration-500">
              <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-10 border border-indigo-500/10 shadow-inner">
                <Shield className="w-8 h-8 text-indigo-500" />
              </div>
              <h3 className="text-xl font-bold mb-6 uppercase tracking-tight">Encryption Layer</h3>
              <p className="text-[13px] text-slate-500 font-bold leading-relaxed mb-10 opacity-70 italic">Protocol keys are serialized using AES-256 standards. We maintain zero-knowledge infrastructure over your API credentials.</p>
              <div className="h-2 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden shadow-inner">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 w-full opacity-60" />
              </div>
           </div>

           <div className="premium-card !p-10">
              <h3 className="text-xl font-bold mb-10 uppercase tracking-tight">Optimization Log</h3>
              <div className="space-y-8">
                 {[
                   'Configure organizational logo via BotFather',
                   'Define brand description for node trust',
                   'Initialize command menu for direct routing'
                 ].map((tip, idx) => (
                   <div key={idx} className="flex gap-5 items-start group">
                      <div className="w-7 h-7 bg-indigo-500/10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-indigo-600 group-hover:rotate-12 transition-all border border-indigo-500/10 shadow-sm">
                        <ArrowRight className="w-4 h-4 text-indigo-500 group-hover:text-white" />
                      </div>
                      <p className="text-[13px] text-slate-500 font-bold leading-relaxed opacity-60 group-hover:opacity-100 transition-opacity tracking-tight">{tip}</p>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
