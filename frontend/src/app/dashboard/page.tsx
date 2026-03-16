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
    { name: 'Aktive Protocols', value: stats.appointments, icon: Calendar, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { name: 'Identity Base', value: stats.clients, icon: UserCheck, color: 'text-violet-500', bg: 'bg-violet-500/10' },
    { name: 'Yield (сом)', value: stats.revenue.toLocaleString(), icon: DollarSign, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { name: 'Daily Flux', value: stats.todayAppointments, icon: Clock, color: 'text-violet-400', bg: 'bg-violet-500/10' },
  ];

  return (
    <div className="space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {!user && (
        <div className="relative overflow-hidden premium-card !bg-indigo-600 !border-none p-8 md:p-12 shadow-2xl shadow-indigo-500/10 rounded-[2.5rem]">
          <div className="absolute right-0 top-0 w-80 h-80 bg-white/10 rounded-full -mr-32 -mt-32 blur-[100px] animate-pulse" />
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="flex items-center gap-8 text-center md:text-left text-white">
              <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center shrink-0 border border-white/10 shadow-3xl">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-3xl md:text-5xl tracking-tighter uppercase leading-none">AuraSync <span className="text-indigo-200 italic font-premium lowercase tracking-tight">Premium</span></h4>
                <p className="text-sm md:text-lg text-indigo-100/70 mt-3 max-w-md font-bold uppercase tracking-widest opacity-80">Autonomous infrastructure for global scale.</p>
              </div>
            </div>
            <Link href="/register" className="w-full md:w-auto px-14 py-6 bg-white text-indigo-600 font-bold rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-3xl text-center uppercase tracking-[0.3em] text-xs">
              Initialize Protocol
            </Link>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-border pb-12">
        <div>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-[var(--text-main)] uppercase leading-[0.8]">
            Core <span className="font-premium text-indigo-500 italic lowercase tracking-tight">Intelligence</span>
          </h1>
          <p className="text-slate-500 mt-8 font-bold text-xs flex items-center gap-3 uppercase tracking-[0.3em] opacity-60">
            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
            Active Terminal: <span className="text-[var(--text-main)] italic">{business?.name || 'Authorized Partner'}</span>
          </p>
        </div>
        <div className="flex items-center gap-4 px-8 py-4 bg-indigo-500/[0.03] border border-indigo-500/10 rounded-full shadow-sm">
          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(99,102,241,0.6)]" />
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-indigo-500">System Monitoring</span>
        </div>
      </div>

      <div className="dashboard-grid">
        {cards.map((card) => (
          <div key={card.name} className="premium-card group hover:-translate-y-2 !p-10 transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/[0.01] rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-1000" />
            <div className="flex items-center justify-between mb-12 relative z-10">
              <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center transition-all group-hover:rotate-6 shadow-sm border border-indigo-500/10", card.bg)}>
                <card.icon className={cn("w-8 h-8", card.color)} />
              </div>
              <TrendingUp className="w-5 h-5 text-slate-300 dark:text-slate-800" />
            </div>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mb-3 opacity-60 relative z-10">{card.name}</p>
            <p className="text-4xl font-bold text-[var(--text-main)] tracking-tighter relative z-10">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="premium-card !p-0 overflow-hidden border-border/50">
        <div className="flex items-center justify-between p-8 border-b border-border bg-slate-50/50 dark:bg-white/[0.02]">
          <h3 className="text-xl font-bold text-[var(--text-main)] uppercase tracking-tight">Recent Activity</h3>
          <Link href="/appointments" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-indigo-500 hover:text-indigo-600 transition-all">
            View Analytics <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="p-4 space-y-2">
          {recentAppointments.length === 0 ? (
            <div className="py-14 text-center text-slate-400 font-bold text-sm uppercase tracking-widest opacity-60 italic">No activity detected</div>
          ) : (
            recentAppointments.map((apt: any) => (
              <div key={apt.id} className="flex items-center justify-between p-6 rounded-2xl hover:bg-indigo-500/[0.03] transition-all group">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-white dark:bg-white/10 rounded-xl flex items-center justify-center font-bold text-xs text-slate-400 border border-border shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    {apt.users?.name?.[0] || 'A'}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-[var(--text-main)] uppercase tracking-tight">{apt.users?.name || 'Client'}</p>
                    <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-widest opacity-70">{apt.services?.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-10">
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-bold text-[var(--text-main)] italic">{apt.appointment_time}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{apt.appointment_date}</p>
                  </div>
                  <div className={cn(
                    "px-5 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest shadow-sm min-w-[85px] text-center",
                    apt.status === 'confirmed' ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" :
                    apt.status === 'cancelled' ? "bg-rose-500/10 text-rose-500" : "bg-amber-500/10 text-amber-500"
                  )}>
                    {apt.status === 'confirmed' ? 'Verified' : apt.status === 'cancelled' ? 'Denied' : 'Awaiting'}
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
