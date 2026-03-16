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
    <div className="space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-border pb-10">
        <div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter uppercase text-[var(--text-main)] leading-none">
            Audience <span className="font-premium text-indigo-500 italic lowercase tracking-tight">Intelligence</span>
          </h1>
          <p className="text-slate-500 mt-6 font-bold text-xs uppercase tracking-[0.3em] opacity-60 italic">Mapping behavioral artifacts and interaction cycles.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="premium-card flex-1 flex items-center gap-6 px-10 !py-2 transition-all border-none shadow-2xl bg-input/40 focus-within:ring-2 focus-within:ring-indigo-500/20 backdrop-blur-sm">
          <Search className="w-7 h-7 text-slate-400 opacity-50" />
          <input 
            type="text" 
            placeholder="Search by Identity or Digital ID..." 
            className="flex-1 bg-transparent py-7 focus:outline-none text-[15px] font-bold uppercase tracking-tight text-[var(--text-main)] placeholder:text-slate-400 placeholder:opacity-50" 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
          />
        </div>
      </div>

      <div className="premium-card !p-0 overflow-hidden border-border/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-slate-50 dark:bg-white/5 border-b border-border">
              <tr>
                <th className="px-10 py-8 text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Client Identity</th>
                <th className="px-10 py-8 text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Digital ID (TG)</th>
                <th className="px-10 py-8 text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Retention Logic</th>
                <th className="px-10 py-8 text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Temporal Delta</th>
                <th className="px-10 py-8 text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] text-right">Direct Protocol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filtered.map(client => (
                <tr key={client.id} className="hover:bg-indigo-500/[0.02] transition-colors group">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-white dark:bg-white/10 border border-border rounded-xl flex items-center justify-center font-bold text-slate-400 text-xs group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all shadow-sm">
                        {(client.name || 'U')[0]}
                      </div>
                      <span className="font-bold text-[15px] uppercase tracking-tight text-[var(--text-main)] group-hover:text-indigo-600 transition-colors">{client.name || 'Anonymous User'}</span>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-[12px] text-slate-400 font-bold tracking-[0.1em] italic opacity-70">#{client.telegram_id}</td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-5">
                       <div className="w-32 h-1.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden shadow-inner flex items-center">
                          <div className="h-full bg-indigo-500 opacity-60 rounded-full" style={{ width: `${Math.min(client.visits_count * 10, 100)}%` }} />
                       </div>
                       <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">{client.visits_count} Elements</span>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-[11px] font-bold text-slate-500 italic tracking-tight">
                    {client.last_visit ? new Date(client.last_visit).toLocaleDateString('ru-RU') : 'No Recent Cycles'}
                  </td>
                  <td className="px-10 py-8 text-right">
                    <a href={`https://t.me/${client.telegram_id}`} target="_blank" className="w-12 h-12 bg-indigo-500/5 text-indigo-500 border border-indigo-500/10 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all inline-flex items-center justify-center shadow-sm hover:shadow-indigo-500/30 group-hover:rotate-12">
                      <ExternalLink className="w-5 h-5" />
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
