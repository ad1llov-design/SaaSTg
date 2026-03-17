"use client";
import React, { useState, useEffect } from 'react';
import { Plus, UserSquare, MoreVertical, Trash2, Shield, ShieldCheck, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import { useLanguage } from '@/context/LanguageContext';
import DemoModal from '@/components/DemoModal';
import { cn } from '@/lib/utils';

interface StaffMember {
  id: string;
  name: string;
  role: string | null;
  is_active: boolean;
}

export default function StaffPage() {
  const { business, user } = useAuth();
  const { t } = useLanguage();
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', role: '' });
  const [showDemoModal, setShowDemoModal] = useState(false);

  useEffect(() => {
    async function fetchStaff() {
      if (!business?.id) {
        setStaff([
          { id: '1', name: 'Александр', role: 'Старший барбер', is_active: true },
          { id: '2', name: 'Мария', role: 'Топ-стилист', is_active: true },
          { id: '3', name: 'Дмитрий', role: 'Мастер маникюра', is_active: true },
        ]);
        setLoading(false);
        return;
      }
      const { data, error } = await supabase.from('staff').select('*').eq('business_id', business.id);
      if (!error && data) setStaff(data);
      setLoading(false);
    }
    fetchStaff();
  }, [business]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { setShowDemoModal(true); return; }
    if (!business?.id) return;
    const { data, error } = await supabase.from('staff').insert({ 
      name: newMember.name, 
      role: newMember.role,
      business_id: business.id 
    }).select().single();
    
    if (!error && data) { 
      setStaff([...staff, data]); 
      setIsAdding(false); 
      setNewMember({ name: '', role: '' }); 
    }
  };

  const handleDelete = async (id: string) => {
    if (!user) { setShowDemoModal(true); return; }
    const { error } = await supabase.from('staff').delete().eq('id', id);
    if (!error) setStaff(staff.filter(s => s.id !== id));
  };

  const toggleStatus = async (member: StaffMember) => {
    if (!user) { setShowDemoModal(true); return; }
    const newStatus = !member.is_active;
    const { error } = await supabase.from('staff').update({ is_active: newStatus }).eq('id', member.id);
    if (!error) {
      setStaff(staff.map(s => s.id === member.id ? { ...s, is_active: newStatus } : s));
    }
  };

  return (
    <div className="space-y-8 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <DemoModal isOpen={showDemoModal} onClose={() => setShowDemoModal(false)} />
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t.staff.title}
          </h1>
          <p className="text-slate-500 mt-2 text-sm">
            {t.staff.subtitle}
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
          {isAdding ? t.common.cancel : <><Plus className="w-5 h-5" /> {t.staff.add}</>}
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="premium-card !p-8 bg-slate-50 dark:bg-white/[0.02]">
            <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-semibold text-slate-500 tracking-wide block ml-1">{t.staff.form_name}</label>
                <input required type="text" placeholder="Иван Иванов" className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-indigo-500 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm shadow-sm" value={newMember.name} onChange={e => setNewMember({...newMember, name: e.target.value})}/>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 tracking-wide block ml-1">{t.staff.form_role}</label>
                <input required type="text" placeholder="Старший мастер" className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-indigo-500 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm shadow-sm" value={newMember.role} onChange={e => setNewMember({...newMember, role: e.target.value})}/>
              </div>
              <button type="submit" className="btn-premium btn-premium-primary h-[46px] w-full">{t.common.save}</button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staff.map((member) => (
          <div key={member.id} className="premium-card group flex flex-col hover:border-indigo-500/30 !p-6 transition-all duration-300 hover:-translate-y-1 bg-white dark:bg-[#1a1c23]">
            <div className="flex justify-between items-start mb-6">
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center transition-all group-hover:rotate-6 shadow-sm border",
                member.is_active 
                  ? "bg-indigo-500/10 border-indigo-500/10 text-indigo-500 group-hover:bg-indigo-600 group-hover:text-white" 
                  : "bg-slate-500/10 border-slate-500/10 text-slate-500"
              )}>
                <UserSquare className="w-6 h-6" />
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => toggleStatus(member)} 
                  className={cn(
                    "p-2 rounded-lg transition-all hover:scale-110",
                    member.is_active ? "text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10" : "text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10"
                  )}
                >
                  {member.is_active ? <ShieldCheck className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
                </button>
                <button onClick={() => handleDelete(member.id)} className="p-2 text-slate-400 hover:text-rose-500 transition-all hover:scale-110 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg"><Trash2 className="w-5 h-5" /></button>
              </div>
            </div>
            
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 transition-colors group-hover:text-indigo-600">{member.name}</h3>
            <p className="text-sm font-medium text-slate-500 mb-6">{member.role}</p>
            
            <div className="flex items-center justify-between py-4 border-t border-slate-100 dark:border-white/5 mt-auto">
               <div className="flex items-center gap-2">
                  <div className={cn("w-2 h-2 rounded-full", member.is_active ? "bg-emerald-500" : "bg-slate-400")} />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    {member.is_active ? t.staff.status_active : t.staff.status_inactive}
                  </span>
               </div>
            </div>
          </div>
        ))}
        {staff.length === 0 && !loading && (
          <div className="col-span-full py-20 text-center text-slate-400 font-medium">
             {t.staff.no_staff}
          </div>
        )}
      </div>
    </div>
  );
}
