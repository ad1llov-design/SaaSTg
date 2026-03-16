"use client";
import React, { useState, useEffect } from 'react';
import { Plus, Package, Clock, DollarSign, Trash2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
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
    <div className="space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <DemoModal isOpen={showDemoModal} onClose={() => setShowDemoModal(false)} />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border pb-8">
        <div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase text-[var(--text-main)]">
            Product <span className="font-premium text-indigo-500 italic lowercase tracking-tight">Catalog</span>
          </h1>
          <p className="text-slate-500 mt-2 font-bold text-sm uppercase tracking-widest opacity-80">Создавайте и управляйте пакетами услуг для бронирования.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center justify-center gap-2 px-10 py-5 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-indigo-600/20 uppercase tracking-widest text-xs"
        >
          {isAdding ? 'Отменить' : <><Plus className="w-5 h-5" /> Добавить услугу</>}
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="premium-card !border-indigo-500/30">
            <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Identity (Название)</label>
                <input required type="text" placeholder="Например: Стрижка" className="w-full bg-input border-2 border-transparent focus:border-indigo-500 rounded-2xl px-6 py-4 focus:outline-none transition-all font-bold text-sm shadow-sm" value={newService.name} onChange={e => setNewService({...newService, name: e.target.value})}/>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Value (сом)</label>
                <input required type="number" placeholder="500" className="w-full bg-input border-2 border-transparent focus:border-indigo-500 rounded-2xl px-6 py-4 focus:outline-none transition-all font-bold text-sm shadow-sm" value={newService.price} onChange={e => setNewService({...newService, price: e.target.value})}/>
              </div>
              <button type="submit" className="bg-indigo-600 py-4 rounded-xl font-black uppercase text-white hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 tracking-widest text-[11px]">Deploy Service</button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service) => (
          <div key={service.id} className="premium-card group relative flex flex-col hover:border-indigo-500/30">
            <div className="flex justify-between items-start mb-8">
              <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center transition-all group-hover:bg-indigo-500 group-hover:text-white group-hover:rotate-6 shadow-sm">
                <Package className="w-7 h-7 text-indigo-500 transition-colors group-hover:text-white" />
              </div>
              <button onClick={() => handleDelete(service.id)} className="p-3 text-slate-300 dark:text-slate-600 hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100 hover:scale-110"><Trash2 className="w-5 h-5" /></button>
            </div>
            
            <h3 className="text-xl font-black uppercase tracking-tight text-[var(--text-main)] mb-6">{service.name}</h3>
            
            <div className="flex items-center gap-8 py-5 border-t border-slate-100 dark:border-white/5 mt-auto">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-indigo-500/10 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-indigo-500" />
                  </div>
                  <span className="font-black text-lg tracking-tighter text-[var(--text-main)] italic">{service.price} сом</span>
               </div>
               <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{service.duration_minutes} min</span>
               </div>
            </div>

            <div className="absolute top-4 right-14">
               <div className="px-3 py-1 bg-indigo-500/5 rounded-full border border-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity">
                 <span className="text-[8px] font-black text-indigo-500 uppercase tracking-widest">Active Tier</span>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
