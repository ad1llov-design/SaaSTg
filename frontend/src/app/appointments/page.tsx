"use client";
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, XCircle, MoreVertical, User, Tag } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import { useLanguage } from '@/context/LanguageContext';
import DemoModal from '@/components/DemoModal';
import { cn } from '@/lib/utils';

export default function AppointmentsPage() {
  const { business, user } = useAuth();
  const { t } = useLanguage();
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
    <div className="space-y-8 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <DemoModal isOpen={showDemoModal} onClose={() => setShowDemoModal(false)} />
      
      <div className="flex flex-col gap-2 pb-6 border-b border-slate-200 dark:border-white/10">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
          {t.appointments.title}
        </h1>
        <p className="text-slate-500 text-sm">{t.appointments.subtitle}</p>
      </div>

      {/* Список для мобильных */}
      <div className="md:hidden space-y-6">
        {appointments.map((app) => (
          <div key={app.id} className="premium-card !p-6 space-y-6 border border-slate-100 dark:border-white/5 bg-white dark:bg-[#1a1c23]">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl flex items-center justify-center font-bold text-indigo-600 dark:text-indigo-400 text-sm shadow-sm border border-indigo-100 dark:border-indigo-500/10">
                  {app.users?.name?.[0]}
                </div>
                <div>
                  <p className="font-bold text-base text-slate-900 dark:text-white">{app.users?.name}</p>
                  <p className="text-xs text-slate-500 font-medium">@{app.users?.username}</p>
                </div>
              </div>
              <span className={cn("px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm", 
                app.status === 'confirmed' ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : 
                app.status === 'cancelled' ? "bg-rose-500/10 text-rose-600 dark:text-rose-400" : "bg-amber-500/10 text-amber-600 dark:text-amber-400")}>
                {app.status === 'confirmed' ? t.appointments.status_verified : app.status === 'cancelled' ? t.appointments.status_denied : t.appointments.status_awaiting}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-100 dark:border-white/5">
              <div className="space-y-1">
                 <p className="text-xs font-semibold text-slate-400">{t.common.services}</p>
                 <span className="text-sm font-bold text-slate-900 dark:text-white truncate block">{app.services?.name}</span>
              </div>
              <div className="space-y-1 text-right">
                 <p className="text-xs font-semibold text-slate-400">Стоимость</p>
                 <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{app.services?.price} {t.common.currency}</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
               <div className="flex flex-col gap-2 text-xs text-slate-500 font-medium">
                  <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-slate-400" />{app.appointment_date}</div>
                  <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-slate-400" />{app.appointment_time}</div>
               </div>
               <div className="flex gap-2">
                  <button onClick={() => updateStatus(app.id, 'confirmed')} className="w-10 h-10 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl active:scale-95 transition-all flex items-center justify-center hover:bg-emerald-100 dark:hover:bg-emerald-500/20"><CheckCircle className="w-5 h-5" /></button>
                  <button onClick={() => updateStatus(app.id, 'cancelled')} className="w-10 h-10 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-xl active:scale-95 transition-all flex items-center justify-center hover:bg-rose-100 dark:hover:bg-rose-500/20"><XCircle className="w-5 h-5" /></button>
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* Таблица для ПК */}
      <div className="hidden md:block premium-card !p-0 overflow-hidden bg-white dark:bg-[#1a1c23]">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/10">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">{t.common.clients}</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">{t.common.services}</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Дата / Время</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Стоимость</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Статус</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Управление</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {appointments.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl flex items-center justify-center font-bold text-slate-500 text-xs transition-colors shadow-sm">{app.users?.name?.[0]}</div>
                      <div>
                        <p className="font-bold text-sm text-slate-900 dark:text-white transition-colors group-hover:text-indigo-600">{app.users?.name}</p>
                        <p className="text-xs text-slate-500 font-medium">@{app.users?.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">{app.services?.name}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-slate-900 dark:text-white">{app.appointment_date}</div>
                    <div className="text-xs text-slate-500 font-medium mt-0.5">{app.appointment_time}</div>
                  </td>
                  <td className="px-6 py-4 font-bold text-sm text-slate-900 dark:text-white">{app.services?.price} {t.common.currency}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider inline-block min-w-[100px] text-center shadow-sm", 
                      app.status === 'confirmed' ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : 
                      app.status === 'cancelled' ? "bg-rose-500/10 text-rose-600 dark:text-rose-400" : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                    )}>
                      {app.status === 'confirmed' ? t.appointments.status_verified : app.status === 'cancelled' ? t.appointments.status_denied : t.appointments.status_awaiting}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex gap-2 justify-end">
                       <button onClick={() => updateStatus(app.id, 'confirmed')} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg transition-all"><CheckCircle className="w-4 h-4" /></button>
                       <button onClick={() => updateStatus(app.id, 'cancelled')} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-all"><XCircle className="w-4 h-4" /></button>
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
