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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight uppercase">Control <span className="text-amber-500 italic font-premium">Center</span></h1>
          <p className="text-slate-500 font-medium">Управление всеми бизнесами на платформе AuraSync.</p>
        </div>
        <button onClick={loadBusinesses} className="p-4 bg-slate-100 dark:bg-white/5 rounded-2xl hover:bg-slate-200 transition-all">
          <RefreshCw className={cn("w-6 h-6", loading && "animate-spin")} />
        </button>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="premium-card bg-amber-500/5 border-amber-500/20">
          <Users className="w-6 h-6 text-amber-500 mb-2" />
          <p className="text-2xl font-black">{businesses.length}</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Всего бизнесов</p>
        </div>
        <div className="premium-card bg-emerald-500/5 border-emerald-500/20">
          <CheckCircle2 className="w-6 h-6 text-emerald-500 mb-2" />
          <p className="text-2xl font-black">{businesses.filter(b => b.subscription_status === 'active').length}</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Активные подписки</p>
        </div>
        <div className="premium-card bg-blue-500/5 border-blue-500/20">
          <CreditCard className="w-6 h-6 text-blue-500 mb-2" />
          <p className="text-2xl font-black">${businesses.filter(b => b.subscription_status === 'active').length * 15}</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Примерная выручка/мес</p>
        </div>
      </div>

      {/* Поиск */}
      <div className="relative group">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
        <input 
          type="text" 
          placeholder="Поиск по названию или email..."
          className="w-full bg-input border border-transparent focus:border-amber-500/50 rounded-[2rem] pl-14 pr-6 py-5 focus:outline-none transition-all font-bold text-sm shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Таблица бизнесов */}
      <div className="premium-card overflow-x-auto p-0 border-none bg-transparent shadow-none">
        <table className="w-full text-left border-separate border-spacing-y-2">
          <thead>
            <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
              <th className="px-6 py-4">Бизнес / Владелец</th>
              <th className="px-6 py-4 text-center">Статус</th>
              <th className="px-6 py-4 text-center">Окончание</th>
              <th className="px-6 py-4 text-right">Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredBusinesses.map((b) => (
              <tr key={b.id} className="bg-card border border-border rounded-3xl group transition-all">
                <td className="px-6 py-4 rounded-l-3xl">
                  <p className="font-bold text-sm">{b.name}</p>
                  <p className="text-xs text-slate-400 font-medium">{b.owner_email}</p>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                    b.subscription_status === 'active' ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                  )}>
                    {b.subscription_status || 'Trialing'}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex flex-col items-center">
                    <p className="text-xs font-bold">{new Date(b.trial_ends_at).toLocaleDateString()}</p>
                    <p className="text-[9px] text-slate-400 uppercase font-black tracking-tighter">
                       {Math.ceil((new Date(b.trial_ends_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} дн. осталось
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4 text-right rounded-r-3xl">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => updateSubscription(b.id, b.owner_email, 30)}
                      className="px-4 py-2 bg-emerald-500 text-white text-[10px] font-bold rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/10"
                    >
                      +30 дней
                    </button>
                    <button 
                      onClick={() => updateSubscription(b.id, b.owner_email, 365)}
                      className="px-4 py-2 bg-amber-500 text-white text-[10px] font-bold rounded-xl hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/10"
                    >
                      +Год
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
