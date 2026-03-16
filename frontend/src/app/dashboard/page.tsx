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
        <div className="relative overflow-hidden premium-card !bg-indigo-600 !border-none p-6 md:p-10">
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse" />
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6 text-center md:text-left text-white">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center shrink-0 border border-white/10 shadow-2xl">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h4 className="font-extrabold text-2xl md:text-3xl leading-tight">AuraSync <span className="text-indigo-200 italic">Premium</span></h4>
                <p className="text-sm md:text-base text-indigo-50/80 mt-2 max-w-md font-medium">Бескомпромиссная автоматизация для масштабирования вашего бренда.</p>
              </div>
            </div>
            <Link href="/register" className="w-full md:w-auto px-12 py-5 bg-white text-indigo-600 font-black rounded-2xl hover:bg-slate-50 transition-all shadow-2xl shadow-black/20 text-center uppercase tracking-widest text-[12px]">
              Начать бесплатно
            </Link>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
        <div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-[var(--text-main)] uppercase">
            Business <span className="font-premium text-indigo-500 italic lowercase tracking-tight">Intelligence</span>
          </h1>
          <p className="text-slate-500 mt-4 font-bold text-sm flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-indigo-500" />
            Рады видеть вас, <span className="text-[var(--text-main)]">{business?.name || 'Партнер'}</span>
          </p>
        </div>
        <div className="flex items-center gap-3 px-5 py-2.5 bg-indigo-500/5 border border-indigo-500/10 rounded-full self-start">
          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-ping" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500">Live Analytics</span>
        </div>
      </div>

      <div className="dashboard-grid">
        {cards.map((card) => (
          <div key={card.name} className="premium-card group hover:scale-[1.02]">
            <div className="flex items-center justify-between mb-8">
              <div className={cn("w-14 h-14 rounded-[1.25rem] flex items-center justify-center transition-transform group-hover:rotate-12", card.bg.replace('emerald', 'indigo').replace('cyan', 'violet'))}>
                <card.icon className={cn("w-7 h-7", card.color.replace('emerald', 'indigo').replace('cyan', 'violet'))} />
              </div>
              <div className="h-1.5 w-14 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                 <div className={cn("h-full w-2/3 opacity-50", card.bg.replace('/10', '').replace('emerald', 'indigo').replace('cyan', 'violet'))} />
              </div>
            </div>
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2">{card.name}</p>
            <p className="text-3xl font-black text-[var(--text-main)] tracking-tight">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="premium-card !p-0 overflow-hidden border-border/50">
        <div className="flex items-center justify-between p-8 border-b border-border">
          <h3 className="text-xl font-black text-[var(--text-main)] uppercase tracking-tight">Последние записи</h3>
          <Link href="/appointments" className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-indigo-500 hover:gap-2 transition-all">
            Все данные <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="p-4 space-y-2">
          {recentAppointments.length === 0 ? (
            <div className="py-10 text-center text-slate-400 font-bold text-sm">У вас пока нет записей</div>
          ) : (
            recentAppointments.map((apt: any) => (
              <div key={apt.id} className="flex items-center justify-between p-5 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all group">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-white dark:bg-white/10 rounded-2xl flex items-center justify-center font-black text-xs text-slate-400 border border-border shadow-sm group-hover:bg-indigo-500 group-hover:text-white transition-all">
                    {apt.users?.name?.[0] || 'A'}
                  </div>
                  <div>
                    <p className="font-black text-sm text-[var(--text-main)] uppercase tracking-tight">{apt.users?.name || 'Клиент'}</p>
                    <p className="text-[11px] text-slate-500 font-bold">{apt.services?.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="hidden sm:block text-right">
                    <p className="text-xs font-black text-[var(--text-main)]">{apt.appointment_time}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{apt.appointment_date}</p>
                  </div>
                  <div className={cn(
                    "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] shadow-sm min-w-[70px] text-center",
                    apt.status === 'confirmed' ? "bg-indigo-500 text-white" :
                    apt.status === 'cancelled' ? "bg-rose-500/10 text-rose-500" : "bg-amber-500/10 text-amber-500"
                  )}>
                    {apt.status === 'confirmed' ? 'Ок' : apt.status === 'cancelled' ? 'Нет' : 'Ждет'}
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
