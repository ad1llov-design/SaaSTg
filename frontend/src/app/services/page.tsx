"use client";
import React, { useState, useEffect } from 'react';
import { Plus, Package, Clock, DollarSign, Trash2, Edit3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import DemoModal from '@/components/DemoModal';

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
        // Демо-данные для услуг
        setServices([
          { id: '1', name: 'Мужская стрижка', price: 800, duration_minutes: 30 },
          { id: '2', name: 'Маникюр + Покрытие', price: 1500, duration_minutes: 60 },
          { id: '3', name: 'Массаж лица', price: 2000, duration_minutes: 45 },
          { id: '4', name: 'Окрашивание волос', price: 3500, duration_minutes: 120 },
        ]);
        setLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('business_id', business.id);
      if (!error && data) setServices(data);
      setLoading(false);
    }
    fetchServices();
  }, [business]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setShowDemoModal(true);
      return;
    }
    if (!business?.id) return;

    const { data, error } = await supabase
      .from('services')
      .insert({
        name: newService.name,
        price: parseFloat(newService.price),
        duration_minutes: parseInt(newService.duration),
        business_id: business.id
      })
      .select()
      .single();

    if (!error && data) {
      setServices([...services, data]);
      setIsAdding(false);
      setNewService({ name: '', price: '', duration: '30' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!user) {
      setShowDemoModal(true);
      return;
    }
    const { error } = await supabase.from('services').delete().eq('id', id);
    if (!error) {
      setServices(services.filter(s => s.id !== id));
    }
  };

  return (
    <div className="space-y-8">
      <DemoModal isOpen={showDemoModal} onClose={() => setShowDemoModal(false)} />
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Услуги</h2>
          <p className="text-slate-400 mt-1">Управляйте списком услуг для ваших клиентов.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20"
        >
          <Plus className="w-5 h-5" />
          Добавить услугу
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass p-8 rounded-3xl border border-emerald-500/30 mb-8"
          >
            <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Название услуги</label>
                <input 
                  required
                  type="text" 
                  placeholder="Например: Стрижка"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors"
                  value={newService.name}
                  onChange={e => setNewService({...newService, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Цена (сом)</label>
                <input 
                  required
                  type="number" 
                  placeholder="500"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors"
                  value={newService.price}
                  onChange={e => setNewService({...newService, price: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Длительность</label>
                <select 
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors"
                  value={newService.duration}
                  onChange={e => setNewService({...newService, duration: e.target.value})}
                >
                  <option value="15">15 минут</option>
                  <option value="30">30 минут</option>
                  <option value="45">45 минут</option>
                  <option value="60">1 час</option>
                  <option value="90">1.5 часа</option>
                  <option value="120">2 часа</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-emerald-500 py-3 rounded-xl font-bold hover:bg-emerald-600 transition-colors">
                  Сохранить
                </button>
                <button 
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-6 bg-slate-800 py-3 rounded-xl font-bold hover:bg-slate-700 transition-colors"
                >
                  Отмена
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
            <p className="text-slate-500">Загрузка услуг...</p>
        ) : services.length === 0 ? (
            <div className="col-span-full text-center py-12 text-slate-500">
              <Package className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>Услуг пока нет. Добавьте первую услугу!</p>
            </div>
        ) : services.map((service) => (
          <motion.div 
            layout
            key={service.id} 
            className="group glass p-6 rounded-2xl border border-slate-800 hover:border-emerald-500/50 transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                <Package className="w-6 h-6 text-slate-400 group-hover:text-emerald-400" />
              </div>
              <div className="flex gap-1">
                <button 
                  onClick={() => handleDelete(service.id)}
                  className="p-2 text-slate-500 hover:text-rose-400 transition-colors"
                  title="Удалить"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <h3 className="text-xl font-bold mb-4">{service.name}</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-400">
                <DollarSign className="w-4 h-4 text-emerald-500" />
                <span className="font-medium text-white">{service.price} сом</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Clock className="w-4 h-4 text-emerald-500" />
                <span>{service.duration_minutes} мин</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
