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
    <div className="space-y-10 py-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border pb-8">
        <div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase text-[var(--text-main)]">
            Control <span className="font-premium text-indigo-500 italic lowercase tracking-tight">Center</span>
          </h1>
          <p className="text-slate-500 mt-2 font-bold text-sm">Централизованное управление операционной деятельностью SaaS.</p>
        </div>
        <button onClick={loadBusinesses} className="p-5 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl hover:bg-indigo-500/10 transition-all text-indigo-500 shadow-sm">
          <RefreshCw className={cn("w-6 h-6", loading && "animate-spin")} />
        </button>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="premium-card bg-indigo-500/5 border-indigo-500/20">
          <Users className="w-8 h-8 text-indigo-500 mb-4" />
          <p className="text-4xl font-black tracking-tighter">{businesses.length}</p>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">Active Entities</p>
        </div>
        <div className="premium-card bg-violet-500/5 border-violet-500/20">
          <CheckCircle2 className="w-8 h-8 text-violet-500 mb-4" />
          <p className="text-4xl font-black tracking-tighter">{businesses.filter(b => b.subscription_status === 'active').length}</p>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">Active Subscriptions</p>
        </div>
        <div className="premium-card bg-amber-500/5 border-amber-500/20">
          <CreditCard className="w-8 h-8 text-amber-500 mb-4" />
          <p className="text-4xl font-black tracking-tighter">${businesses.filter(b => b.subscription_status === 'active').length * 15}</p>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">Estimated MRR</p>
        </div>
      </div>

      {/* Поиск */}
      <div className="relative group">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
        <input 
          type="text" 
          placeholder="Фильтр по названию или email бизнес-аккаунта..."
          className="w-full bg-input border-2 border-transparent focus:border-indigo-500/50 rounded-[2rem] pl-16 pr-8 py-6 focus:outline-none transition-all font-bold text-sm shadow-xl"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Таблица бизнесов */}
      <div className="premium-card !p-0 overflow-hidden border-border/50">
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-white/5 border-b border-border">
            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
              <th className="px-8 py-5">Organization / Identity</th>
              <th className="px-8 py-5 text-center">Status</th>
              <th className="px-8 py-5 text-center">Renewal Date</th>
              <th className="px-8 py-5 text-right">Administrative Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {filteredBusinesses.map((b) => (
              <tr key={b.id} className="hover:bg-indigo-500/[0.02] transition-colors group">
                <td className="px-8 py-6">
                  <p className="font-black text-sm uppercase tracking-tight text-[var(--text-main)]">{b.name}</p>
                  <p className="text-xs text-slate-400 font-bold">{b.owner_email}</p>
                </td>
                <td className="px-8 py-6 text-center">
                  <span className={cn(
                    "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] inline-block min-w-[100px]",
                    b.subscription_status === 'active' ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20" : "bg-amber-500/10 text-amber-500"
                  )}>
                    {b.subscription_status || 'Trialing'}
                  </span>
                </td>
                <td className="px-8 py-6 text-center">
                  <div className="inline-flex flex-col items-center">
                    <p className="text-xs font-black text-[var(--text-main)] italic">{new Date(b.trial_ends_at).toLocaleDateString()}</p>
                    <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mt-1">
                       {Math.ceil((new Date(b.trial_ends_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} Days Left
                    </p>
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <button 
                      onClick={() => updateSubscription(b.id, b.owner_email, 30)}
                      className="px-5 py-2.5 bg-indigo-600 text-white text-[10px] font-black rounded-xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 uppercase tracking-widest"
                    >
                      +30 D
                    </button>
                    <button 
                      onClick={() => updateSubscription(b.id, b.owner_email, 365)}
                      className="px-5 py-2.5 bg-violet-600 text-white text-[10px] font-black rounded-xl hover:bg-violet-700 transition-all shadow-xl shadow-violet-600/20 uppercase tracking-widest"
                    >
                      +Year
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
