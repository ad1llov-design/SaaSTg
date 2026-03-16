"use client";
import React from 'react';
import { CheckCircle2, Zap, Shield, Bot, Star, Sparkles } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

export default function BillingPage() {
  const { trialDaysLeft, business } = useAuth();
  const { t } = useLanguage();
  
  const isExpired = trialDaysLeft <= 0 && business?.subscription_status !== 'active';

  const handlePayment = () => {
    const TELEGRAM_ADMIN_URL = "https://t.me/AuraSyncAdminBot"; 
    window.open(TELEGRAM_ADMIN_URL, '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-10 px-4 animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider border border-indigo-100 dark:border-indigo-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          {t.billing.enterprise_tag}
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {t.billing.title}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium max-w-lg mx-auto text-sm">
          {t.billing.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {/* Карточка плана */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white dark:bg-white/[0.03] rounded-[2.5rem] border border-slate-200 dark:border-white/10 p-10 shadow-xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8">
            <div className="bg-indigo-600 text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
              {t.billing.popular_tag}
            </div>
          </div>
          
          <div className="mb-10">
            <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">{t.billing.plan_name}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">{t.billing.plan_desc}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-extrabold text-indigo-600 dark:text-indigo-400 tracking-tight">{t.billing.price}</span>
              <span className="text-slate-500 font-semibold text-sm">{t.common.currency} {t.billing.price_period}</span>
            </div>
          </div>

          <ul className="space-y-4 mb-10">
            {t.billing.features.map((feature, idx) => (
              <li key={idx} className="flex items-center gap-4 text-sm font-medium text-slate-600 dark:text-slate-300">
                <div className="w-6 h-6 bg-emerald-500/10 rounded-lg flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                </div>
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <button 
            onClick={handlePayment}
            className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-3 text-sm"
          >
            <Bot className="w-4 h-4" /> {t.billing.buy_btn}
          </button>
        </motion.div>

        {/* Статус и информация */}
        <div className="space-y-8">
          <div className="bg-white dark:bg-white/[0.03] rounded-[2.5rem] border border-slate-200 dark:border-white/10 p-8 shadow-lg">
             <div className="flex items-center gap-4 mb-8">
               <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center">
                 <Star className="w-6 h-6 text-indigo-500" />
               </div>
               <div>
                 <h4 className="font-bold text-lg text-slate-900 dark:text-white">{t.billing.status_title}</h4>
                 <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{t.billing.status_subtitle}</p>
               </div>
             </div>
             
             <div className="space-y-6">
                <div className="flex justify-between items-center py-4 border-b border-slate-100 dark:border-white/5">
                  <span className="text-slate-500 font-semibold text-sm">{t.billing.tier}:</span>
                  <span className="font-bold text-xs uppercase tracking-wider px-4 py-1.5 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-xl">
                    {business?.subscription_status === 'active' ? t.billing.tier_pro : t.billing.tier_free}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-semibold text-sm">{t.billing.deadline}:</span>
                  <span className={cn(
                    "font-bold text-xl tracking-tight",
                    trialDaysLeft > 2 ? "text-slate-900 dark:text-white" : "text-rose-500"
                  )}>
                    {trialDaysLeft} {t.billing.days_left_status}
                  </span>
                </div>
             </div>
          </div>

          <div className="bg-slate-100/50 dark:bg-white/[0.02] rounded-[2.5rem] border border-slate-200/50 dark:border-white/5 p-8 shadow-inner">
            <div className="flex items-center gap-4 mb-8">
               <div className="w-12 h-12 bg-slate-200 dark:bg-white/5 rounded-2xl flex items-center justify-center">
                 <Shield className="w-6 h-6 text-slate-400" />
               </div>
               <div>
                 <h4 className="font-bold text-lg text-slate-900 dark:text-white">{t.billing.how_to_pay}</h4>
               </div>
             </div>
             <div className="space-y-5">
                {t.billing.pay_steps.map((text, i) => (
                  <div key={i} className="flex gap-4 group">
                    <span className="text-indigo-500/40 font-bold text-sm italic">0{i+1}</span>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed">{text}</p>
                  </div>
                ))}
             </div>
          </div>

          {isExpired && (
            <div className="bg-rose-500 p-8 rounded-[2.5rem] text-white shadow-xl shadow-rose-500/20 animate-pulse">
               <div className="flex items-start gap-5">
                 <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                   <Zap className="w-6 h-6 text-white" />
                 </div>
                 <div>
                   <p className="font-bold text-lg leading-tight mb-1">{t.billing.expired_title}</p>
                   <p className="text-xs text-white/80 font-medium leading-relaxed">{t.billing.expired_desc}</p>
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
