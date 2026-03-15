"use client";
import React, { useState, useEffect } from 'react';
import { Plus, Package, Clock, DollarSign, Trash2, Edit3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';

interface Service {
  id: string;
  name: string;
  price: number;
  duration_minutes: number;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newService, setNewService] = useState({ name: '', price: '', duration: '30' });

  // Load services
  useEffect(() => {
    async function fetchServices() {
      const { data, error } = await supabase
        .from('services')
        .select('*');
      
      if (!error && data) setServices(data);
      setLoading(false);
    }
    fetchServices();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    // For MVP we assume business_id is hardcoded or fetched from auth
    // In real app, get from supabase.auth.user()
    const { data: bus } = await supabase.from('businesses').select('id').limit(1).single();
    if (!bus) return alert('Register your business first!');

    const { data, error } = await supabase
      .from('services')
      .insert({
        name: newService.name,
        price: parseFloat(newService.price),
        duration_minutes: parseInt(newService.duration),
        business_id: bus.id
      })
      .select()
      .single();

    if (!error && data) {
      setServices([...services, data]);
      setIsAdding(false);
      setNewService({ name: '', price: '', duration: '30' });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Services</h2>
          <p className="text-slate-400 mt-1">Manage the services your clients can book.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20"
        >
          <Plus className="w-5 h-5" />
          Add Service
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
                <label className="text-sm font-medium text-slate-400">Service Name</label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g. Haircut"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors"
                  value={newService.name}
                  onChange={e => setNewService({...newService, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Price (Som)</label>
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
                <label className="text-sm font-medium text-slate-400">Duration (min)</label>
                <select 
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors"
                  value={newService.duration}
                  onChange={e => setNewService({...newService, duration: e.target.value})}
                >
                  <option value="15">15 min</option>
                  <option value="30">30 min</option>
                  <option value="45">45 min</option>
                  <option value="60">1 hour</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-emerald-500 py-3 rounded-xl font-bold hover:bg-emerald-600 transition-colors">
                  Save
                </button>
                <button 
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-6 bg-slate-800 py-3 rounded-xl font-bold hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
            <p>Loading services...</p>
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
              <div className="flex gap-2">
                  <button className="p-2 text-slate-500 hover:text-white transition-colors"><Edit3 className="w-4 h-4" /></button>
                  <button className="p-2 text-slate-500 hover:text-rose-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
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
                <span>{service.duration_minutes} minutes</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
