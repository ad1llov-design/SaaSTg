"use client";
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Users as UsersIcon, 
  ExternalLink, 
  ChevronRight, 
  Zap, 
  Target, 
  MessageSquare,
  History,
  Save,
  ShieldCheck,
  AlertTriangle,
  UserX
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import DemoModal from '@/components/DemoModal';

export default function ClientsPage() {
  const { business, user } = useAuth();
  const { t, locale } = useLanguage();
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showDemoModal, setShowDemoModal] = useState(false);

  useEffect(() => {
    async function loadClients() {
      if (!business?.id) {
        setClients([
          { id: '1', name: 'Александр Колесников', telegram_id: 12345678, visits_count: 5, last_visit: new Date().toISOString(), notes: 'Предпочитает вечерние записи', rfm_status: 'active' },
          { id: '2', name: 'Мария Сидорова', telegram_id: 87654321, visits_count: 12, last_visit: new Date().toISOString(), notes: 'Постоянный клиент', rfm_status: 'active' },
          { id: '3', name: 'Виктор Петров', telegram_id: 13572468, visits_count: 1, last_visit: new Date().toISOString(), notes: '', rfm_status: 'lost' },
          { id: '4', name: 'Елена Маркова', telegram_id: 24681357, visits_count: 3, last_visit: new Date().toISOString(), notes: '', rfm_status: 'at_risk' },
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

  const updateClientNotes = async (clientId: string, notes: string) => {
    if (!user) { setShowDemoModal(true); return; }
    const { error } = await supabase.from('clients').update({ notes }).eq('id', clientId);
    if (!error) {
      setClients(clients.map(c => c.id === clientId ? { ...c, notes } : c));
    }
  };

  const filtered = clients.filter(c => 
    (c.name || '').toLowerCase().includes(search.toLowerCase()) || 
    String(c.telegram_id).includes(search)
  );

  const getStatusConfig = (status: string) => {
    switch(status) {
      case 'active': return { label: t.crm.rfm_active, color: 'text-emerald-500 bg-emerald-500/10', icon: ShieldCheck };
      case 'at_risk': return { label: t.crm.rfm_at_risk, color: 'text-amber-500 bg-amber-500/10', icon: AlertTriangle };
      case 'lost': return { label: t.crm.rfm_lost, color: 'text-rose-500 bg-rose-500/10', icon: UserX };
      default: return { label: t.crm.rfm_active, color: 'text-indigo-500 bg-indigo-500/10', icon: Zap };
    }
  };

  return (
    <div className="space-y-8 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <DemoModal isOpen={showDemoModal} onClose={() => setShowDemoModal(false)} />
      
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
            placeholder={t.common.search_placeholder} 
            className="flex-1 bg-transparent py-4 focus:outline-none text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400" 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
          />
        </div>
      </div>

      <div className="premium-card !p-0 overflow-hidden bg-white dark:bg-[#1a1c23]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead className="bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/10">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">{t.common.clients}</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">{t.crm.rfm_status}</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">{t.clients.table_visits}</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">{t.clients.table_last_visit}</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">{t.clients.table_contact}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {filtered.map(client => {
                const isExpanded = expandedId === client.id;
                const status = getStatusConfig(client.rfm_status);
                return (
                  <React.Fragment key={client.id}>
                    <tr 
                      onClick={() => setExpandedId(isExpanded ? null : client.id)}
                      className={cn(
                        "hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group cursor-pointer",
                        isExpanded && "bg-indigo-500/[0.03] dark:bg-indigo-500/[0.05]"
                      )}
                    >
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl flex items-center justify-center font-bold text-slate-500 text-xs transition-colors shadow-sm">
                            {(client.name || 'U')[0]}
                          </div>
                          <div>
                            <p className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">{client.name || 'Anonymous User'}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">#{client.telegram_id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className={cn("inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm border border-transparent", status.color)}>
                           <status.icon className="w-3 h-3" />
                           {status.label}
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-3">
                           <span className="text-sm font-semibold text-slate-900 dark:text-white">{client.visits_count}</span>
                           <div className="w-20 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex items-center">
                              <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${Math.min(client.visits_count * 10, 100)}%` }} />
                           </div>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-sm font-medium text-slate-500">
                        {client.last_visit ? new Date(client.last_visit).toLocaleDateString(locale === 'ru' || locale === 'en' ? (locale === 'ru' ? 'ru-RU' : 'en-US') : 'ru-RU') : t.clients.no_visits}
                      </td>
                      <td className="px-6 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                           <a href={`https://t.me/${client.telegram_id}`} target="_blank" onClick={(e) => e.stopPropagation()} className="w-9 h-9 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-all inline-flex items-center justify-center shadow-sm">
                            <ExternalLink className="w-4 h-4" />
                           </a>
                           <motion.div animate={{ rotate: isExpanded ? 90 : 0 }}>
                              <ChevronRight className="w-4 h-4 text-slate-400" />
                           </motion.div>
                        </div>
                      </td>
                    </tr>
                    
                    <AnimatePresence>
                      {isExpanded && (
                        <tr>
                          <td colSpan={5} className="px-6 py-0 border-none bg-slate-50/50 dark:bg-white/[0.01]">
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }} 
                              animate={{ height: 'auto', opacity: 1 }} 
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="py-8 grid grid-cols-1 lg:grid-cols-2 gap-8 border-t border-slate-200 dark:border-white/10">
                                 {/* Notes Section */}
                                 <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                       <MessageSquare className="w-4 h-4" />
                                       {t.crm.client_notes}
                                    </div>
                                    <div className="relative group">
                                      <textarea 
                                        className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all min-h-[140px] shadow-inner"
                                        placeholder={t.crm.notes_placeholder}
                                        defaultValue={client.notes || ''}
                                        onBlur={(e) => updateClientNotes(client.id, e.target.value)}
                                      />
                                      <div className="absolute bottom-4 right-4 text-slate-400 opacity-0 group-focus-within:opacity-100 transition-opacity flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest">
                                         <Save className="w-3 h-3" /> Auto-saving
                                      </div>
                                    </div>
                                 </div>

                                 {/* Visit Stats/History */}
                                 <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                       <History className="w-4 h-4" />
                                       Activity History
                                    </div>
                                    <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 space-y-4 shadow-inner">
                                       <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-white/5">
                                          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.dashboard.today_apts}</span>
                                          <span className="text-sm font-bold text-slate-900 dark:text-white">Confirmed</span>
                                       </div>
                                       <div className="flex items-center justify-between py-2">
                                          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Average spend</span>
                                          <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">1,200 {t.common.currency}</span>
                                       </div>
                                       <div className="pt-4 text-center">
                                          <p className="text-xs text-slate-400 font-medium italic">{t.crm.history_none}</p>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                            </motion.div>
                          </td>
                        </tr>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                );
              })}
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
