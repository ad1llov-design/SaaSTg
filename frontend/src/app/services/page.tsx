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
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-border pb-10">
        <div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter uppercase text-[var(--text-main)] leading-none">
            Asset <span className="font-premium text-indigo-500 italic lowercase tracking-tight">Catalog</span>
          </h1>
          <p className="text-slate-500 mt-6 font-bold text-xs uppercase tracking-[0.4em] opacity-60 italic">Architecting and managing service nodes for scheduling.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center justify-center gap-4 px-12 py-6 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-indigo-600/30 uppercase tracking-[0.25em] text-xs"
        >
          {isAdding ? 'Deactivate' : <><Plus className="w-5 h-5" /> Deploy Asset</>}
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="premium-card !p-10 !border-indigo-500/30 bg-indigo-500/[0.02]">
            <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-3 gap-10 items-end">
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] block ml-1 opacity-70">Identity Name</label>
                <input required type="text" placeholder="e.g. Executive Protocol" className="w-full bg-input border-2 border-transparent focus:border-indigo-500 rounded-[1.5rem] px-8 py-5 focus:outline-none transition-all font-bold text-sm shadow-inner" value={newService.name} onChange={e => setNewService({...newService, name: e.target.value})}/>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] block ml-1 opacity-70">Economic Value (сом)</label>
                <input required type="number" placeholder="1000" className="w-full bg-input border-2 border-transparent focus:border-indigo-500 rounded-[1.5rem] px-8 py-5 focus:outline-none transition-all font-bold text-sm shadow-inner" value={newService.price} onChange={e => setNewService({...newService, price: e.target.value})}/>
              </div>
              <button type="submit" className="bg-indigo-600 py-5 rounded-2xl font-bold uppercase text-white hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-600/20 tracking-[0.3em] text-[11px] h-[64px]">Authorize Deployment</button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {services.map((service) => (
          <div key={service.id} className="premium-card group relative flex flex-col hover:border-indigo-500/30 !p-10 transition-all duration-500 hover:-translate-y-2">
            <div className="flex justify-between items-start mb-10">
              <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center transition-all group-hover:bg-indigo-600 group-hover:text-white group-hover:rotate-6 shadow-sm border border-indigo-500/10">
                <Package className="w-8 h-8 text-indigo-500 transition-colors group-hover:text-white" />
              </div>
              <button onClick={() => handleDelete(service.id)} className="p-3 text-slate-300 dark:text-slate-600 hover:text-rose-500 transition-all hover:scale-110"><Trash2 className="w-6 h-6" /></button>
            </div>
            
            <h3 className="text-2xl font-bold uppercase tracking-tight text-[var(--text-main)] mb-8 transition-colors group-hover:text-indigo-600">{service.name}</h3>
            
            <div className="flex items-center gap-10 py-6 border-t border-slate-100 dark:border-white/5 mt-auto">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center border border-indigo-500/10 transition-all group-hover:scale-110">
                    <DollarSign className="w-5 h-5 text-indigo-500" />
                  </div>
                  <span className="font-bold text-xl tracking-tighter text-[var(--text-main)] italic">{service.price} <span className="text-xs uppercase not-italic opacity-50 ml-1">KGS</span></span>
               </div>
               <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-slate-400 opacity-50" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 opacity-70">{service.duration_minutes} MIN SLOT</span>
               </div>
            </div>

            <div className="absolute top-6 right-16">
               <div className="px-4 py-1.5 bg-indigo-500/5 rounded-full border border-indigo-500/10 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                 <span className="text-[8px] font-bold text-indigo-500 uppercase tracking-[0.3em]">Operational Node</span>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
