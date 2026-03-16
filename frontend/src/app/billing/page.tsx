"use client";
import React from 'react';
import { CheckCircle2, Zap, Shield, Bot, Sparkles, Star } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { motion } from 'framer-motion';

export default function BillingPage() {
  const { trialDaysLeft, business, user } = useAuth();
  
  const isExpired = trialDaysLeft <= 0 && business?.subscription_status !== 'active';

  const features = [
    "Неограниченное количество записей",
    "Собственный брендированный Telegram-бот",
    "Управление услугами и мастерами",
    "CRM система клиентов",
    "Мгновенные уведомления владельцу",
    "Аналитика выручки и посещений",
    "Техподдержка 24/7"
  ];

  const handlePayment = () => {
    // ЗАМЕНИТЕ ЭТУ ССЫЛКУ на ваш Telegram бот или ваш личный аккаунт
    const TELEGRAM_ADMIN_URL = "https://t.me/AuraSyncAdminBot"; 
    window.open(TELEGRAM_ADMIN_URL, '_blank');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-5">
        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter uppercase text-[var(--text-main)]">
          System <span className="font-premium text-indigo-500 italic lowercase tracking-tight">Expansion</span>
        </h1>
        <p className="text-slate-500 font-bold max-w-lg mx-auto text-xs uppercase tracking-[0.4em] opacity-60">
          Pro license activation within <span className="text-indigo-500 italic">15 minutes</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Карточка плана */}
        <motion.div 
          whileHover={{ y: -10 }}
          className="premium-card relative overflow-hidden border-2 border-indigo-500/20 shadow-3xl !p-12 bg-indigo-500/[0.02]"
        >
          <div className="absolute top-0 right-0 p-8">
            <div className="bg-indigo-600 text-white text-[9px] font-bold px-5 py-2 rounded-full uppercase tracking-[0.3em] shadow-xl">
              Enterprise Grade
            </div>
          </div>
          
          <div className="mb-14 pt-4">
            <h3 className="text-3xl font-bold mb-4 uppercase tracking-tighter text-[var(--text-main)]">AuraSync Pro</h3>
            <div className="flex items-baseline gap-3">
              <span className="text-7xl font-bold text-indigo-600 tracking-tighter italic">$15</span>
              <span className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">Per Lunar Cycle</span>
            </div>
          </div>

          <ul className="space-y-6 mb-14">
            {features.map((feature, idx) => (
              <li key={idx} className="flex items-center gap-5 text-sm font-bold text-slate-600 dark:text-slate-400 group">
                <div className="w-8 h-8 bg-indigo-500/10 rounded-xl flex items-center justify-center shrink-0 border border-indigo-500/10 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="tracking-tight">{feature}</span>
              </li>
            ))}
          </ul>

          <button 
            onClick={handlePayment}
            className="w-full py-6 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-indigo-600/30 flex items-center justify-center gap-4 uppercase tracking-[0.25em] text-xs"
          >
            <Bot className="w-5 h-5" /> Initialize Payment
          </button>
          
          <p className="text-center text-[9px] text-slate-400 mt-8 font-bold uppercase tracking-[0.3em] opacity-60">
            Secure processing via Aura Gateway Protocol
          </p>
        </motion.div>

        {/* Статус и информация */}
        <div className="space-y-10">
          <div className="premium-card !p-10 border-indigo-500/10 hover:border-indigo-500/30 transition-all">
             <div className="flex items-center gap-5 mb-10">
               <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/10">
                 <Star className="w-7 h-7 text-indigo-500" />
               </div>
               <div>
                 <h4 className="font-bold uppercase tracking-tight text-xl">Node Status</h4>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Verification Details</p>
               </div>
             </div>
             
             <div className="space-y-8">
               <div className="flex justify-between items-center text-sm border-b border-border pb-6">
                 <span className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[9px]">Tier Level:</span>
                 <span className="font-bold uppercase text-[10px] tracking-widest px-5 py-2.5 bg-indigo-500 text-white rounded-xl shadow-xl shadow-indigo-500/20">
                   {business?.subscription_status === 'active' ? 'Enterprise Access' : 'Initial Protocol'}
                 </span>
               </div>
               <div className="flex justify-between items-center text-sm">
                 <span className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[9px]">Protocol Deadline:</span>
                 <span className={cn(
                   "font-bold text-2xl tracking-tighter italic",
                   trialDaysLeft > 2 ? "text-indigo-600" : "text-rose-600"
                 )}>
                   {trialDaysLeft} Days Rem.
                 </span>
               </div>
             </div>
          </div>

          <div className="premium-card !p-10 border-slate-200 dark:border-white/5">
            <div className="flex items-center gap-5 mb-10">
               <div className="w-14 h-14 bg-slate-50 dark:bg-white/5 rounded-2xl flex items-center justify-center border border-border">
                 <Shield className="w-7 h-7 text-slate-400" />
               </div>
               <div>
                 <h4 className="font-bold uppercase tracking-tight text-xl">Activation Flow</h4>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Security Standards</p>
               </div>
             </div>
             <div className="space-y-6 text-[11px] text-slate-500 leading-relaxed font-bold uppercase tracking-[0.2em]">
                {[
                  { step: '01', text: 'Initialize «Payment» and authorize the terminal.' },
                  { step: '02', text: 'Receive credentials and perform transaction.' },
                  { step: '03', text: 'Transmit verification artifact (screenshot) to core.' },
                  { step: '04', text: 'Await final network synchronization and access.' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-5 group">
                    <span className="text-indigo-500 font-bold text-sm tracking-tighter opacity-40 group-hover:opacity-100 transition-opacity italic">{item.step}</span>
                    <p className="group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors">{item.text}</p>
                  </div>
                ))}
             </div>
          </div>

          {isExpired && (
            <div className="premium-card !bg-rose-600 !border-none text-white shadow-3xl !p-10 animate-pulse">
               <div className="flex items-start gap-6">
                 <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
                   <Zap className="w-7 h-7 text-white" />
                 </div>
                 <div>
                   <p className="font-bold text-lg uppercase tracking-tight">Access Terminated</p>
                   <p className="text-[11px] text-white/70 font-bold mt-2 leading-relaxed uppercase tracking-widest">Initial protocol cycle complete. Upgrade required to resume business operations.</p>
                 </div>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
