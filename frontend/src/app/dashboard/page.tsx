"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  Plus,
  ArrowUpRight,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const [stats, setStats] = useState({
    appointments: 0,
    clients: 0,
    revenue: 0,
  });
  const [recentAppointments, setRecentAppointments] = useState<any[]>([]);

  useEffect(() => {
    async function loadStats() {
      const { data: apts } = await supabase.from('appointments').select('*');
      const { data: clients } = await supabase.from('clients').select('*');
      const { data: services } = await supabase.from('services').select('price');

      if (apts) {
        setStats({
          appointments: apts.length,
          clients: clients?.length || 0,
          revenue: apts
            .filter(a => a.status === 'confirmed')
            .length * 50, // Временная логика расчета
        });
      }

      const { data: recent } = await supabase
        .from('appointments')
        .select('*, services(*), users(*)')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (recent) setRecentAppointments(recent);
    }
    loadStats();
  }, []);

  const cards = [
    { name: 'Всего записей', value: stats.appointments, icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { name: 'Активные клиенты', value: stats.clients, icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { name: 'Прогноз дохода', value: `${stats.revenue}$`, icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Панель управления</h2>
          <p className="text-slate-400 mt-1">Добро пожаловать обратно! Вот что происходит сегодня.</p>
        </div>
        <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 active:scale-95">
          <Plus className="w-5 h-5" />
          Новая запись
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div key={card.name} className="glass p-6 rounded-3xl border border-slate-800 hover:border-slate-700 transition-colors group">
            <div className="flex items-center justify-between mb-4">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", card.bg)}>
                <card.icon className={cn("w-6 h-6", card.color)} />
              </div>
              <div className="flex items-center gap-1 text-emerald-500 text-sm font-bold bg-emerald-500/10 px-2 py-1 rounded-lg">
                <ArrowUpRight className="w-4 h-4" />
                +12%
              </div>
            </div>
            <p className="text-slate-400 font-medium">{card.name}</p>
            <p className="text-3xl font-bold mt-1">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass rounded-3xl border border-slate-800 p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold">Последние записи</h3>
            <button className="text-sm text-emerald-500 font-bold hover:underline">См. все</button>
          </div>
          <div className="space-y-6">
            {recentAppointments.length === 0 ? (
               <p className="text-slate-500 text-center py-8">Записей пока нет.</p>
            ) : recentAppointments.map((apt) => (
              <div key={apt.id} className="flex items-center justify-between group cursor-default">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center font-bold text-lg">
                    {apt.users?.full_name?.[0] || 'U'}
                  </div>
                  <div>
                    <p className="font-bold group-hover:text-emerald-400 transition-colors">{apt.users?.full_name || 'Клиент'}</p>
                    <p className="text-sm text-slate-400">{apt.services?.name}</p>
                  </div>
                </div>
                <div className="text-right text-sm">
                  <p className="font-medium">{apt.appointment_time}</p>
                  <p className="text-slate-500 text-xs">{apt.appointment_date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-3xl border border-slate-800 p-8 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center">
                <Clock className="w-10 h-10 text-emerald-500" />
            </div>
            <h3 className="text-xl font-bold">График работы</h3>
            <p className="text-slate-400 max-w-xs text-sm">
              Ваш бот принимает записи по настроенному графику. Вы можете изменить его в настройках.
            </p>
            <button className="text-emerald-500 font-bold border border-emerald-500/20 px-6 py-2 rounded-xl hover:bg-emerald-500/5 transition-colors">
              Настроить
            </button>
        </div>
      </div>
    </div>
  );
}
