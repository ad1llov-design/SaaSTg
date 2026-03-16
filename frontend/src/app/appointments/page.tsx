"use client";
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, XCircle, Filter, Search, ChevronRight } from 'lucide-react';
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
    <div className="space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <DemoModal isOpen={showDemoModal} onClose={() => setShowDemoModal(false)} />
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">График <span className="font-premium text-emerald-500 italic">Записей</span></h1>
          <p className="text-slate-500 mt-2 font-medium">Управляйте своим временем и сессиями клиентов.</p>
        </div>
      </div>

      <div className="premium-card overflow-hidden !p-0">
        <div className="overflow-x-auto overflow-y-visible">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-500/5">
                <th className="px-6 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Клиент</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Услуга</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Дата и Время</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Стоимость</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Статус</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-500/10">
              {appointments.map((app) => (
                <tr key={app.id} className="hover:bg-slate-500/5 transition-all group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center font-bold text-xs ring-2 ring-transparent group-hover:ring-emerald-500/20 transition-all">{app.users?.name?.[0]}</div>
                      <div>
                        <p className="font-bold text-sm">{app.users?.name}</p>
                        <p className="text-[11px] text-slate-500 font-medium">@{app.users?.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm font-medium">{app.services?.name}</td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-sm font-bold"><Calendar className="w-3.5 h-3.5 text-emerald-500" />{app.appointment_date}</div>
                    <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5 font-medium"><Clock className="w-3 h-3"/>{app.appointment_time}</div>
                  </td>
                  <td className="px-6 py-5 font-bold text-sm text-emerald-500">{app.services?.price} сом</td>
                  <td className="px-6 py-5">
                    <span className={cn("px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider", app.status === 'confirmed' ? "bg-emerald-500/10 text-emerald-500" : app.status === 'cancelled' ? "bg-rose-500/10 text-rose-500" : "bg-amber-500/10 text-amber-500")}>{app.status === 'confirmed' ? 'Active' : app.status === 'cancelled' ? 'Denied' : 'Pending'}</span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex gap-2">
                       <button onClick={() => updateStatus(app.id, 'confirmed')} className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl hover:bg-emerald-500/20 active:scale-90 transition-all"><CheckCircle className="w-4 h-4" /></button>
                       <button onClick={() => updateStatus(app.id, 'cancelled')} className="p-2 bg-rose-500/10 text-rose-500 rounded-xl hover:bg-rose-500/20 active:scale-90 transition-all"><XCircle className="w-4 h-4" /></button>
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
