"use client";
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, XCircle, MoreVertical, User, Tag } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import DemoModal from '@/components/DemoModal';
import { cn } from '@/lib/utils';

export default function AppointmentsPage() {
  const { business, user } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDemoModal, setShowDemoModal] = useState(false);

  useEffect(() => {
    async function fetchAppointments() {
      if (!business?.id) {
        setAppointments([
          { id: '1', appointment_date: '2024-03-20', appointment_time: '14:00', status: 'confirmed', services: { name: 'Стрижка', price: 800 }, users: { name: 'Алексей', username: 'alex99' } },
          { id: '2', appointment_date: '2024-03-21', appointment_time: '10:30', status: 'pending', services: { name: 'Маникюр', price: 1200 }, users: { name: 'Ольга', username: 'olga_nails' } },
          { id: '3', appointment_date: '2024-03-22', appointment_time: '12:00', status: 'cancelled', services: { name: 'Массаж', price: 2500 }, users: { name: 'Иван', username: 'vanya_test' } },
        ]);
        setLoading(false);
        return;
      }
      const { data, error } = await supabase.from('appointments').select('id, appointment_date, appointment_time, status, services (name, price), users (name, username)').eq('business_id', business.id).order('appointment_date', { ascending: false });
      if (!error && data) setAppointments(data);
      setLoading(false);
    }
    fetchAppointments();
  }, [business]);

  const updateStatus = async (id: string, status: string) => {
    if (!user) { setShowDemoModal(true); return; }
    const { error } = await supabase.from('appointments').update({ status }).eq('id', id);
    if (!error) setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  return (
    <div className="space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <DemoModal isOpen={showDemoModal} onClose={() => setShowDemoModal(false)} />
      
      <div className="flex flex-col gap-3 border-b border-border pb-8">
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase text-[var(--text-main)]">
          Schedule <span className="font-premium text-indigo-500 italic lowercase tracking-tight">Flow</span>
        </h1>
        <p className="text-slate-500 text-sm font-bold uppercase tracking-widest opacity-80">Управление сессиями ваших клиентов в режиме реального времени.</p>
      </div>

      {/* Список для мобильных */}
      <div className="md:hidden space-y-6">
        {appointments.map((app) => (
          <div key={app.id} className="premium-card space-y-6 border-indigo-500/5">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center font-black text-indigo-500 text-xs shadow-inner">
                  {app.users?.name?.[0]}
                </div>
                <div>
                  <p className="font-black text-sm uppercase tracking-tight text-[var(--text-main)]">{app.users?.name}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">@{app.users?.username}</p>
                </div>
              </div>
              <span className={cn("px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-sm", 
                app.status === 'confirmed' ? "bg-indigo-500 text-white" : 
                app.status === 'cancelled' ? "bg-rose-500/10 text-rose-500" : "bg-amber-500/10 text-amber-500")}>
                {app.status === 'confirmed' ? 'Active' : app.status === 'cancelled' ? 'Denied' : 'Pending'}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-100 dark:border-white/5">
              <div className="space-y-1">
                 <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Service</p>
                 <span className="text-xs font-bold truncate block text-[var(--text-main)]">{app.services?.name}</span>
              </div>
              <div className="space-y-1 text-right">
                 <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Investment</p>
                 <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 italic">{app.services?.price} сом</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
               <div className="flex items-center gap-4 text-[10px] text-slate-500 font-black uppercase tracking-widest">
                  <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-indigo-500" />{app.appointment_date}</div>
                  <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-indigo-500" />{app.appointment_time}</div>
               </div>
               <div className="flex gap-2">
                  <button onClick={() => updateStatus(app.id, 'confirmed')} className="p-3 bg-indigo-600 text-white rounded-xl active:scale-95 transition-all shadow-xl shadow-indigo-600/20"><CheckCircle className="w-4 h-4" /></button>
                  <button onClick={() => updateStatus(app.id, 'cancelled')} className="p-3 bg-rose-600 text-white rounded-xl active:scale-95 transition-all shadow-xl shadow-rose-600/20"><XCircle className="w-4 h-4" /></button>
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* Таблица для ПК */}
      <div className="hidden md:block premium-card !p-0 overflow-hidden border-border/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-white/5 border-b border-border">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Client Identity</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Service Type</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Date & Time</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Revenue</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Status</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {appointments.map((app) => (
                <tr key={app.id} className="hover:bg-indigo-500/[0.02] transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 bg-white dark:bg-white/10 border border-border rounded-xl flex items-center justify-center font-black text-slate-400 text-xs group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all shadow-sm">{app.users?.name?.[0]}</div>
                      <div>
                        <p className="font-black text-sm uppercase tracking-tight text-[var(--text-main)]">{app.users?.name}</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">@{app.users?.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm font-black uppercase tracking-tight text-[var(--text-main)]">{app.services?.name}</td>
                  <td className="px-8 py-6">
                    <div className="text-sm font-black text-[var(--text-main)] italic">{app.appointment_date}</div>
                    <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">{app.appointment_time}</div>
                  </td>
                  <td className="px-8 py-6 font-black text-sm text-indigo-600 italic">{app.services?.price} сом</td>
                  <td className="px-8 py-6">
                    <span className={cn(
                      "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] inline-block min-w-[90px] text-center shadow-sm", 
                      app.status === 'confirmed' ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" : 
                      app.status === 'cancelled' ? "bg-rose-500/10 text-rose-500" : "bg-amber-500/10 text-amber-500"
                    )}>
                      {app.status === 'confirmed' ? 'Active' : app.status === 'cancelled' ? 'Denied' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex gap-3 justify-end">
                       <button onClick={() => updateStatus(app.id, 'confirmed')} className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-500/5 rounded-2xl transition-all"><CheckCircle className="w-5 h-5" /></button>
                       <button onClick={() => updateStatus(app.id, 'cancelled')} className="p-3 text-slate-400 hover:text-rose-600 hover:bg-rose-500/5 rounded-2xl transition-all"><XCircle className="w-5 h-5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
