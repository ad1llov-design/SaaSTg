"use client";
import React, { useState } from 'react';
import { 
  Package, 
  ShoppingBag, 
  BrainCircuit, 
  LifeBuoy, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  Sparkles,
  Zap,
  Megaphone
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/components/AuthProvider';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import DemoModal from '@/components/DemoModal';
import Link from 'next/link';

export default function ModulesPage() {
  const { business, user } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);

  // local state for modules config
  const modules = business?.modules_config || {
    shop: false,
    ai_consultant: false,
    support: false
  };

  const toggleModule = async (moduleId: string) => {
    if (!user) { setShowDemoModal(true); return; }
    if (!business?.id) return;

    setLoading(true);
    const newConfig = { ...modules, [moduleId]: !modules[moduleId] };
    
    const { error } = await supabase
      .from('businesses')
      .update({ modules_config: newConfig })
      .eq('id', business.id);

    if (!error) {
       // Ideally we should update the auth context business state here
       // For now, we'll just reload or rely on the user to refresh
       window.location.reload(); 
    }
    setLoading(false);
  };

  const moduleList = [
    { 
      id: 'shop', 
      title: t.modules.shop, 
      desc: t.modules.shop_desc, 
      icon: ShoppingBag, 
      color: 'indigo',
      premium: false 
    },
    { 
      id: 'ai_consultant', 
      title: t.modules.ai, 
      desc: t.modules.ai_desc, 
      icon: BrainCircuit, 
      color: 'purple',
      premium: true 
    },
    { 
      id: 'support', 
      title: t.modules.support, 
      desc: t.modules.support_desc, 
      icon: LifeBuoy, 
      color: 'emerald',
      premium: true 
    },
    { 
      id: 'marketing', 
      title: t.marketing.title, 
      desc: t.marketing.desc, 
      icon: Zap, 
      color: 'amber',
      premium: false 
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-12 py-10 px-4 font-sans animate-in fade-in slide-in-from-bottom-4 duration-700">
      <DemoModal isOpen={showDemoModal} onClose={() => setShowDemoModal(false)} />
      
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider border border-indigo-100 dark:border-indigo-500/20">
          <Package className="w-3.5 h-3.5" />
          {t.modules.title}
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {t.modules.title}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium max-w-lg mx-auto text-sm">
          {t.modules.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {moduleList.map((mod, i) => {
          const isActive = modules[mod.id];
          return (
            <motion.div 
              key={mod.id}
              whileHover={{ y: -4 }}
              className={cn(
                "premium-card relative overflow-hidden group border-2 transition-all p-8 flex flex-col",
                isActive 
                  ? "border-green-500/30 bg-green-500/[0.02]" 
                  : "border-slate-200 dark:border-white/10 hover:border-indigo-500/30"
              )}
            >
              {mod.premium && (
                 <div className="absolute top-4 right-4 bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-lg uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Premium
                 </div>
              )}

              <div className="flex items-start justify-between mb-8">
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-sm border",
                  isActive 
                    ? `bg-${mod.color}-500 text-white` 
                    : `bg-${mod.color}-500/10 border-${mod.color}-500/10 text-${mod.color}-500`
                )}>
                  <mod.icon className="w-7 h-7" />
                </div>
                
                <div className="flex flex-col items-end">
                  <span className={cn(
                    "text-[10px] font-black uppercase tracking-widest",
                    isActive ? "text-green-500" : "text-slate-400"
                  )}>
                    {isActive ? t.modules.status_enabled : t.modules.status_disabled}
                  </span>
                </div>
              </div>

              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{mod.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8">
                  {mod.desc}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => toggleModule(mod.id)}
                  disabled={loading}
                  className={cn(
                    "w-full py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2",
                    isActive
                      ? "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-rose-500/10 hover:text-rose-500"
                      : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-600/20"
                  )}
                >
                  {loading ? '...' : isActive ? 'Deactivate' : 'Activate'}
                  {!isActive && <ArrowRight className="w-4 h-4" />}
                </button>

                {isActive && (mod.id === 'ai_consultant' || mod.id === 'shop' || mod.id === 'marketing') && (
                  <Link 
                    href={
                      mod.id === 'ai_consultant' ? "/modules/ai-settings" : 
                      mod.id === 'shop' ? "/shop" : 
                      "/marketing"
                    }
                    className="w-full py-4 rounded-xl font-bold text-sm bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-all flex items-center justify-center gap-2 border border-indigo-100 dark:border-indigo-500/20"
                  >
                    {t.modules.btn_configure}
                  </Link>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Info Card */}
      <div className="bg-indigo-600 p-10 rounded-[2.5rem] text-white relative overflow-hidden group shadow-2xl shadow-indigo-600/20 mt-8">
         <div className="absolute -right-10 -top-10 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000" />
         <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="w-20 h-20 bg-white/20 rounded-[2rem] flex items-center justify-center shrink-0">
               <BrainCircuit className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1 text-center md:text-left">
               <h3 className="text-2xl font-bold mb-2">Need a custom module?</h3>
               <p className="text-indigo-100/80 font-medium">
                  We are constantly expanding our ecosystem. If you need a specific integration like CRM Sync or custom AI training, contact us.
               </p>
            </div>
            <button className="px-8 py-4 bg-white text-indigo-600 font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10">
               Contact Support
            </button>
         </div>
      </div>
    </div>
  );
}
