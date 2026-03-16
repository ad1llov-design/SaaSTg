"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import { Users, CreditCard, Calendar, CheckCircle2, Clock, XCircle, Search, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminPage() {
  const { isAdmin } = useAuth();
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isAdmin) loadBusinesses();
  }, [isAdmin]);

  async function loadBusinesses() {
    setLoading(true);
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error) setBusinesses(data || []);
    setLoading(false);
  }

  async function updateSubscription(businessId: string, email: string, days: number) {
    const trialEnds = new Date();
    trialEnds.setDate(trialEnds.getDate() + days);

    const { error } = await supabase
      .from('businesses')
      .update({ 
        subscription_status: 'active',
        trial_ends_at: trialEnds.toISOString()
      })
      .eq('id', businessId);

    if (!error) {
      alert(`Подписка для ${email} успешно продлена на ${days} дней!`);
      loadBusinesses();
    }
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <XCircle className="w-16 h-16 text-rose-500" />
        <h2 className="text-2xl font-bold">Доступ запрещен</h2>
        <p className="text-slate-500">У вас нет прав для просмотра этой страницы.</p>
      </div>
    );
  }

  const filteredBusinesses = businesses.filter(b => 
    b.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.owner_email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-12 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-border pb-10">
        <div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter uppercase text-[var(--text-main)] leading-none">
            Control <span className="font-premium text-indigo-500 italic lowercase tracking-tight">Terminal</span>
          </h1>
          <p className="text-slate-500 mt-6 font-bold text-xs uppercase tracking-[0.3em] opacity-60 italic">Centralized node management for global SaaS infrastructure.</p>
        </div>
        <button onClick={loadBusinesses} className="w-16 h-16 flex items-center justify-center bg-indigo-500/5 border border-indigo-500/10 rounded-2xl hover:bg-indigo-500/10 transition-all text-indigo-500 shadow-sm active:rotate-180">
          <RefreshCw className={cn("w-7 h-7", loading && "animate-spin")} />
        </button>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="premium-card !p-10 bg-indigo-500/[0.03] border-indigo-500/10 hover:border-indigo-500/30 transition-all duration-500">
          <Users className="w-10 h-10 text-indigo-500 mb-8 opacity-70" />
          <p className="text-5xl font-bold tracking-tighter italic">{businesses.length}</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-3 opacity-60">Global Entities</p>
        </div>
        <div className="premium-card !p-10 bg-violet-500/[0.03] border-violet-500/10 hover:border-violet-500/30 transition-all duration-500">
          <CheckCircle2 className="w-10 h-10 text-violet-500 mb-8 opacity-70" />
          <p className="text-5xl font-bold tracking-tighter italic">{businesses.filter(b => b.subscription_status === 'active').length}</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-3 opacity-60">Verified Node Subscriptions</p>
        </div>
        <div className="premium-card !p-10 bg-indigo-500/[0.03] border-indigo-500/10 hover:border-indigo-500/30 transition-all duration-500">
          <CreditCard className="w-10 h-10 text-indigo-500 mb-8 opacity-70" />
          <p className="text-5xl font-bold tracking-tighter italic">${businesses.filter(b => b.subscription_status === 'active').length * 15}</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-3 opacity-60">Projected MRR Artifact</p>
        </div>
      </div>

      {/* Поиск */}
      <div className="relative group">
        <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-7 h-7 text-slate-400 group-focus-within:text-indigo-500 transition-all duration-300 opacity-40 group-focus-within:opacity-100" />
        <input 
          type="text" 
          placeholder="Filter by organizational identity or credentials..."
          className="w-full bg-input/40 border-2 border-transparent focus:border-indigo-500/30 rounded-[2.5rem] pl-20 pr-10 py-7 focus:outline-none transition-all font-bold text-[15px] shadow-2xl backdrop-blur-sm placeholder:text-slate-400 placeholder:opacity-40"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Таблица бизнесов */}
      <div className="premium-card !p-0 overflow-hidden border-border/50 shadow-3xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[900px]">
            <thead className="bg-slate-50 dark:bg-white/5 border-b border-border">
              <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
                <th className="px-10 py-8">Cluster Organization / Identity</th>
                <th className="px-10 py-8 text-center">Protocol State</th>
                <th className="px-10 py-8 text-center">Temporal Delta</th>
                <th className="px-10 py-8 text-right">Administrative Protocol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredBusinesses.map((b) => (
                <tr key={b.id} className="hover:bg-indigo-500/[0.02] transition-colors group">
                  <td className="px-10 py-8">
                    <p className="font-bold text-[15px] uppercase tracking-tight text-[var(--text-main)] group-hover:text-indigo-600 transition-colors">{b.name}</p>
                    <p className="text-[11px] text-slate-400 font-bold opacity-60 mt-1 uppercase tracking-widest">{b.owner_email}</p>
                  </td>
                  <td className="px-10 py-8 text-center">
                    <span className={cn(
                      "px-5 py-2.5 rounded-xl text-[9px] font-bold uppercase tracking-[0.3em] inline-block min-w-[120px] text-center shadow-lg transition-all",
                      b.subscription_status === 'active' ? "bg-indigo-600 text-white shadow-indigo-600/20" : "bg-amber-500/10 text-amber-500"
                    )}>
                      {b.subscription_status === 'active' ? 'Enterprise' : 'Initial Trial'}
                    </span>
                  </td>
                  <td className="px-10 py-8 text-center">
                    <div className="inline-flex flex-col items-center">
                      <p className="text-[13px] font-bold text-[var(--text-main)] italic tracking-tight">{new Date(b.trial_ends_at).toLocaleDateString()}</p>
                      <p className="text-[9px] text-slate-400 uppercase font-bold tracking-[0.3em] mt-1.5 opacity-60 italic">
                         {Math.ceil((new Date(b.trial_ends_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} Days Remaining
                      </p>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex items-center justify-end gap-4">
                      <button 
                        onClick={() => updateSubscription(b.id, b.owner_email, 30)}
                        className="px-6 py-3 bg-indigo-600 text-white text-[10px] font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 uppercase tracking-[0.3em] hover:-translate-y-1 active:scale-95"
                      >
                        +30 D
                      </button>
                      <button 
                        onClick={() => updateSubscription(b.id, b.owner_email, 365)}
                        className="px-6 py-3 bg-violet-600 text-white text-[10px] font-bold rounded-xl hover:bg-violet-700 transition-all shadow-xl shadow-violet-600/20 uppercase tracking-[0.3em] hover:-translate-y-1 active:scale-95"
                      >
                        +Annual
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

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
