"use client";
import React, { useState, useEffect } from 'react';
import { 
  BrainCircuit, 
  Save, 
  ChevronLeft, 
  Info, 
  Key, 
  Terminal, 
  Database,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/components/AuthProvider';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function AiSettingsPage() {
  const { business, user } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  
  const [config, setConfig] = useState({
    openai_api_key: '',
    system_prompt: '',
    knowledge_base: ''
  });

  useEffect(() => {
    if (business?.ai_config) {
      setConfig({
        openai_api_key: business.ai_config.openai_api_key || '',
        system_prompt: business.ai_config.system_prompt || '',
        knowledge_base: business.ai_config.knowledge_base || ''
      });
    }
  }, [business]);

  const saveConfig = async () => {
    if (!business?.id) return;
    setLoading(true);
    
    const { error } = await supabase
      .from('businesses')
      .update({ ai_config: config })
      .eq('id', business.id);

    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 py-10 px-4 font-sans animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
         <Link href="/modules" className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition-colors">
            <ChevronLeft className="w-5 h-5" />
            {t.modules.title}
         </Link>
         {saved && (
           <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-2 text-emerald-500 font-bold text-sm bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4" />
              {t.bot.saved}
           </motion.div>
         )}
      </div>

      <div className="space-y-4">
        <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center border border-purple-500/20 mb-6">
          <BrainCircuit className="w-8 h-8 text-purple-600 dark:text-purple-400" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {t.modules.ai_config_title}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">
          {t.modules.ai_desc}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* API KEY */}
        <div className="premium-card space-y-4">
           <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <Key className="w-4 h-4 text-indigo-500" />
              {t.modules.ai_config_key}
           </div>
           <input 
             type="password"
             placeholder="sk-..."
             className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-6 py-4 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-slate-900 dark:text-white"
             value={config.openai_api_key}
             onChange={(e) => setConfig({...config, openai_api_key: e.target.value})}
           />
        </div>

        {/* SYSTEM PROMPT */}
        <div className="premium-card space-y-4">
           <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <Terminal className="w-4 h-4 text-purple-500" />
              {t.modules.ai_config_prompt}
           </div>
           <textarea 
             className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-6 py-4 text-sm min-h-[120px] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-slate-900 dark:text-white"
             value={config.system_prompt}
             onChange={(e) => setConfig({...config, system_prompt: e.target.value})}
           />
        </div>

        {/* KNOWLEDGE BASE */}
        <div className="premium-card space-y-4">
           <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <Database className="w-4 h-4 text-emerald-500" />
              {t.modules.ai_config_knowledge}
           </div>
           <textarea 
             className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-6 py-4 text-sm min-h-[200px] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-slate-900 dark:text-white"
             placeholder="Our office is at... We also offer..."
             value={config.knowledge_base}
             onChange={(e) => setConfig({...config, knowledge_base: e.target.value})}
           />
           <div className="flex items-start gap-3 bg-indigo-50 dark:bg-indigo-500/5 p-4 rounded-xl border border-indigo-100 dark:border-indigo-500/10">
              <Info className="w-5 h-5 text-indigo-500 mt-0.5" />
              <p className="text-xs text-indigo-600/80 dark:text-indigo-400/80 font-medium leading-relaxed">
                 {t.modules.ai_config_help}
              </p>
           </div>
        </div>
      </div>

      <div className="pt-6">
         <button 
           onClick={saveConfig}
           disabled={loading}
           className="w-full md:w-auto px-12 py-5 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2"
         >
           {loading ? '...' : t.bot.save_btn}
           <Save className="w-5 h-5" />
         </button>
      </div>
    </div>
  );
}
