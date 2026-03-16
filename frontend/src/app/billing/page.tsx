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
    <div className="max-w-4xl mx-auto space-y-10 py-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-7xl font-black tracking-tighter uppercase text-[var(--text-main)]">
          AuraSync <span className="font-premium text-indigo-500 italic lowercase tracking-tight">Pro</span>
        </h1>
        <p className="text-slate-500 font-bold max-w-lg mx-auto text-sm uppercase tracking-widest">
          Активация подписки в течение 15 минут
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Карточка плана */}
        <motion.div 
          whileHover={{ y: -10 }}
          className="premium-card relative overflow-hidden border-2 border-indigo-500/20 shadow-2xl shadow-indigo-500/5"
        >
          <div className="absolute top-0 right-0 p-6">
            <div className="bg-indigo-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-xl">
              Most Popular
            </div>
          </div>
          
          <div className="mb-10 pt-4">
            <h3 className="text-3xl font-black mb-3 uppercase tracking-tight text-[var(--text-main)]">Business Plan</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-6xl font-black text-indigo-600 tracking-tighter">$15</span>
              <span className="text-slate-400 font-black uppercase text-[12px] tracking-widest">/ месяц</span>
            </div>
          </div>

          <ul className="space-y-5 mb-12">
            {features.map((feature, idx) => (
              <li key={idx} className="flex items-center gap-4 text-sm font-bold text-slate-600 dark:text-slate-400">
                <div className="w-6 h-6 bg-indigo-500/10 rounded-lg flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                </div>
                {feature}
              </li>
            ))}
          </ul>

          <button 
            onClick={handlePayment}
            className="w-full py-6 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-indigo-600/30 flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
          >
            <Bot className="w-5 h-5" /> Оплатить в Telegram
          </button>
          
          <p className="text-center text-[10px] text-slate-400 mt-6 font-black uppercase tracking-[0.2em] leading-relaxed">
            Безопасный платеж через официальный бот
          </p>
        </motion.div>

        {/* Статус и информация */}
        <div className="space-y-8">
          <div className="premium-card bg-indigo-500/5 border-indigo-500/10">
             <div className="flex items-center gap-4 mb-6">
               <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/20">
                 <Star className="w-6 h-6 text-indigo-500" />
               </div>
               <h4 className="font-black uppercase tracking-tight text-lg">Статус Аккаунта</h4>
             </div>
             
             <div className="space-y-6">
               <div className="flex justify-between items-center text-sm border-b border-border pb-4">
                 <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Тариф:</span>
                 <span className="font-black uppercase text-[11px] tracking-widest px-4 py-2 bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-500/20">
                   {business?.subscription_status === 'active' ? 'Enterprise Access' : 'Initial Trial'}
                 </span>
               </div>
               <div className="flex justify-between items-center text-sm">
                 <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Лимит времени:</span>
                 <span className={cn(
                   "font-black text-xl tracking-tighter",
                   trialDaysLeft > 2 ? "text-indigo-600" : "text-rose-600"
                 )}>
                   {trialDaysLeft} дней
                 </span>
               </div>
             </div>
          </div>

          <div className="premium-card border-slate-200 dark:border-white/5">
            <div className="flex items-center gap-4 mb-6">
               <div className="w-12 h-12 bg-slate-100 dark:bg-white/10 rounded-2xl flex items-center justify-center">
                 <Shield className="w-6 h-6 text-slate-500" />
               </div>
               <h4 className="font-black uppercase tracking-tight text-lg">Процесс активации</h4>
             </div>
             <div className="space-y-5 text-[11px] text-slate-500 leading-relaxed font-bold uppercase tracking-widest">
               <div className="flex items-baseline gap-3">
                 <span className="text-indigo-500 font-black text-sm">01.</span>
                 <p>Нажмите <b className="text-indigo-600 italic">«Оплатить в Telegram»</b> и перейдите в бот.</p>
               </div>
               <div className="flex items-baseline gap-3">
                 <span className="text-indigo-500 font-black text-sm">02.</span>
                 <p>Получите реквизиты и произведите перевод.</p>
               </div>
               <div className="flex items-baseline gap-3">
                 <span className="text-indigo-500 font-black text-sm">03.</span>
                 <p>Отправьте <b className="text-indigo-600 italic">скриншот чека</b> администратору в бот.</p>
               </div>
               <div className="flex items-baseline gap-3">
                 <span className="text-indigo-500 font-black text-sm">04.</span>
                 <p>Ожидайте уведомления об <b className="text-indigo-600 italic">успешной активации</b>.</p>
               </div>
             </div>
          </div>

          {isExpired && (
            <div className="premium-card bg-rose-600 !border-none text-white shadow-2xl shadow-rose-600/20">
               <div className="flex items-start gap-4">
                 <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                   <Zap className="w-6 h-6 text-white" />
                 </div>
                 <div>
                   <p className="font-black text-sm uppercase tracking-widest">Срок истек</p>
                   <p className="text-[11px] text-rose-50/80 font-bold mt-1 leading-relaxed">Лимит пробного использования исчерпан. Для продолжения работы требуется активация Pro лицензии.</p>
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
