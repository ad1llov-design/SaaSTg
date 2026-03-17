"use client";
import React, { useState, useEffect } from 'react';
import { Plus, Package, Clock, DollarSign, Trash2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import { useLanguage } from '@/context/LanguageContext';
import DemoModal from '@/components/DemoModal';
import { cn } from '@/lib/utils';

interface Service {
  id: string;
  name: string;
  price: number;
  duration_minutes: number;
}

export default function ServicesPage() {
  const { business, user } = useAuth();
  const { t } = useLanguage();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newService, setNewService] = useState({ name: '', price: '', duration: '30' });
  const [showDemoModal, setShowDemoModal] = useState(false);

  useEffect(() => {
    async function fetchServices() {
      if (!business?.id) {
        setServices([
          { id: '1', name: 'Мужская стрижка', price: 800, duration_minutes: 30 },
          { id: '2', name: 'Маникюр + Покрытие', price: 1500, duration_minutes: 60 },
          { id: '3', name: 'Массаж лица', price: 2000, duration_minutes: 45 },
          { id: '4', name: 'Окрашивание волос', price: 3500, duration_minutes: 120 },
        ]);
        setLoading(false);
        return;
      }
      const { data, error } = await supabase.from('services').select('*').eq('business_id', business.id);
      if (!error && data) setServices(data);
      setLoading(false);
    }
    fetchServices();
  }, [business]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { setShowDemoModal(true); return; }
    if (!business?.id) return;
    const { data, error } = await supabase.from('services').insert({ name: newService.name, price: parseFloat(newService.price), duration_minutes: parseInt(newService.duration), business_id: business.id }).select().single();
    if (!error && data) { setServices([...services, data]); setIsAdding(false); setNewService({ name: '', price: '', duration: '30' }); }
  };

  const handleDelete = async (id: string) => {
    if (!user) { setShowDemoModal(true); return; }
    const { error } = await supabase.from('services').delete().eq('id', id);
    if (!error) setServices(services.filter(s => s.id !== id));
  };

  return (
    <div className="space-y-8 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <DemoModal isOpen={showDemoModal} onClose={() => setShowDemoModal(false)} />
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t.services.title}
          </h1>
          <p className="text-slate-500 mt-2 text-sm">
            {t.services.subtitle}
          </p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className={cn(
            "btn-premium h-14",
            isAdding 
              ? "bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 shadow-none border border-rose-500/10" 
              : "btn-premium-primary"
          )}
        >
          {isAdding ? t.common.cancel : <><Plus className="w-5 h-5" /> {t.services.add}</>}
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="premium-card !p-8 bg-slate-50 dark:bg-white/[0.02]">
            <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-semibold text-slate-500 tracking-wide block ml-1">{t.services.form_name}</label>
                <input required type="text" placeholder={t.services.form_name_ph} className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-indigo-500 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm shadow-sm" value={newService.name} onChange={e => setNewService({...newService, name: e.target.value})}/>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 tracking-wide block ml-1">{t.services.form_price}</label>
                <input required type="number" placeholder="1000" className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-indigo-500 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm shadow-sm" value={newService.price} onChange={e => setNewService({...newService, price: e.target.value})}/>
              </div>
              <button type="submit" className="btn-premium btn-premium-primary h-[46px] w-full">{t.common.save}</button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service.id} className="premium-card group relative flex flex-col hover:border-indigo-500/30 !p-6 transition-all duration-300 hover:-translate-y-1 bg-white dark:bg-[#1a1c23]">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center transition-all group-hover:bg-indigo-600 group-hover:text-white group-hover:rotate-6 shadow-sm border border-indigo-500/10">
                <Package className="w-6 h-6 text-indigo-500 transition-colors group-hover:text-white" />
              </div>
              <button onClick={() => handleDelete(service.id)} className="p-2 text-slate-400 hover:text-rose-500 transition-all hover:scale-110 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg"><Trash2 className="w-5 h-5" /></button>
            </div>
            
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 transition-colors group-hover:text-indigo-600">{service.name}</h3>
            
            <div className="flex flex-col gap-4 py-4 border-t border-slate-100 dark:border-white/5 mt-auto">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center border border-emerald-500/10 transition-all group-hover:scale-110">
                    <DollarSign className="w-4 h-4 text-emerald-500" />
                  </div>
                  <span className="font-bold tracking-tight text-slate-900 dark:text-white">{service.price} {t.common.currency}</span>
               </div>
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-100 dark:bg-white/5 rounded-lg flex items-center justify-center text-slate-500 border border-slate-200 dark:border-white/10 transition-all">
                    <Clock className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-slate-500">{service.duration_minutes} {t.common.minutes}</span>
               </div>
            </div>
          </div>
        ))}
        {services.length === 0 && !loading && (
          <div className="col-span-full py-20 text-center text-slate-400 font-medium">
             {t.services.no_services}
          </div>
        )}
      </div>
    </div>
  );
}
