"use client";
import React, { useState, useEffect } from 'react';
import { Search, Users as UsersIcon, ExternalLink, ChevronRight, Zap, Target } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';

export default function ClientsPage() {
  const { business } = useAuth();
  const { t, locale } = useLanguage();
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
    <div className="space-y-8 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-slate-200 dark:border-white/10">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t.clients.title}
          </h1>
          <p className="text-slate-500 mt-2 text-sm">{t.clients.subtitle}</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="premium-card flex-1 flex items-center gap-4 px-6 !py-1 transition-all border-slate-200 dark:border-white/10 shadow-sm bg-white dark:bg-white/5 focus-within:ring-2 focus-within:ring-indigo-500/20">
          <Search className="w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder={t.common.search_placeholder || "Поиск по имени или ID..."} 
            className="flex-1 bg-transparent py-4 focus:outline-none text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400" 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
          />
        </div>
      </div>

      <div className="premium-card !p-0 overflow-hidden bg-white dark:bg-[#1a1c23]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/10">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">{t.common.clients}</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Telegram ID</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">{t.clients.table_visits}</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">{t.clients.table_last_visit}</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">{t.clients.table_contact}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {filtered.map(client => (
                <tr key={client.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl flex items-center justify-center font-bold text-slate-500 text-xs transition-colors shadow-sm">
                        {(client.name || 'U')[0]}
                      </div>
                      <span className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">{client.name || 'Anonymous User'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 font-medium tracking-wide">#{client.telegram_id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                       <span className="text-sm font-semibold text-slate-900 dark:text-white">{client.visits_count}</span>
                       <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex items-center">
                          <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${Math.min(client.visits_count * 10, 100)}%` }} />
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-500">
                    {client.last_visit ? new Date(client.last_visit).toLocaleDateString(locale === 'ru' ? 'ru-RU' : locale === 'en' ? 'en-US' : 'ru-RU') : t.clients.no_visits}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <a href={`https://t.me/${client.telegram_id}`} target="_blank" className="w-10 h-10 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-all inline-flex items-center justify-center shadow-sm">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                   <td colSpan={5} className="py-12 text-center text-slate-400 font-medium">{t.clients.no_clients}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
