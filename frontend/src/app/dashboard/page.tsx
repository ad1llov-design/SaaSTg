"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
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
    { name: 'Активные записи', value: stats.appointments, icon: Calendar, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { name: 'База клиентов', value: stats.clients, icon: UserCheck, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { name: 'Выручка (сом)', value: stats.revenue.toLocaleString(), icon: DollarSign, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { name: 'За сегодня', value: stats.todayAppointments, icon: Clock, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
  ];

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {!user && (
        <div className="relative overflow-hidden premium-card !bg-emerald-500 !border-none p-6 md:p-8">
          <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-xl" />
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-center md:text-left text-white">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                <Zap className="w-7 h-7 text-white animate-pulse" />
              </div>
              <div>
                <h4 className="font-bold text-xl leading-tight">Попробуйте AuraSync Premium</h4>
                <p className="text-sm text-emerald-50/80 mt-1">Оцените всю мощь автоматизации записей совершенно бесплатно.</p>
              </div>
            </div>
            <Link href="/register" className="w-full md:w-auto px-10 py-4 bg-white text-emerald-600 font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/10 text-center">
              7 дней бесплатно
            </Link>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-[var(--text-main)]">
            Бизнес-аналитика <span className="font-premium text-emerald-500 italic">Aura</span>
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Добро пожаловать, <span className="text-emerald-500 font-bold">{business?.name || 'Гость'}</span></p>
        </div>
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full self-start">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">Live Analytics</span>
        </div>
      </div>

      <div className="dashboard-grid">
        {cards.map((card) => (
          <div key={card.name} className="premium-card">
            <div className="flex items-center justify-between mb-6">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", card.bg)}>
                <card.icon className={cn("w-6 h-6", card.color)} />
              </div>
              <div className="h-1.5 w-12 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                 <div className={cn("h-full w-2/3", card.bg.replace('/10', ''))} />
              </div>
            </div>
            <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">{card.name}</p>
            <p className="text-2xl font-bold text-[var(--text-main)]">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="premium-card">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold text-[var(--text-main)]">Последние записи</h3>
          <Link href="/appointments" className="flex items-center gap-1 text-xs font-bold text-emerald-500 hover:gap-2 transition-all">
            Все записи <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="space-y-3">
          {recentAppointments.map((apt: any) => (
            <div key={apt.id} className="flex items-center justify-between p-4 rounded-2xl bg-[var(--bg-input)] border border-transparent hover:border-emerald-500/20 transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white dark:bg-white/10 rounded-full flex items-center justify-center font-bold text-[10px] text-slate-600 dark:text-slate-300 shadow-sm">
                  {apt.users?.name?.[0] || 'U'}
                </div>
                <div>
                  <p className="font-bold text-sm leading-tight text-[var(--text-main)]">{apt.users?.name || 'Клиент'}</p>
                  <p className="text-[11px] text-slate-500 font-medium">{apt.services?.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="hidden sm:block text-right">
                  <p className="text-xs font-bold text-[var(--text-main)]">{apt.appointment_time}</p>
                  <p className="text-[10px] text-slate-500">{apt.appointment_date}</p>
                </div>
                <div className={cn(
                  "px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-wider shadow-sm",
                  apt.status === 'confirmed' ? "bg-emerald-500 text-white" :
                  apt.status === 'cancelled' ? "bg-rose-500/10 text-rose-500" : "bg-amber-500/10 text-amber-500"
                )}>
                  {apt.status === 'confirmed' ? 'Ок' : apt.status === 'cancelled' ? 'Нет' : 'Ждет'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
