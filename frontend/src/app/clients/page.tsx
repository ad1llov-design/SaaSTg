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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border pb-8">
        <div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase text-[var(--text-main)]">
            Audience <span className="font-premium text-indigo-500 italic lowercase tracking-tight">Database</span>
          </h1>
          <p className="text-slate-500 mt-2 font-bold text-sm uppercase tracking-widest opacity-80">Глубоко понимайте свою аудиторию и историю их визитов.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="premium-card flex-1 flex items-center gap-5 px-8 pt-2 transition-all border-none shadow-xl bg-input/50 focus-within:ring-2 focus-within:ring-indigo-500/20">
          <Search className="w-6 h-6 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by Identity or Digital ID..." 
            className="flex-1 bg-transparent py-6 focus:outline-none text-sm font-black uppercase tracking-tight text-[var(--text-main)] placeholder:text-slate-400 placeholder:font-bold" 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
          />
        </div>
      </div>

      <div className="premium-card !p-0 overflow-hidden border-border/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead className="bg-slate-50 dark:bg-white/5 border-b border-border">
              <tr>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Client Identity</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Digital ID (TG)</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Retention / Loyalty</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Recent Interaction</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] text-right">Direct Protocol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filtered.map(client => (
                <tr key={client.id} className="hover:bg-indigo-500/[0.02] transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 bg-white dark:bg-white/10 border border-border rounded-xl flex items-center justify-center font-black text-slate-400 text-xs group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all shadow-sm">
                        {(client.name || 'U')[0]}
                      </div>
                      <span className="font-black text-sm uppercase tracking-tight text-[var(--text-main)]">{client.name || 'Anonymous User'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-[11px] text-slate-400 font-bold tracking-widest">#{client.telegram_id}</td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                       <div className="w-24 h-2 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden shadow-inner">
                          <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 shadow-[0_0_15px_rgba(99,102,241,0.4)]" style={{ width: `${Math.min(client.visits_count * 10, 100)}%` }} />
                       </div>
                       <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{client.visits_count} Hits</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-[11px] font-black text-slate-500 italic">
                    {client.last_visit ? new Date(client.last_visit).toLocaleDateString('ru-RU') : 'Pending Interaction'}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <a href={`https://t.me/${client.telegram_id}`} target="_blank" className="p-3.5 bg-indigo-500/5 text-indigo-500 border border-indigo-500/10 rounded-xl hover:bg-indigo-600 hover:text-white transition-all inline-flex items-center shadow-sm hover:shadow-indigo-500/20">
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
