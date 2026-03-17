"use client";
import React from 'react';
import Link from 'next/link';
import { 
  Zap, 
  Calendar, 
  TrendingUp, 
  Users, 
  ChevronRight, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  BrainCircuit,
  MessageSquare,
  Globe,
  Smartphone
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';

export default function LandingPage() {
  const { t } = useLanguage();

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" }
    })
  };

  return (
    <div className="bg-[#020617] text-white min-h-screen font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5">
         <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
               <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20 group-hover:scale-110 transition-transform">
                  <Zap className="w-6 h-6 text-white" />
               </div>
               <span className="text-xl font-black tracking-tighter uppercase italic">AuraSync</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-10 text-sm font-bold uppercase tracking-widest text-slate-400">
               <a href="#features" className="hover:text-white transition-colors">Features</a>
               <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
               <a href="#demo" className="hover:text-white transition-colors">Demo</a>
            </div>

            <div className="flex items-center gap-4">
               <Link href="/login" className="hidden sm:block text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors px-4">
                  Login
               </Link>
               <Link href="/register" className="bg-white text-slate-950 px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-slate-200 transition-all shadow-xl shadow-white/5 active:scale-95">
                  {t.auth.join}
               </Link>
            </div>
         </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 md:pt-56 md:pb-40 overflow-hidden">
         {/* Background Orbs */}
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10">
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-600/15 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3" />
         </div>

         <div className="max-w-7xl mx-auto px-6 text-center space-y-10">
            <motion.div 
               custom={0} initial="hidden" animate="visible" variants={fadeIn}
               className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]"
            >
               <Sparkles className="w-3.5 h-3.5" />
               The Future of Business Control
            </motion.div>

            <motion.h1 
               custom={1} initial="hidden" animate="visible" variants={fadeIn}
               className="text-5xl md:text-8xl font-black tracking-tight leading-[0.9] max-w-5xl mx-auto"
            >
               {t.landing.hero_title.split(' ').map((word, i) => (
                 <span key={i} className={cn(i > 2 && "text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400")}>{word} </span>
               ))}
            </motion.h1>

            <motion.p 
               custom={2} initial="hidden" animate="visible" variants={fadeIn}
               className="text-lg md:text-xl text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed"
            >
               {t.landing.hero_subtitle}
            </motion.p>

            <motion.div 
               custom={3} initial="hidden" animate="visible" variants={fadeIn}
               className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
               <Link href="/register" className="w-full sm:w-auto px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-indigo-600/40 flex items-center justify-center gap-2">
                  {t.landing.get_started}
                  <ArrowRight className="w-5 h-5" />
               </Link>
               <Link href="#demo" className="w-full sm:w-auto px-10 py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                  {t.landing.view_demo}
               </Link>
            </motion.div>

            {/* Visual Mockup Placeholder */}
            <motion.div 
               custom={4} initial="hidden" animate="visible" variants={fadeIn}
               className="pt-20 relative group"
            >
               <div className="absolute inset-0 bg-indigo-500/10 rounded-[3rem] blur-3xl group-hover:bg-indigo-500/20 transition-all duration-1000" />
               <div className="relative border border-white/10 bg-slate-900/50 rounded-[2rem] p-4 md:p-8 backdrop-blur-3xl shadow-2xl overflow-hidden aspect-[16/9] flex items-center justify-center">
                  <div className="grid grid-cols-3 gap-4 w-full h-full opacity-40">
                     <div className="bg-indigo-500/10 rounded-2xl border border-white/5" />
                     <div className="bg-indigo-500/20 rounded-2xl border border-white/5 col-span-2" />
                     <div className="bg-indigo-500/20 rounded-2xl border border-white/5 col-span-2" />
                     <div className="bg-indigo-500/10 rounded-2xl border border-white/5" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                     <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center animate-pulse">
                        <Zap className="w-10 h-10 text-white" />
                     </div>
                  </div>
               </div>
            </motion.div>
         </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-40 bg-white/5 backdrop-blur-3xl border-y border-white/5">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-24 space-y-4">
               <h2 className="text-4xl md:text-5xl font-black">{t.landing.features_title}</h2>
               <div className="w-24 h-1.5 bg-indigo-600 mx-auto rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
               {[
                  { icon: Calendar, title: t.landing.feature_booking, desc: t.landing.feature_booking_desc, color: 'text-indigo-400' },
                  { icon: BrainCircuit, title: t.landing.feature_ai, desc: t.landing.feature_ai_desc, color: 'text-purple-400' },
                  { icon: TrendingUp, title: t.landing.feature_analytics, desc: t.landing.feature_analytics_desc, color: 'text-emerald-400' }
               ].map((feat, i) => (
                  <motion.div 
                     key={i}
                     initial={{ opacity: 0, y: 30 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: i * 0.2 }}
                     className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-10 hover:bg-white/[0.04] hover:-translate-y-2 transition-all group"
                  >
                     <div className={cn("w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform", feat.color)}>
                        <feat.icon className="w-8 h-8" />
                     </div>
                     <h3 className="text-2xl font-bold mb-4">{feat.title}</h3>
                     <p className="text-slate-400 font-medium leading-relaxed">{feat.desc}</p>
                  </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-40 relative">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-24 space-y-4">
               <h2 className="text-4xl md:text-5xl font-black">{t.landing.pricing_title}</h2>
               <p className="text-slate-400 font-medium">{t.landing.pricing_subtitle}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
               {/* Trial Plan */}
               <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="bg-white/[0.02] border border-white/10 rounded-[3rem] p-10 space-y-8 flex flex-col"
               >
                  <div className="space-y-4">
                     <h3 className="text-xl font-bold text-slate-400 uppercase tracking-widest">Free Trial</h3>
                     <div className="flex items-end gap-2">
                        <span className="text-5xl font-black">0</span>
                        <span className="text-slate-500 font-bold mb-1 uppercase tracking-widest">{t.common.currency} / 7 days</span>
                     </div>
                  </div>
                  <ul className="space-y-4 flex-1">
                     {['Smart Booking', 'Client Database', 'Standard Dashboards', 'Admin Notifications'].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-slate-300 font-medium">
                           <ShieldCheck className="w-5 h-5 text-emerald-500" />
                           {item}
                        </li>
                     ))}
                  </ul>
                  <Link href="/register" className="w-full py-5 bg-white/5 hover:bg-white/10 text-white rounded-[1.5rem] font-bold text-center transition-all uppercase tracking-widest text-xs">
                     Start Free Trial
                  </Link>
               </motion.div>

               {/* Pro Plan */}
               <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="bg-indigo-600 rounded-[3rem] p-10 space-y-8 flex flex-col shadow-2xl shadow-indigo-600/30 border border-white/10 relative overflow-hidden group"
               >
                  <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                  <div className="space-y-4 relative z-10">
                     <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-indigo-100 uppercase tracking-widest">Pro License</h3>
                        <div className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Most Popular</div>
                     </div>
                     <div className="flex items-end gap-2">
                        <span className="text-5xl font-black">1500</span>
                        <span className="text-indigo-200 font-bold mb-1 uppercase tracking-widest">{t.common.currency} / month</span>
                     </div>
                  </div>
                  <ul className="space-y-4 flex-1 relative z-10">
                     {['Full AI Ecosystem', 'Inventory/Shop Modules', 'Priority Support', 'Custom Branding', 'Advanced Analytics'].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-white font-medium">
                           <ShieldCheck className="w-5 h-5 text-indigo-200" />
                           {item}
                        </li>
                     ))}
                  </ul>
                  <Link href="/register" className="w-full py-5 bg-white text-indigo-600 rounded-[1.5rem] font-black text-center transition-all uppercase tracking-widest text-xs relative z-10 shadow-xl shadow-black/10">
                     Get Full Access
                  </Link>
               </motion.div>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5">
         <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="space-y-4 text-center md:text-left">
               <div className="flex items-center gap-2.5 justify-center md:justify-start">
                  <Zap className="w-6 h-6 text-indigo-600" />
                  <span className="text-xl font-black tracking-tighter uppercase italic">AuraSync</span>
               </div>
               <p className="text-slate-500 font-medium text-sm">© 2024 AuraSync Platform. Built for the modern business.</p>
            </div>
            <div className="flex gap-10 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
               <a href="#" className="hover:text-indigo-400 transition-colors">Privacy</a>
               <a href="#" className="hover:text-indigo-400 transition-colors">Terms</a>
               <a href="#" className="hover:text-indigo-400 transition-colors">Support</a>
            </div>
         </div>
      </footer>
    </div>
  );
}
