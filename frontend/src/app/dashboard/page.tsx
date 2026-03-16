"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import { 
  Users, 
  Calendar, 
  Clock, 
  DollarSign, 
  Zap, 
  TrendingUp, 
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const { business, user } = useAuth();
  const { t } = useLanguage();
  const [stats, setStats] = useState({ appointments: 0, clients: 0, revenue: 0, todayAppointments: 0 });
  const [recentAppointments, setRecentAppointments] = useState<any[]>([]);

  useEffect(() => {
    async function loadAll() {
      if (!business?.id) {
        setStats({ appointments: 124, clients: 89, revenue: 62500, todayAppointments: 12 });
        setRecentAppointments([
          { id: '1', users: { name: 'Александр К.' }, services: { name: 'Стрижка', price: 800 }, appointment_date: 'Сегодня', appointment_time: '14:00', status: 'confirmed' },
          { id: '2', users: { name: 'Мария С.' }, services: { name: 'Маникюр', price: 1200 }, appointment_date: 'Сегодня', appointment_time: '15:30', status: 'pending' },
          { id: '3', users: { name: 'Дмитрий В.' }, services: { name: 'Массаж', price: 2500 }, appointment_date: 'Вчера', appointment_time: '11:00', status: 'completed' },
        ]);
        return;
      }
      
      const bizId = business.id;
      const { data: apts } = await supabase.from('appointments').select('*, services(price, name)').eq('business_id', bizId);
      const { data: clients } = await supabase.from('clients').select('id').eq('business_id', bizId);
      const today = new Date().toISOString().split('T')[0];

      if (apts) {
        const revenue = apts.filter((a: any) => a.status === 'confirmed' || a.status === 'completed').reduce((sum: number, a: any) => sum + (Number(a.services?.price) || 0), 0);
        const todayCount = apts.filter((a: any) => a.appointment_date === today).length;
        setStats({ appointments: apts.length, clients: clients?.length || 0, revenue, todayAppointments: todayCount });
      }

      const { data: recent } = await supabase.from('appointments').select('*, services(*), users(*)').eq('business_id', bizId).order('created_at', { ascending: false }).limit(4);
      if (recent) setRecentAppointments(recent);
    }
    loadAll();
  }, [business]);

  const cards = [
    { name: t.dashboard.active_apts, value: stats.appointments, icon: Calendar, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { name: t.dashboard.clients_base, value: stats.clients, icon: UserCheck, color: 'text-violet-500', bg: 'bg-violet-500/10' },
    { name: t.dashboard.revenue, value: stats.revenue.toLocaleString(), icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { name: t.dashboard.today_apts, value: stats.todayAppointments, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  ];

  return (
    <div className="space-y-8 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {!user && (
        <div className="relative overflow-hidden premium-card !bg-indigo-600 !border-none p-8 shadow-xl shadow-indigo-500/20 rounded-[2rem]">
          <div className="absolute right-0 top-0 w-80 h-80 bg-white/10 rounded-full -mr-32 -mt-32 blur-[100px] animate-pulse" />
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6 text-center md:text-left text-white">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center shrink-0 border border-white/10 shadow-lg">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-2xl md:text-3xl tracking-tight">{t.dashboard.promo_title}</h4>
                <p className="text-indigo-100 mt-1 max-w-md">{t.dashboard.promo_subtitle}</p>
              </div>
            </div>
            <Link href="/register" className="w-full md:w-auto px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl text-center">
              {t.dashboard.promo_btn}
            </Link>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t.dashboard.title}
          </h1>
          <p className="text-slate-500 mt-2 text-sm flex items-center gap-2">
            <span className="w-2 h-2 bg-indigo-500 rounded-full inline-block" />
            {t.dashboard.active_partner}: <span className="font-semibold text-slate-700 dark:text-slate-300">{business?.name || 'AuraSync'}</span>
          </p>
        </div>
        <div className="flex items-center gap-3 px-5 py-2.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl shadow-sm">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">{t.dashboard.subtitle}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div key={card.name} className="premium-card group hover:-translate-y-1 !p-6 transition-all duration-300 relative overflow-hidden bg-white dark:bg-[#1a1c23]">
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center transition-all group-hover:scale-110", card.bg)}>
                <card.icon className={cn("w-6 h-6", card.color)} />
              </div>
              <TrendingUp className="w-5 h-5 text-slate-300 dark:text-slate-700" />
            </div>
            <p className="text-sm font-medium text-slate-500 tracking-wide mb-1 relative z-10">{card.name}</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight relative z-10">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="premium-card !p-0 overflow-hidden bg-white dark:bg-[#1a1c23]">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-white/5">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t.dashboard.recent_activity}</h3>
          <Link href="/appointments" className="flex items-center gap-1 text-sm font-semibold text-indigo-500 hover:text-indigo-600 transition-all">
            {t.dashboard.view_all} <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="p-2 space-y-1">
          {recentAppointments.length === 0 ? (
            <div className="py-12 text-center text-slate-400 font-medium text-sm">{t.dashboard.no_activity}</div>
          ) : (
            recentAppointments.map((apt: any) => (
              <div key={apt.id} className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center font-bold text-slate-500">
                    {apt.users?.name?.[0] || 'A'}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{apt.users?.name || 'Client'}</p>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">{apt.services?.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{apt.appointment_time}</p>
                    <p className="text-xs text-slate-400">{apt.appointment_date}</p>
                  </div>
                  <div className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-semibold min-w-[100px] text-center",
                    apt.status === 'confirmed' ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" :
                    apt.status === 'cancelled' ? "bg-rose-500/10 text-rose-600 dark:text-rose-400" : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                  )}>
                    {apt.status === 'confirmed' ? t.dashboard.verified : apt.status === 'cancelled' ? t.dashboard.denied : t.dashboard.awaiting}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
