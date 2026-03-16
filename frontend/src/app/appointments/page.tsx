"use client";
import React, { useState, useEffect } from 'react';
import { Calendar, User, Clock, CheckCircle, XCircle, MoreVertical, Filter } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAppointments() {
       // Join with services and users
       const { data, error } = await supabase
        .from('appointments')
        .select(`
          id,
          appointment_date,
          appointment_time,
          status,
          services (name),
          users (name, username)
        `)
        .order('appointment_date', { ascending: false });
      
      if (!error && data) setAppointments(data);
      setLoading(false);
    }
    fetchAppointments();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
        case 'confirmed': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
        case 'cancelled': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
        case 'completed': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
        default: return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Записи на прием</h2>
          <p className="text-slate-400 mt-1">Управляйте всеми сессиями ваших клиентов в одном месте.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all border border-slate-700">
          <Filter className="w-4 h-4" />
          Фильтр
        </button>
      </div>

      <div className="glass rounded-3xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/50">
                <th className="px-6 py-4 text-sm font-semibold text-slate-400">Клиент</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-400">Услуга</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-400">Дата и время</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-400">Статус</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-400">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-400">Загрузка записей...</td></tr>
              ) : appointments.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-400">Записей пока нет.</td></tr>
              ) : appointments.map((app) => (
                <tr key={app.id} className="hover:bg-slate-800/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center text-xs font-bold">
                        {app.users?.name?.[0] || 'U'}
                      </div>
                      <div>
                        <p className="font-medium text-slate-200">{app.users?.name || 'Неизвестно'}</p>
                        <p className="text-xs text-slate-500">@{app.users?.username || 'пользователь'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-300">
                    {app.services?.name}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <Calendar className="w-3 h-3 text-emerald-500" />
                        {app.appointment_date}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {app.appointment_time}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                        "px-3 py-1 rounded-full text-xs font-bold border",
                        getStatusColor(app.status)
                    )}>
                      {getTranslatedStatus(app.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                        <button className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg hover:bg-emerald-500/20 transition-colors">
                            <CheckCircle className="w-4 h-4" />
                        </button>
                        <button className="p-2 bg-rose-500/10 text-rose-500 rounded-lg hover:bg-rose-500/20 transition-colors">
                            <XCircle className="w-4 h-4" />
                        </button>
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
