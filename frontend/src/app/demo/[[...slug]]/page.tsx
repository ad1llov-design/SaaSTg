"use client";
import React from 'react';
import { 
  Users, 
  CalendarCheck, 
  TrendingUp, 
  DollarSign, 
  ArrowUpRight, 
  Clock, 
  Zap,
  LayoutDashboard,
  BrainCircuit,
  PieChart as PieChartIcon,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';

const data = [
  { name: 'Mon', revenue: 4500, apts: 12 },
  { name: 'Tue', revenue: 5200, apts: 15 },
  { name: 'Wed', revenue: 4800, apts: 10 },
  { name: 'Thu', revenue: 6100, apts: 18 },
  { name: 'Fri', revenue: 7500, apts: 22 },
  { name: 'Sat', revenue: 9200, apts: 28 },
  { name: 'Sun', revenue: 8100, apts: 25 },
];

export default function DemoDashboard() {
  const { t } = useLanguage();
  
  const stats = {
    appointments: 145,
    revenue: 284500,
    clients: 1240
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants: any = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 py-6 md:py-10 px-4 font-sans relative">
      {/* Demo Badge */}
      <div className="fixed top-24 right-10 z-[100] hidden xl:block">
        <div className="bg-amber-500 text-white px-6 py-2 rounded-full font-black uppercase tracking-widest text-[10px] shadow-2xl animate-bounce shadow-amber-500/20">
          Viewing Demo Mode • Read Only
        </div>
      </div>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold tracking-wider text-[10px] uppercase mb-2">
            <LayoutDashboard className="w-3.5 h-3.5" />
            {t.common.dashboard} (Demo)
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tighter text-slate-900 dark:text-white">
            {t.dashboard.title}
          </h1>
          <p className="text-sm text-slate-500 font-medium">{t.dashboard.subtitle}</p>
        </div>
        
        <div className="flex items-center gap-3 bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 px-4 py-2 rounded-xl shadow-sm backdrop-blur-xl">
          <div className="w-8 h-8 bg-indigo-500/10 rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-left">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Demo Business</p>
            <p className="text-xs font-bold text-slate-900 dark:text-white">AuraSync Beauty & Spa</p>
          </div>
        </div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {/* Stat Cards */}
        {[
          { label: t.dashboard.active_apts, val: stats.appointments, icon: CalendarCheck, color: 'indigo', growth: '+12%' },
          { label: t.dashboard.clients_base, val: stats.clients, icon: Users, color: 'emerald', growth: '+5%' },
          { label: t.dashboard.revenue, val: stats.revenue, icon: DollarSign, color: 'amber', growth: '+18%' },
          { label: t.dashboard.average_bill, val: Math.round(stats.revenue / (stats.appointments || 1)), icon: TrendingUp, color: 'rose', growth: '+4%' }
        ].map((item, i) => (
          <motion.div key={i} variants={itemVariants} className="premium-card relative overflow-hidden group">
            <div className={`absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform duration-500 text-indigo-600`}>
                <item.icon className="w-16 h-16" />
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-slate-100 dark:bg-white/5 rounded-xl flex items-center justify-center">
                <item.icon className="w-5 h-5 text-indigo-500" />
              </div>
              <span className="px-2 py-0.5 rounded-lg text-[9px] font-bold bg-indigo-500/10 text-indigo-500 tracking-wider">
                {item.growth}
              </span>
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white tracking-tighter leading-none mb-2">{item.val.toLocaleString()}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</p>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2 premium-card !p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t.dashboard.revenue_growth}</h3>
              <p className="text-sm text-slate-500 font-medium">{t.dashboard.appointments_stats}</p>
            </div>
            <div className="flex gap-2">
               <div className="w-3 h-3 bg-indigo-500 rounded-full" />
               <div className="w-3 h-3 bg-indigo-500/20 rounded-full" />
            </div>
          </div>
          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" opacity={0.05} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#94a3b8' }} dy={10} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: 'none', 
                    borderRadius: '16px', 
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    color: '#fff' 
                  }}
                  itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* AI Insights & Info */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="premium-card !bg-indigo-600 !border-none p-8 text-white relative overflow-hidden group">
               <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
               <BrainCircuit className="w-10 h-10 text-indigo-200 mb-6" />
               <h3 className="text-2xl font-black mb-2 uppercase tracking-tighter">{t.dashboard.insights}</h3>
               <p className="text-sm text-indigo-100/80 font-medium leading-relaxed mb-8">
                  {t.dashboard.insights_desc}
               </p>
               <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-white/10 hover:bg-white/20 px-5 py-3 rounded-xl transition-all border border-white/10">
                  {t.dashboard.report_btn} <ChevronRight className="w-4 h-4" />
               </button>
            </div>

            <div className="premium-card">
               <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center">
                  <PieChartIcon className="w-5 h-5 text-amber-500" />
                </div>
                <h4 className="font-black text-xs uppercase tracking-widest text-slate-400">{t.dashboard.distribution_title}</h4>
               </div>
               <div className="space-y-5">
                  {[
                    { name: t.dashboard.services_label, val: '65%', color: 'bg-indigo-500' },
                    { name: t.dashboard.retail_label, val: '25%', color: 'bg-emerald-500' },
                    { name: t.dashboard.other_label, val: '10%', color: 'bg-amber-500' }
                  ].map((l, i) => (
                    <div key={i} className="space-y-2.5">
                       <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                          <span>{l.name}</span>
                          <span className="text-slate-900 dark:text-white">{l.val}</span>
                       </div>
                       <div className="h-1.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: l.val }} transition={{ delay: 0.5 + i*0.1, duration: 1 }} className={`h-full ${l.color}`} />
                       </div>
                    </div>
                  ))}
               </div>
            </div>
        </motion.div>
      </div>

      {/* CTA Section for Demo Users */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="premium-card bg-gradient-to-r from-indigo-900 to-indigo-800 border-indigo-500/30 p-12 text-center space-y-8"
      >
        <div className="w-20 h-20 bg-indigo-500/20 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-indigo-500/20">
          <Zap className="w-10 h-10 text-indigo-400" />
        </div>
        <div className="space-y-4">
          <h2 className="text-3xl font-black text-white uppercase tracking-tight">{t.landing.demo_cta_title}</h2>
          <p className="text-indigo-200 max-w-xl mx-auto font-medium">{t.landing.demo_cta_subtitle}</p>
        </div>
        <div className="flex justify-center pt-4">
          <Link href="/register" className="btn-premium bg-white text-indigo-900 hover:bg-indigo-50 min-w-[280px] h-16 text-sm shadow-2xl shadow-white/10 uppercase tracking-[0.2em] font-black">
            {t.landing.demo_register_btn}
            <ArrowUpRight className="w-5 h-5" />
          </Link>
        </div>
      </motion.div>

      {/* Recent Activity Mini List (Mocked) */}
      <div className="premium-card">
         <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t.dashboard.recent_activity}</h3>
            <button className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest hover:underline">{t.dashboard.view_all}</button>
         </div>
         <div className="space-y-1">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-white/[0.02] rounded-2xl transition-all group">
                 <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center overflow-hidden shrink-0">
                    <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 opacity-20" />
                 </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 dark:text-white truncate">{t.dashboard.activity_new}: {i === 0 ? 'Full Hair Style' : i === 1 ? 'Beard Trim' : 'Aura Facial'}</p>
                    <p className="text-xs text-slate-500 font-medium">{t.dashboard.activity_client}: {i === 0 ? 'Alice W.' : i === 1 ? 'Robert M.' : 'Jessica L.'} • {i+1} hours {t.dashboard.activity_ago}</p>
                  </div>
                 <div className="shrink-0 px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold rounded-lg uppercase tracking-wider">
                    {t.dashboard.verified}
                 </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
}
