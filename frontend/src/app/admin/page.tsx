"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import { Users, CreditCard, CheckCircle2, Search, RefreshCw, XCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function AdminPage() {
  const { isAdmin } = useAuth();
  const { t } = useLanguage();
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
      alert(`Success: ${email} renewed for ${days} days!`);
      loadBusinesses();
    }
  }

  async function updateBotToken(businessId: string, token: string) {
    const { error } = await supabase
      .from('businesses')
      .update({ bot_token: token })
      .eq('id', businessId);

    if (!error) {
      setBusinesses(prev => prev.map(b => b.id === businessId ? { ...b, bot_token: token } : b));
    }
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <XCircle className="w-16 h-16 text-rose-500" />
        <h2 className="text-2xl font-bold">{t.admin.access_denied}</h2>
        <p className="text-slate-500">{t.admin.access_denied_desc}</p>
      </div>
    );
  }

  const filteredBusinesses = businesses.filter(b => 
    b.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.owner_email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-12 py-10 px-4 animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-slate-100 dark:border-white/5 pb-10">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {t.admin.title}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-2">{t.admin.subtitle}</p>
        </div>
        <button 
          onClick={loadBusinesses} 
          className="w-12 h-12 flex items-center justify-center bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/10 transition-all text-slate-600 dark:text-slate-400 shadow-sm"
        >
          <RefreshCw className={cn("w-5 h-5", loading && "animate-spin")} />
        </button>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white dark:bg-white/[0.03] rounded-[2rem] border border-slate-200 dark:border-white/10 p-8 shadow-sm">
          <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-6">
            <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <p className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">{businesses.length}</p>
          <p className="text-sm font-semibold text-slate-500 mt-1 uppercase tracking-wider">{t.admin.stats_total}</p>
        </div>
        <div className="bg-white dark:bg-white/[0.03] rounded-[2rem] border border-slate-200 dark:border-white/10 p-8 shadow-sm">
          <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">{businesses.filter(b => b.subscription_status === 'active').length}</p>
          <p className="text-sm font-semibold text-slate-500 mt-1 uppercase tracking-wider">{t.admin.stats_active}</p>
        </div>
        <div className="bg-white dark:bg-white/[0.03] rounded-[2rem] border border-slate-200 dark:border-white/10 p-8 shadow-sm">
          <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center mb-6">
            <CreditCard className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <p className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">{businesses.filter(b => b.subscription_status === 'active').length * 1500} {t.common.currency}</p>
          <p className="text-sm font-semibold text-slate-500 mt-1 uppercase tracking-wider">{t.admin.stats_revenue}</p>
        </div>
      </div>

      {/* Поиск */}
      <div className="relative">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input 
          type="text" 
          placeholder={t.admin.search_ph}
          className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl pl-14 pr-6 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium text-sm text-slate-900 dark:text-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Таблица бизнесов */}
      <div className="bg-white dark:bg-white/5 rounded-[2rem] border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead className="bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/10">
              <tr className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                <th className="px-8 py-6">{t.admin.table_business}</th>
                <th className="px-8 py-6 text-center">{t.admin.table_status}</th>
                <th className="px-8 py-6">{t.admin.table_bot_token}</th>
                <th className="px-8 py-6 text-center">{t.admin.table_deadline}</th>
                <th className="px-8 py-6 text-right">{t.admin.table_actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {filteredBusinesses.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                  <td className="px-8 py-6">
                    <p className="font-bold text-slate-900 dark:text-white">{b.name}</p>
                    <p className="text-xs text-slate-500 font-medium mt-1">{b.owner_email}</p>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider inline-block min-w-[100px] text-center",
                      b.subscription_status === 'active' ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400" : "bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400"
                    )}>
                      {b.subscription_status === 'active' ? 'Active' : 'Trial'}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <input 
                      type="password" 
                      placeholder="Token..."
                      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500/50 font-mono"
                      value={b.bot_token || ''}
                      onChange={(e) => updateBotToken(b.id, e.target.value)}
                    />
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="flex flex-col items-center">
                      <p className="font-bold text-slate-900 dark:text-white text-sm">{new Date(b.trial_ends_at).toLocaleDateString()}</p>
                      <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-1">
                         {Math.ceil((new Date(b.trial_ends_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} {t.admin.days_remaining}
                      </p>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button 
                        onClick={() => updateSubscription(b.id, b.owner_email, 30)}
                        className="px-4 py-2 bg-indigo-600 text-white text-[10px] font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/10 uppercase tracking-widest"
                      >
                        {t.admin.btn_add_30}
                      </button>
                      <button 
                        onClick={() => updateSubscription(b.id, b.owner_email, 365)}
                        className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-bold rounded-xl hover:opacity-90 transition-all uppercase tracking-widest"
                      >
                        {t.admin.btn_add_year}
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
