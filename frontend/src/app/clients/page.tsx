"use client";
import React, { useState, useEffect } from 'react';
import { Search, Users as UsersIcon, ExternalLink } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';

export default function ClientsPage() {
  const { business } = useAuth();
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!business?.id) return;
    async function loadClients() {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('business_id', business.id)
        .order('created_at', { ascending: false });
      if (!error && data) setClients(data);
      setLoading(false);
    }
    loadClients();
  }, [business]);

  const filtered = clients.filter(c => 
    (c.name || '').toLowerCase().includes(search.toLowerCase()) ||
    String(c.telegram_id).includes(search)
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold">Клиенты</h2>
        <p className="text-slate-400 mt-1">Список всех пользователей, которые взаимодействовали с вашим ботом.</p>
      </div>

      {/* Поиск */}
      <div className="glass rounded-xl border border-slate-800 flex items-center gap-3 px-4 py-3">
        <Search className="w-5 h-5 text-slate-500" />
        <input 
          type="text"
          placeholder="Поиск клиентов..."
          className="flex-1 bg-transparent focus:outline-none text-sm"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Таблица */}
      <div className="glass rounded-2xl border border-slate-800 overflow-hidden">
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
              <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">Загрузка...</td></tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                  <UsersIcon className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p>Клиентов пока нет. Они появятся, когда кто-то напишет боту.</p>
                </td>
              </tr>
            ) : filtered.map(client => (
              <tr key={client.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-slate-800 rounded-full flex items-center justify-center font-bold text-xs">
                      {(client.name || 'U')[0]}
                    </div>
                    <span className="font-medium">{client.name || 'Без имени'}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-400 font-mono">{client.telegram_id}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg text-xs font-bold">
                    {client.visits_count || 0}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-400">
                  {client.last_visit ? new Date(client.last_visit).toLocaleDateString('ru-RU') : '—'}
                </td>
                <td className="px-6 py-4">
                  <a 
                    href={`https://t.me/${client.telegram_id}`} 
                    target="_blank"
                    className="p-2 hover:bg-slate-800 rounded-lg transition-colors inline-block text-slate-400 hover:text-emerald-400"
                    title="Открыть в Telegram"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
