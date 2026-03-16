"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import { 
  Users, 
  Calendar, 
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  DollarSign,
  Sparkles,
  Zap,
  TrendingUp,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Мини-SVG график (Sparkline)
function Sparkline({ data, color = '#10b981' }: { data: number[], color?: string }) {
  if (!data.length) return null;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const w = 300;
  const h = 80;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1 || 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  }).join(' ');

  const areaPoints = `0,${h} ${points} ${w},${h}`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-24" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`grad-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#grad-${color.replace('#','')})`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Барный график за последние 7 дней
function WeeklyBarChart({ data }: { data: { day: string, count: number }[] }) {
  const max = Math.max(...data.map(d => d.count), 1);
  
  return (
    <div className="flex items-end gap-2 md:gap-4 h-48 pt-4">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
          <div className="w-full relative rounded-t-xl overflow-hidden min-h-[4px]" style={{ height: `${(d.count / max) * 100}%` }}>
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-600 to-emerald-400 opacity-80 group-hover:opacity-100 transition-all duration-500" />
          </div>
          <span className="text-[10px] md:text-xs text-slate-500 font-bold uppercase tracking-wider">{d.day}</span>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const { business, user } = useAuth();
  const [stats, setStats] = useState({
    appointments: 0,
    clients: 0,
    revenue: 0,
    todayAppointments: 0,
  });
  const [recentAppointments, setRecentAppointments] = useState<any[]>([]);
  const [weeklyData, setWeeklyData] = useState<{ day: string, count: number }[]>([]);
  const [sparklineData, setSparklineData] = useState<number[]>([]);

  useEffect(() => {
    async function loadAll() {
      if (!business?.id) {
        // ДЕМО-ДАННЫЕ
        setStats({ appointments: 124, clients: 89, revenue: 62500, todayAppointments: 12 });
        setWeeklyData([{ day: 'Пн', count: 12 }, { day: 'Вт', count: 15 }, { day: 'Ср', count: 11 }, { day: 'Чт', count: 18 }, { day: 'Пт', count: 22 }, { day: 'Сб', count: 25 }, { day: 'Вс', count: 14 }]);
        setSparklineData([10, 15, 8, 12, 20, 18, 25, 22, 30, 28, 35, 32, 40, 38]);
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
        const revenue = apts.filter(a => a.status === 'confirmed' || a.status === 'completed').reduce((sum, a) => sum + (Number(a.services?.price) || 0), 0);
        const todayCount = apts.filter(a => a.appointment_date === today).length;
        setStats({ appointments: apts.length, clients: clients?.length || 0, revenue, todayAppointments: todayCount });

        const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
        const weekly = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date(); d.setDate(d.getDate() - i);
          const dateStr = d.toISOString().split('T')[0];
          weekly.push({ day: days[d.getDay()], count: apts.filter(a => a.appointment_date === dateStr).length });
        }
        setWeeklyData(weekly);

        const spark = [];
        for (let i = 13; i >= 0; i--) {
          const d = new Date(); d.setDate(d.getDate() - i);
          const dateStr = d.toISOString().split('T')[0];
          spark.push(apts.filter(a => a.appointment_date === dateStr).length);
        }
        setSparklineData(spark);
      }

      const { data: recent } = await supabase.from('appointments').select('*, services(*), users(*)').eq('business_id', bizId).order('created_at', { ascending: false }).limit(5);
      if (recent) setRecentAppointments(recent);
    }
    loadAll();
  }, [business]);

  const cards = [
    { name: 'Активные записи', value: stats.appointments, icon: Calendar, color: 'text-indigo-500', bg: 'bg-indigo-500/10', trend: '+14%' },
    { name: 'База клиентов', value: stats.clients, icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-500/10', trend: `+${Math.floor(stats.clients/4)}` },
    { name: 'Чистая выручка', value: `${stats.revenue.toLocaleString()} сом`, icon: DollarSign, color: 'text-amber-500', bg: 'bg-amber-500/10', trend: '+$2.4k' },
    { name: 'Записи за сегодня', value: stats.todayAppointments, icon: Clock, color: 'text-cyan-500', bg: 'bg-cyan-500/10', trend: 'Live' },
  ];

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* ДЕМО-ПЛАШКА */}
      {!user && (
        <div className="relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-emerald-500/20 animate-pulse" />
          <div className="relative glass border-emerald-500/30 p-4 md:p-6 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-center md:text-left">
              <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-lg leading-tight">Попробуйте AuraSync Premium</h4>
                <p className="text-sm text-slate-500">Вы используете демо-режим. Весь функционал доступен после регистрации.</p>
              </div>
            </div>
            <a href="/register" className="w-full md:w-auto px-8 py-3 bg-emerald-500 text-white font-bold rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-emerald-500/20 text-center">
              7 дней бесплатно
            </a>
          </div>
        </div>
      )}

      {/* ЗАГОЛОВОК */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
            Бизнес-аналитика <span className="font-premium text-emerald-500 italic">Aura</span>
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Добро пожаловать, <span className="text-slate-900 dark:text-white font-bold">{business?.name || 'Гость'}</span>. Вот ваши показатели за сегодня.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 glass rounded-full self-start">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-500">Live Status</span>
        </div>
      </div>

      {/* КАРТОЧКИ */}
      <div className="dashboard-grid">
        {cards.map((card) => (
          <div key={card.name} className="premium-card group">
            <div className="flex items-center justify-between mb-6">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500", card.bg)}>
                <card.icon className={cn("w-6 h-6", card.color)} />
              </div>
              <div className="text-[10px] font-bold px-2 py-1 bg-slate-100 dark:bg-white/5 rounded-lg text-slate-500">
                {card.trend}
              </div>
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{card.name}</p>
            <p className="text-2xl md:text-3xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>

      {/* ГРАФИКИ */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 premium-card">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold">Активность за неделю</h3>
              <p className="text-xs text-slate-500 font-medium">Динамика входящих записей</p>
            </div>
            <div className="flex items-center gap-2">
               <TrendingUp className="w-4 h-4 text-emerald-500" />
               <span className="text-xs font-bold text-emerald-500">+12.5%</span>
            </div>
          </div>
          <WeeklyBarChart data={weeklyData} />
        </div>

        <div className="lg:col-span-2 premium-card">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold">Удержание</h3>
            <span className="text-[10px] font-bold text-slate-500 uppercase border border-slate-500/20 px-2 py-1 rounded-lg">Last 14 Days</span>
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <Sparkline data={sparklineData} color="#10b981" />
            <div className="grid grid-cols-2 mt-8 gap-4 border-t border-slate-500/10 pt-6">
               <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Максимум</p>
                  <p className="text-xl font-bold">{Math.max(...sparklineData, 0)}</p>
               </div>
               <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Среднее</p>
                  <p className="text-xl font-bold">{Math.round(sparklineData.reduce((a,b)=>a+b,0)/14)}</p>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* ПОСЛЕДНИЕ ЗАПИСИ */}
      <div className="premium-card">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold">Последние события</h3>
          <Link href="/appointments" className="flex items-center gap-1 text-xs font-bold text-emerald-500 hover:gap-2 transition-all">
            Смотреть все <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="space-y-2">
          {recentAppointments.map((apt) => (
            <div key={apt.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-500/5 transition-all group border border-transparent hover:border-slate-500/10">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center font-bold text-xs ring-2 ring-transparent group-hover:ring-emerald-500/20 transition-all">
                  {apt.users?.name?.[0] || 'U'}
                </div>
                <div>
                  <p className="font-bold text-sm leading-tight">{apt.users?.name || 'Клиент'}</p>
                  <p className="text-[11px] text-slate-500 font-medium">{apt.services?.name} • {apt.services?.price} сом</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="hidden md:block text-right">
                  <p className="text-xs font-bold leading-tight">{apt.appointment_time}</p>
                  <p className="text-[10px] text-slate-500 font-medium">{apt.appointment_date}</p>
                </div>
                <div className={cn(
                  "px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                  apt.status === 'confirmed' ? "bg-emerald-500/10 text-emerald-500" :
                  apt.status === 'cancelled' ? "bg-rose-500/10 text-rose-500" :
                  "bg-amber-500/10 text-amber-500"
                )}>
                  {apt.status === 'confirmed' ? 'Active' : 
                   apt.status === 'cancelled' ? 'Denied' : 'Pending'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
