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
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <DemoModal isOpen={showDemoModal} onClose={() => setShowDemoModal(false)} />
      
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">График <span className="font-premium text-emerald-500 italic">Записей</span></h1>
        <p className="text-slate-500 text-sm font-medium">Управляйте сессиями ваших клиентов в режиме реального времени.</p>
      </div>

      {/* Список для мобильных */}
      <div className="md:hidden space-y-4">
        {appointments.map((app) => (
          <div key={app.id} className="premium-card space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center font-bold text-emerald-500 text-xs">{app.users?.name?.[0]}</div>
                <div>
                  <p className="font-bold text-sm tracking-tight">{app.users?.name}</p>
                  <p className="text-[10px] text-slate-400">@{app.users?.username}</p>
                </div>
              </div>
              <span className={cn("px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider", 
                app.status === 'confirmed' ? "bg-emerald-500/10 text-emerald-500" : 
                app.status === 'cancelled' ? "bg-rose-500/10 text-rose-500" : "bg-amber-500/10 text-amber-500")}>
                {app.status === 'confirmed' ? 'Active' : app.status === 'cancelled' ? 'Denied' : 'Pending'}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-white/5">
              <div className="flex items-center gap-2">
                 <Tag className="w-3.5 h-3.5 text-slate-400" />
                 <span className="text-xs font-bold truncate">{app.services?.name}</span>
              </div>
              <div className="flex items-center gap-2 justify-end">
                 <span className="text-xs font-bold text-emerald-500">{app.services?.price} сом</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 pt-2">
               <div className="flex items-center gap-4 text-[11px] text-slate-500 font-medium">
                  <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{app.appointment_date}</div>
                  <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{app.appointment_time}</div>
               </div>
               <div className="flex gap-2">
                  <button onClick={() => updateStatus(app.id, 'confirmed')} className="p-2.5 bg-emerald-500 text-white rounded-xl active:scale-90 transition-all shadow-lg shadow-emerald-500/20"><CheckCircle className="w-4 h-4" /></button>
                  <button onClick={() => updateStatus(app.id, 'cancelled')} className="p-2.5 bg-rose-500 text-white rounded-xl active:scale-90 transition-all shadow-lg shadow-rose-500/20"><XCircle className="w-4 h-4" /></button>
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* Таблица для ПК */}
      <div className="hidden md:block premium-card !p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-white/5">
                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Клиент</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Услуга</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Дата / Время</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Стоимость</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Статус</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] text-right">Действие</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {appointments.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center font-bold text-emerald-500 text-xs ring-2 ring-transparent group-hover:ring-emerald-500/20 transition-all">{app.users?.name?.[0]}</div>
                      <div>
                        <p className="font-bold text-sm">{app.users?.name}</p>
                        <p className="text-[10px] text-slate-400">@{app.users?.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm font-bold">{app.services?.name}</td>
                  <td className="px-6 py-5">
                    <div className="text-sm font-bold">{app.appointment_date}</div>
                    <div className="text-[11px] text-slate-500 font-medium">{app.appointment_time}</div>
                  </td>
                  <td className="px-6 py-5 font-bold text-sm text-emerald-600 dark:text-emerald-400">{app.services?.price} сом</td>
                  <td className="px-6 py-5">
                    <span className={cn("px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider", app.status === 'confirmed' ? "bg-emerald-500/10 text-emerald-500" : app.status === 'cancelled' ? "bg-rose-500/10 text-rose-500" : "bg-amber-500/10 text-amber-500")}>{app.status === 'confirmed' ? 'Active' : app.status === 'cancelled' ? 'Denied' : 'Pending'}</span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex gap-2 justify-end">
                       <button onClick={() => updateStatus(app.id, 'confirmed')} className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-emerald-500/5 rounded-xl transition-all"><CheckCircle className="w-5 h-5" /></button>
                       <button onClick={() => updateStatus(app.id, 'cancelled')} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-500/5 rounded-xl transition-all"><XCircle className="w-5 h-5" /></button>
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
