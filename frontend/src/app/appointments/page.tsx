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
      
      <div className="flex flex-col gap-4 border-b border-border pb-10">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter uppercase text-[var(--text-main)]">
          Schedule <span className="font-premium text-indigo-500 italic lowercase tracking-tight">Protocol</span>
        </h1>
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.4em] opacity-60 italic">Real-time session management for business nodes.</p>
      </div>

      {/* Список для мобильных */}
      <div className="md:hidden space-y-8">
        {appointments.map((app) => (
          <div key={app.id} className="premium-card !p-8 space-y-8 border-indigo-500/10 hover:border-indigo-500/30 transition-all">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center font-bold text-indigo-500 text-xs shadow-inner border border-indigo-500/10">
                  {app.users?.name?.[0]}
                </div>
                <div>
                  <p className="font-bold text-sm uppercase tracking-tight text-[var(--text-main)]">{app.users?.name}</p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-1 opacity-70">@{app.users?.username}</p>
                </div>
              </div>
              <span className={cn("px-5 py-2 rounded-xl text-[9px] font-bold uppercase tracking-[0.2em] shadow-sm", 
                app.status === 'confirmed' ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" : 
                app.status === 'cancelled' ? "bg-rose-500/10 text-rose-500" : "bg-amber-500/10 text-amber-500")}>
                {app.status === 'confirmed' ? 'Verified' : app.status === 'cancelled' ? 'Denied' : 'Pending'}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-6 py-6 border-y border-slate-100 dark:border-white/5">
              <div className="space-y-2">
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] opacity-60">Identity / Service</p>
                 <span className="text-xs font-bold truncate block text-[var(--text-main)] uppercase tracking-tight">{app.services?.name}</span>
              </div>
              <div className="space-y-2 text-right">
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] opacity-60">Value Exchange</p>
                 <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 italic tracking-tighter">{app.services?.price} сом</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-6">
               <div className="flex flex-col gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">
                  <div className="flex items-center gap-3"><Calendar className="w-4 h-4 text-indigo-500 opacity-70" />{app.appointment_date}</div>
                  <div className="flex items-center gap-3"><Clock className="w-4 h-4 text-indigo-500 opacity-70" />{app.appointment_time}</div>
               </div>
               <div className="flex gap-3">
                  <button onClick={() => updateStatus(app.id, 'confirmed')} className="w-12 h-12 bg-indigo-600 text-white rounded-2xl active:scale-95 transition-all shadow-2xl shadow-indigo-600/20 flex items-center justify-center hover:bg-indigo-700"><CheckCircle className="w-5 h-5" /></button>
                  <button onClick={() => updateStatus(app.id, 'cancelled')} className="w-12 h-12 bg-rose-600 text-white rounded-2xl active:scale-95 transition-all shadow-2xl shadow-rose-600/20 flex items-center justify-center hover:bg-rose-700"><XCircle className="w-5 h-5" /></button>
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
                <th className="px-10 py-8 text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Client Identity</th>
                <th className="px-10 py-8 text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Service Type</th>
                <th className="px-10 py-8 text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Temporal Slot</th>
                <th className="px-10 py-8 text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Yield</th>
                <th className="px-10 py-8 text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Protocol State</th>
                <th className="px-10 py-8 text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] text-right">Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {appointments.map((app) => (
                <tr key={app.id} className="hover:bg-indigo-500/[0.02] transition-colors group">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-white dark:bg-white/10 border border-border rounded-xl flex items-center justify-center font-bold text-slate-400 text-xs group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all shadow-sm">{app.users?.name?.[0]}</div>
                      <div>
                        <p className="font-bold text-sm uppercase tracking-tight text-[var(--text-main)] transition-colors group-hover:text-indigo-600">{app.users?.name}</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.25em] mt-1 italic opacity-60">@{app.users?.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-sm font-bold uppercase tracking-tight text-[var(--text-main)]">{app.services?.name}</td>
                  <td className="px-10 py-8">
                    <div className="text-sm font-bold text-[var(--text-main)] italic tracking-tight">{app.appointment_date}</div>
                    <div className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-1 opacity-70">{app.appointment_time}</div>
                  </td>
                  <td className="px-10 py-8 font-bold text-sm text-indigo-600 italic tracking-tighter">{app.services?.price} сом</td>
                  <td className="px-10 py-8">
                    <span className={cn(
                      "px-5 py-2.5 rounded-xl text-[9px] font-bold uppercase tracking-[0.3em] inline-block min-w-[100px] text-center shadow-sm", 
                      app.status === 'confirmed' ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/20" : 
                      app.status === 'cancelled' ? "bg-rose-500/10 text-rose-500" : "bg-amber-500/10 text-amber-500"
                    )}>
                      {app.status === 'confirmed' ? 'Verified' : app.status === 'cancelled' ? 'Denied' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex gap-4 justify-end">
                       <button onClick={() => updateStatus(app.id, 'confirmed')} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-500/10 rounded-xl transition-all"><CheckCircle className="w-5 h-5" /></button>
                       <button onClick={() => updateStatus(app.id, 'cancelled')} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-500/10 rounded-xl transition-all"><XCircle className="w-5 h-5" /></button>
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
