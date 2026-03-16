"use client";
import React, { useState, useEffect } from 'react';
import { Search, Users as UsersIcon, ExternalLink, ChevronRight, Zap, Target } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import { cn } from '@/lib/utils';

export default function ClientsPage() {
  const { business } = useAuth();
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function loadClients() {
      if (!business?.id) {
        setClients([
          { id: '1', name: 'Александр Колесников', telegram_id: 12345678, visits_count: 5, last_visit: new Date().toISOString() },
          { id: '2', name: 'Мария Сидорова', telegram_id: 87654321, visits_count: 12, last_visit: new Date().toISOString() },
          { id: '3', name: 'Виктор Петров', telegram_id: 13572468, visits_count: 1, last_visit: new Date().toISOString() },
          { id: '4', name: 'Елена Маркова', telegram_id: 24681357, visits_count: 3, last_visit: new Date().toISOString() },
        ]);
        setLoading(false);
        return;
      }
      const { data, error } = await supabase.from('clients').select('*').eq('business_id', business.id).order('created_at', { ascending: false });
      if (!error && data) setClients(data);
      setLoading(false);
    }
    loadClients();
  }, [business]);

  const filtered = clients.filter(c => (c.name || '').toLowerCase().includes(search.toLowerCase()) || String(c.telegram_id).includes(search));

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-[var(--text-main)]">Ваша <span className="font-premium text-emerald-500 italic">Клиентура</span></h1>
          <p className="text-slate-500 mt-2 font-medium">Глубоко понимайте свою аудиторию и историю их визитов.</p>
        </div>
      </div>

      <div className="premium-card flex items-center gap-4 px-6 py-1 transition-all focus-within:ring-2 focus-within:ring-emerald-500/20">
        <Search className="w-5 h-5 text-slate-500" />
        <input type="text" placeholder="Поиск по имени или ID..." className="flex-1 bg-transparent py-4 focus:outline-none text-sm font-bold text-[var(--text-main)]" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="premium-card !p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-200/20 dark:bg-white/5">
                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Клиент</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Telegram ID</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Лояльность</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Визит</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">Связь</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {filtered.map(client => (
                <tr key={client.id} className="hover:bg-emerald-500/[0.02] dark:hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 dark:bg-white/10 rounded-xl flex items-center justify-center font-bold text-xs ring-2 ring-transparent group-hover:ring-emerald-500/20 transition-all text-[var(--text-main)]">{(client.name || 'U')[0]}</div>
                      <span className="font-bold text-sm text-[var(--text-main)]">{client.name || 'Без имени'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-xs text-slate-500 font-bold tracking-tight">{client.telegram_id}</td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                       <div className="w-16 h-1.5 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: `${Math.min(client.visits_count * 10, 100)}%` }} />
                       </div>
                       <span className="text-[10px] font-bold text-emerald-500">{client.visits_count}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-xs font-bold text-slate-500">{client.last_visit ? new Date(client.last_visit).toLocaleDateString('ru-RU') : '—'}</td>
                  <td className="px-6 py-5 text-right">
                    <a href={`https://t.me/${client.telegram_id}`} target="_blank" className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl hover:bg-emerald-500 hover:text-white transition-all inline-flex items-center shadow-sm">
                      <ExternalLink className="w-4 h-4" />
                    </a>
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
