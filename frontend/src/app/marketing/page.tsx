"use client";
import React, { useState, useEffect } from 'react';
import { 
  Megaphone, 
  Send, 
  History, 
  Users, 
  AlertCircle, 
  CheckCircle2,
  Clock,
  Sparkles,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/components/AuthProvider';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import DemoModal from '@/components/DemoModal';

export default function MarketingPage() {
  const { business, user } = useAuth();
  const { t } = useLanguage();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ clientCount: 0 });
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  useEffect(() => {
    async function fetchStats() {
      if (!business?.id) return;
      const { count } = await supabase
        .from('clients')
        .select('*', { count: 'exact', head: true })
        .eq('business_id', business.id)
        .not('telegram_id', 'is', null);
      
      setStats({ clientCount: count || 0 });
    }
    fetchStats();
  }, [business?.id]);

  const handleSend = async () => {
    if (!user) { setShowDemoModal(true); return; }
    if (!message.trim()) return;

    setLoading(true);
    setStatus(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/broadcast`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId: business?.id,
          message: message
        })
      });

      const data = await response.json();

      if (data.success) {
        setStatus({ type: 'success', msg: `${t.marketing.success_sent} (${data.sentCount})` });
        setMessage('');
        
        // Save to campaign history (optional, let's just log for now)
        await supabase.from('campaigns').insert({
          business_id: business?.id,
          message: message,
          sent_count: data.sentCount,
          status: 'completed'
        });
      } else {
        setStatus({ type: 'error', msg: data.error || 'Failed to send' });
      }
    } catch (err: any) {
      setStatus({ type: 'error', msg: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 py-6 md:py-10 px-4 font-sans animate-in fade-in slide-in-from-bottom-4 duration-700">
      <DemoModal isOpen={showDemoModal} onClose={() => setShowDemoModal(false)} />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-amber-500 font-bold tracking-wider text-xs uppercase mb-2">
            <Megaphone className="w-4 h-4" />
            {t.marketing.title}
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {t.marketing.title}
          </h1>
          <p className="text-slate-500 font-medium">{t.marketing.subtitle}</p>
        </div>

        <div className="premium-card !py-3 !px-6 flex items-center gap-4 bg-amber-500/5 border-amber-500/10 transition-all">
           <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-amber-500" />
           </div>
           <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Active Reach</p>
              <p className="text-lg font-black text-slate-900 dark:text-white leading-none">{stats.clientCount} Clients</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Composer */}
        <div className="lg:col-span-2 space-y-6">
           <div className="premium-card !p-8 space-y-6">
              <div className="flex items-center justify-between">
                 <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                    <Zap className="w-5 h-5 text-amber-500" />
                    New Campaign
                 </h3>
                 <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    Bot Ready
                 </div>
              </div>

              <div className="relative">
                <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t.marketing.message_ph}
                  className="w-full min-h-[250px] bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-2xl p-6 focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500/50 transition-all text-slate-900 dark:text-white font-medium resize-none"
                />
                <div className="absolute bottom-4 right-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white dark:bg-slate-900 px-3 py-1 rounded-full border border-slate-100 dark:border-white/5">
                   {message.length} chars
                </div>
              </div>

              {status && (
                <motion.div 
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className={cn(
                     "p-4 rounded-xl flex items-center gap-3 font-bold text-sm",
                     status.type === 'success' ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" : "bg-rose-500/10 text-rose-600 border border-rose-500/20"
                   )}
                >
                   {status.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                   {status.msg}
                </motion.div>
              )}

              <button 
                onClick={handleSend}
                disabled={loading || !message.trim()}
                className={cn(
                  "btn-premium btn-premium-primary w-full h-16 !bg-amber-500 hover:!bg-amber-600 shadow-amber-500/20 group",
                  (loading || !message.trim()) && "opacity-50 cursor-not-allowed grayscale"
                )}
              >
                {loading ? (
                   <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    {t.marketing.send_btn}
                  </>
                )}
              </button>
           </div>
        </div>

        {/* Info & Help */}
        <div className="space-y-6">
           <div className="premium-card bg-indigo-600 text-white !border-none overflow-hidden relative group">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-1000" />
              <div className="relative z-10 space-y-6">
                 <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-6 h-6" />
                 </div>
                 <div>
                    <h4 className="text-xl font-bold mb-2">Pro Tips</h4>
                    <ul className="space-y-3 text-sm text-indigo-100 font-medium">
                       <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-1.5 shrink-0" />
                          Use emojis to increase clicking rate by 40%
                       </li>
                       <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-1.5 shrink-0" />
                          Announce events 24 hours in advance
                       </li>
                       <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-1.5 shrink-0" />
                          Keep messages short and valuable
                       </li>
                    </ul>
                 </div>
              </div>
           </div>

           <div className="premium-card">
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 bg-slate-100 dark:bg-white/5 rounded-xl flex items-center justify-center">
                    <History className="w-5 h-5 text-slate-500" />
                 </div>
                 <h4 className="font-bold text-lg dark:text-white uppercase tracking-tight">{t.marketing.history}</h4>
              </div>
              <div className="space-y-4">
                 <div className="py-10 text-center">
                    <Clock className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.marketing.no_campaigns}</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
