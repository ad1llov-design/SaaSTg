"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  DollarSign,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Мини-SVG график (Sparkline)
function Sparkline({ data, color = '#10b981' }: { data: number[], color?: string }) {
  if (!data.length) return null;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const w = 200;
  const h = 60;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1 || 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  }).join(' ');

  const areaPoints = `0,${h} ${points} ${w},${h}`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-16" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`grad-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#grad-${color.replace('#','')})`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Барный график за последние 7 дней
function WeeklyBarChart({ data }: { data: { day: string, count: number }[] }) {
  const max = Math.max(...data.map(d => d.count), 1);
  
  return (
    <div className="flex items-end gap-3 h-40">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">{d.count}</span>
          <div className="w-full relative rounded-t-lg overflow-hidden" style={{ height: `${(d.count / max) * 100}%`, minHeight: '4px' }}>
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-600 to-emerald-400 opacity-80 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="text-[10px] text-slate-500 font-medium">{d.day}</span>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const { business } = useAuth();
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
        // ДЕМО-ДАННЫЕ для незарегистрированных пользователей
        setStats({
          appointments: 124,
          clients: 89,
          revenue: 62500,
          todayAppointments: 8,
        });
        setWeeklyData([
          { day: 'Пн', count: 12 }, { day: 'Вт', count: 15 }, { day: 'Ср', count: 11 },
          { day: 'Чт', count: 18 }, { day: 'Пт', count: 22 }, { day: 'Сб', count: 25 }, { day: 'Вс', count: 14 }
        ]);
        setSparklineData([10, 15, 8, 12, 20, 18, 25, 22, 30, 28, 35, 32, 40, 38]);
        setRecentAppointments([
          { id: '1', users: { name: 'Александр К.' }, services: { name: 'Стрижка', price: 800 }, appointment_date: 'Сегодня', appointment_time: '14:00', status: 'confirmed' },
          { id: '2', users: { name: 'Мария С.' }, services: { name: 'Маникюр', price: 1200 }, appointment_date: 'Сегодня', appointment_time: '15:30', status: 'pending' },
          { id: '3', users: { name: 'Дмитрий В.' }, services: { name: 'Массаж', price: 2500 }, appointment_date: 'Вчера', appointment_time: '11:00', status: 'completed' },
        ]);
        return;
      }
      
      const bizId = business.id;

      // Все записи с ценой услуги
      const { data: apts } = await supabase
        .from('appointments')
        .select('*, services(price, name)')
        .eq('business_id', bizId);

      // Клиенты
      const { data: clients } = await supabase
        .from('clients')
        .select('id')
        .eq('business_id', bizId);

      // Сегодняшняя дата
      const today = new Date().toISOString().split('T')[0];

      if (apts) {
        // Реальный доход = сумма цен подтвержденных записей
        const revenue = apts
          .filter(a => a.status === 'confirmed' || a.status === 'completed')
          .reduce((sum, a) => sum + (Number(a.services?.price) || 0), 0);

        const todayCount = apts.filter(a => a.appointment_date === today).length;

        setStats({
          appointments: apts.length,
          clients: clients?.length || 0,
          revenue,
          todayAppointments: todayCount,
        });

        // Еженедельные данные для графика
        const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
        const weekly: { day: string, count: number }[] = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const dateStr = d.toISOString().split('T')[0];
          const count = apts.filter(a => a.appointment_date === dateStr).length;
          weekly.push({ day: days[d.getDay()], count });
        }
        setWeeklyData(weekly);

        // Данные для sparkline (последние 14 дней)
        const spark: number[] = [];
        for (let i = 13; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const dateStr = d.toISOString().split('T')[0];
          spark.push(apts.filter(a => a.appointment_date === dateStr).length);
        }
        setSparklineData(spark);
      }

      // Последние записи
      const { data: recent } = await supabase
        .from('appointments')
        .select('*, services(*), users(*)')
        .eq('business_id', bizId)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (recent) setRecentAppointments(recent);
    }
    
    loadAll();
  }, [business]);

  const cards = [
    { 
      name: 'Всего записей', 
      value: stats.appointments, 
      icon: Calendar, 
      color: 'text-blue-500', 
      bg: 'bg-blue-500/10',
      trend: '+12%',
      trendUp: true 
    },
    { 
      name: 'Активные клиенты', 
      value: stats.clients, 
      icon: Users, 
      color: 'text-emerald-500', 
      bg: 'bg-emerald-500/10',
      trend: `+${stats.clients}`,
      trendUp: true 
    },
    { 
      name: 'Доход', 
      value: `${stats.revenue.toLocaleString()} сом`, 
      icon: DollarSign, 
      color: 'text-purple-500', 
      bg: 'bg-purple-500/10',
      trend: stats.revenue > 0 ? `${stats.revenue.toLocaleString()}` : '0',
      trendUp: stats.revenue > 0 
    },
    { 
      name: 'Сегодня', 
      value: stats.todayAppointments, 
      icon: Clock, 
      color: 'text-amber-500', 
      bg: 'bg-amber-500/10',
      trend: `${stats.todayAppointments} записей`,
      trendUp: stats.todayAppointments > 0 
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Заголовок */}
      {!business?.id && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <p className="text-sm text-emerald-100">Вы просматриваете панель в <b>демо-режиме</b>. Чтобы начать работу, создайте свой аккаунт.</p>
          </div>
          <a href="/register" className="px-4 py-2 bg-emerald-500 text-white text-xs font-bold rounded-lg hover:bg-emerald-600 transition-colors">
            Создать аккаунт
          </a>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Панель управления</h2>
          <p className="text-slate-400 mt-1">
            Добро пожаловать! Вот обзор вашего бизнеса <span className="text-emerald-400 font-medium">{business?.name || ''}</span>
          </p>
        </div>
      </div>

      {/* Карточки статистики */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((card) => (
          <div key={card.name} className="glass p-5 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all group">
            <div className="flex items-center justify-between mb-3">
              <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center", card.bg)}>
                <card.icon className={cn("w-5 h-5", card.color)} />
              </div>
              <div className={cn(
                "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg",
                card.trendUp 
                  ? "text-emerald-500 bg-emerald-500/10" 
                  : "text-slate-500 bg-slate-800"
              )}>
                {card.trendUp 
                  ? <ArrowUpRight className="w-3 h-3" /> 
                  : <ArrowDownRight className="w-3 h-3" />
                }
                {card.trend}
              </div>
            </div>
            <p className="text-slate-400 text-sm font-medium">{card.name}</p>
            <p className="text-2xl font-bold mt-0.5">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Графики */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Барный график записей за неделю */}
        <div className="glass rounded-2xl border border-slate-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold">Записи за неделю</h3>
              <p className="text-slate-500 text-sm">Динамика последних 7 дней</p>
            </div>
            <div className="px-3 py-1.5 bg-emerald-500/10 rounded-lg text-emerald-500 text-xs font-bold">
              Всего: {weeklyData.reduce((s, d) => s + d.count, 0)}
            </div>
          </div>
          {weeklyData.length > 0 ? (
            <WeeklyBarChart data={weeklyData} />
          ) : (
            <div className="h-40 flex items-center justify-center text-slate-500 text-sm">
              Пока нет данных для графика
            </div>
          )}
        </div>

        {/* Sparkline тренда */}
        <div className="glass rounded-2xl border border-slate-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold">Тренд за 14 дней</h3>
              <p className="text-slate-500 text-sm">Кривая активности клиентов</p>
            </div>
          </div>
          {sparklineData.length > 0 ? (
            <div className="mt-4">
              <Sparkline data={sparklineData} color="#10b981" />
              <div className="flex justify-between text-[10px] text-slate-600 mt-2">
                <span>14 дней назад</span>
                <span>Сегодня</span>
              </div>
            </div>
          ) : (
            <div className="h-40 flex items-center justify-center text-slate-500 text-sm">
              Пока нет данных
            </div>
          )}
        </div>
      </div>

      {/* Последние записи */}
      <div className="glass rounded-2xl border border-slate-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold">Последние записи</h3>
          <a href="/appointments" className="text-sm text-emerald-500 font-bold hover:underline">Все записи →</a>
        </div>
        <div className="space-y-4">
          {recentAppointments.length === 0 ? (
            <p className="text-slate-500 text-center py-8">Записей пока нет. Ваш первый клиент уже в пути!</p>
          ) : recentAppointments.map((apt) => (
            <div key={apt.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/30 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center font-bold text-sm">
                  {apt.users?.name?.[0] || 'U'}
                </div>
                <div>
                  <p className="font-semibold text-sm">{apt.users?.name || 'Клиент'}</p>
                  <p className="text-xs text-slate-500">{apt.services?.name} • {apt.services?.price} сом</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{apt.appointment_time}</p>
                <p className="text-xs text-slate-500">{apt.appointment_date}</p>
              </div>
              <span className={cn(
                "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                apt.status === 'confirmed' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                apt.status === 'cancelled' ? "bg-rose-500/10 text-rose-400 border-rose-500/20" :
                "bg-amber-500/10 text-amber-500 border-amber-500/20"
              )}>
                {apt.status === 'confirmed' ? 'Подтв.' : 
                 apt.status === 'cancelled' ? 'Отменено' : 'Ожидает'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
