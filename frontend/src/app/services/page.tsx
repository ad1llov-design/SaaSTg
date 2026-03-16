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
    <div className="space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <DemoModal isOpen={showDemoModal} onClose={() => setShowDemoModal(false)} />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">Ваши <span className="font-premium text-emerald-500 italic">Услуги</span></h1>
          <p className="text-slate-500 mt-2 font-medium">Создавайте и управляйте пакетами услуг для бронирования.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center justify-center gap-2 px-8 py-4 bg-emerald-500 text-white font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-emerald-500/20"
        >
          {isAdding ? 'Отменить' : <><Plus className="w-5 h-5" /> Добавить услугу</>}
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="premium-card !border-emerald-500/30">
            <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Название</label>
                <input required type="text" placeholder="Например: Стрижка" className="w-full bg-[var(--bg-input)] border border-transparent focus:border-emerald-500 rounded-xl px-4 py-4 focus:outline-none transition-all font-bold text-sm" value={newService.name} onChange={e => setNewService({...newService, name: e.target.value})}/>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Цена (сом)</label>
                <input required type="number" placeholder="500" className="w-full bg-[var(--bg-input)] border border-transparent focus:border-emerald-500 rounded-xl px-4 py-4 focus:outline-none transition-all font-bold text-sm" value={newService.price} onChange={e => setNewService({...newService, price: e.target.value})}/>
              </div>
              <button type="submit" className="bg-emerald-500 py-4 rounded-xl font-bold text-white hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/10">Сохранить</button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service.id} className="premium-card group relative flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500">
                <Package className="w-6 h-6 text-emerald-500" />
              </div>
              <button onClick={() => handleDelete(service.id)} className="p-2 text-slate-300 dark:text-slate-600 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"><Trash2 className="w-5 h-5" /></button>
            </div>
            <h3 className="text-xl font-bold mb-4">{service.name}</h3>
            <div className="flex items-center gap-6 border-t border-slate-100 dark:border-white/5 pt-4 mt-auto">
               <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-500" />
                  <span className="font-bold">{service.price} сом</span>
               </div>
               <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                  <span className="text-sm font-medium text-slate-500">{service.duration_minutes} мин</span>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
