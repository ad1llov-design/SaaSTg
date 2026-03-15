"use client";
import React, { useState, useEffect } from 'react';
import { Users, Search, Mail, Phone, ExternalLink } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchClients() {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('last_visit', { ascending: false });
      
      if (!error && data) setClients(data);
      setLoading(false);
    }
    fetchClients();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold">Клиенты</h2>
        <p className="text-slate-400 mt-1">Список всех пользователей, которые взаимодействовали с вашим ботом.</p>
      </div>

      <div className="glass rounded-3xl border border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex items-center gap-4">
            <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                    type="text" 
                    placeholder="Поиск клиентов..." 
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-11 pr-4 py-2 focus:outline-none focus:border-emerald-500 transition-colors"
                />
            </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/50">
                <th className="px-6 py-4 text-sm font-semibold text-slate-400">Имя</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-400">Telegram ID</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-400">Визитов</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-400">Последний визит</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-400">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-400">Загрузка клиентов...</td></tr>
              ) : clients.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center space-y-3">
                        <Users className="w-12 h-12 text-slate-700 mx-auto" />
                        <p className="text-slate-400">Клиентов пока нет. Они появятся, когда кто-то напишет боту.</p>
                    </td>
                  </tr>
              ) : clients.map((client) => (
                <tr key={client.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center font-bold">
                        {client.name?.[0] || 'U'}
                      </div>
                      <p className="font-semibold">{client.name || 'Пользователь'}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400 font-mono">
                    {client.telegram_id}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-slate-800 rounded-full text-xs font-bold">
                        {client.visits_count} визитов
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400">
                    {client.last_visit ? new Date(client.last_visit).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-6 py-4">
                    <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white">
                        <ExternalLink className="w-4 h-4" />
                    </button>
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
