"use client";
import React from 'react';
import { CheckCircle2, Zap, Shield, CreditCard, Sparkles, Star } from 'lucide-react';
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

  const handlePayment = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/billing/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId: business?.id,
          ownerEmail: user?.email,
        }),
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url; // Redirect to Stripe
      }
    } catch (err) {
      console.error('Payment failed:', err);
      alert('Ошибка при инициализации оплаты. Попробуйте позже.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 py-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          AuraSync <span className="font-premium text-emerald-500 italic">Pro</span>
        </h1>
        <p className="text-slate-500 font-medium max-w-lg mx-auto">
          Разблокируйте полный потенциал вашего бизнеса с нашей профессиональной подпиской.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Карточка плана */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="premium-card relative overflow-hidden border-2 border-emerald-500/20"
        >
          <div className="absolute top-0 right-0 p-4">
            <div className="bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-emerald-500/20">
              Optimal
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-2">Pro План</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-emerald-500">$15</span>
              <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">/ месяц</span>
            </div>
          </div>

          <ul className="space-y-4 mb-10">
            {features.map((feature, idx) => (
              <li key={idx} className="flex items-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-400">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                {feature}
              </li>
            ))}
          </ul>

          <button 
            onClick={handlePayment}
            className="w-full py-5 bg-emerald-500 text-white font-bold rounded-2xl hover:bg-emerald-600 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3"
          >
            <CreditCard className="w-5 h-5" /> Оплатить сейчас
          </button>
          
          <p className="text-center text-[10px] text-slate-400 mt-4 font-bold uppercase tracking-widest">
            Безопасная оплата через Stripe & Crypto
          </p>
        </motion.div>

        {/* Статус и информация */}
        <div className="space-y-6">
          <div className="premium-card bg-emerald-500/5">
             <div className="flex items-center gap-4 mb-4">
               <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                 <Star className="w-5 h-5 text-emerald-500" />
               </div>
               <h4 className="font-bold">Текущий статус</h4>
             </div>
             
             <div className="space-y-4">
               <div className="flex justify-between items-center text-sm">
                 <span className="text-slate-500 font-medium">Ваш тариф:</span>
                 <span className="font-bold uppercase text-[10px] tracking-widest px-3 py-1 bg-slate-100 dark:bg-white/5 rounded-full">
                   {business?.subscription_status === 'active' ? 'Full Access' : 'Trial Period'}
                 </span>
               </div>
               <div className="flex justify-between items-center text-sm">
                 <span className="text-slate-500 font-medium">Осталось дней:</span>
                 <span className={cn(
                   "font-black",
                   trialDaysLeft > 2 ? "text-emerald-500" : "text-rose-500"
                 )}>
                   {trialDaysLeft} дней
                 </span>
               </div>
             </div>
          </div>

          <div className="premium-card">
            <div className="flex items-center gap-4 mb-4">
               <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                 <Shield className="w-5 h-5 text-blue-500" />
               </div>
               <h4 className="font-bold">Гарантия возврата</h4>
             </div>
             <p className="text-xs text-slate-500 leading-relaxed font-medium">
               Мы уверены в AuraSync. Если в течение первых 7 дней после оплаты вы решите, что сервис вам не подходит, мы вернем 100% стоимости подписки без лишних вопросов.
             </p>
          </div>

          {isExpired && (
            <div className="premium-card bg-rose-500/10 border-rose-500/20 animate-pulse">
               <div className="flex items-start gap-4">
                 <Zap className="w-6 h-6 text-rose-500 mt-1" />
                 <div>
                   <p className="font-bold text-rose-500 text-sm">Внимание!</p>
                   <p className="text-xs text-rose-500/80 font-medium">Ваш триал закончился. Доступ к управлению записями ограничен до момента оплаты Pro подписки.</p>
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
