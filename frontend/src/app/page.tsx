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
  Smartphone,
  Moon,
  Sun,
  Bot
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage, Locale } from '@/context/LanguageContext'; // Added Locale
import { useAuth } from '@/components/AuthProvider'; // Added useAuth
import { cn } from '@/lib/utils';
import DemoModal from '@/components/DemoModal'; // Added DemoModal

export default function LandingPage() {
  const { t, locale, setLocale } = useLanguage(); // Added setLocale
  const { theme, toggleTheme } = useAuth(); // Added theme and toggleTheme
  const [showDemoModal, setShowDemoModal] = React.useState(false); // Added showDemoModal state

  const fadeIn: any = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" }
    })
  };

  return (
    <div className="bg-main text-main min-h-screen font-sans selection:bg-indigo-500/30 selection:text-indigo-200 transition-colors">
      <DemoModal isOpen={showDemoModal} onClose={() => setShowDemoModal(false)} />
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-glass backdrop-blur-xl border-b border-border">
         <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
               <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20 group-hover:scale-110 transition-transform">
                  <Zap className="w-6 h-6 text-white" />
               </div>
               <span className="text-xl font-black tracking-tighter uppercase italic text-slate-900 dark:text-white">AuraSync</span>
            </Link>
            
            <div className="hidden lg:flex items-center gap-10 text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
               <a href="#features" className="hover:text-indigo-500 transition-colors">{t.landing.features_title}</a>
               <a href="#pricing" className="hover:text-indigo-500 transition-colors">{t.landing.pricing_title}</a>
               <a href="#demo" className="hover:text-indigo-500 transition-colors uppercase tracking-widest">{t.landing.view_demo}</a>
            </div>

            <div className="flex items-center gap-6">
               <div className="flex items-center gap-3 pr-6 border-r border-slate-200 dark:border-white/10">
                  <button onClick={toggleTheme} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-indigo-500 transition-all border border-transparent hover:border-slate-200 dark:hover:border-white/10 shadow-sm">
                     {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                  </button>
                  <div className="relative group">
                    <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select 
                      value={locale} 
                      onChange={(e) => setLocale(e.target.value as Locale)}
                      className="h-10 bg-slate-100 dark:bg-white/5 border border-transparent hover:border-slate-200 dark:hover:border-white/10 rounded-xl pl-8 pr-3 text-[10px] font-black text-slate-600 dark:text-slate-400 outline-none uppercase tracking-widest cursor-pointer transition-all shadow-sm"
                    >
                      <option value="ru">RU</option>
                      <option value="en">EN</option>
                      <option value="ky">KY</option>
                      <option value="uz">UZ</option>
                    </select>
                  </div>
               </div>

               <div className="flex items-center gap-4">
                  <Link href="/login" className="hidden sm:block text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-indigo-500 transition-colors">
                     {t.auth.login_btn}
                  </Link>
                  <Link href="/register" className="btn-premium btn-premium-primary">
                     {t.auth.join}
                  </Link>
               </div>
            </div>
         </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 md:pt-56 md:pb-40 overflow-hidden">
         {/* Background Orbs */}
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 opacity-50 dark:opacity-100">
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-600/15 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3" />
         </div>
 
         <div className="max-w-7xl mx-auto px-6 text-center space-y-10">
            <motion.div 
               custom={0} initial="hidden" animate="visible" variants={fadeIn}
               className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]"
            >
               <Sparkles className="w-3.5 h-3.5" />
               The Future of Business Control
            </motion.div>
 
            <motion.h1 
               custom={1} initial="hidden" animate="visible" variants={fadeIn}
               className="text-5xl md:text-8xl font-black tracking-tight leading-[0.9] max-w-5xl mx-auto text-slate-900 dark:text-white"
            >
               {t.landing.hero_title.split(' ').map((word, i) => {
                 const isAccent = (locale === 'ru' && i >= 3) || (locale === 'en' && i >= 3) || (locale === 'ky' && i >= 3) || (locale === 'uz' && i >= 3);
                 return (
                   <span key={i} className={cn(isAccent && "text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500")}>{word} </span>
                 );
               })}
            </motion.h1>
 
            <motion.p 
               custom={2} initial="hidden" animate="visible" variants={fadeIn}
               className="text-lg md:text-xl text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed"
            >
               {t.landing.hero_subtitle}
            </motion.p>
 
            <motion.div 
               custom={3} initial="hidden" animate="visible" variants={fadeIn}
               className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8"
            >
               <Link href="/register" className="btn-premium btn-premium-primary min-w-[220px] h-16 text-base shadow-2xl shadow-indigo-600/30">
                  {t.auth.register_btn}
                  <ArrowRight className="w-5 h-5" />
               </Link>
               <button 
                  onClick={() => setShowDemoModal(true)}
                  className="btn-premium btn-premium-secondary min-w-[220px] h-16 text-base backdrop-blur-md"
               >
                  <Smartphone className="w-5 h-5" />
                  {t.landing.view_demo}
               </button>
            </motion.div>
 
            {/* Visual Mockup Placeholder */}
            <motion.div 
               custom={4} initial="hidden" animate="visible" variants={fadeIn}
               className="pt-20 relative group"
            >
               <div className="absolute inset-0 bg-indigo-500/10 rounded-[3rem] blur-3xl group-hover:bg-indigo-500/20 transition-all duration-1000" />
               <div className="relative border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-slate-900/50 rounded-[3rem] p-3 backdrop-blur-3xl shadow-2xl overflow-hidden aspect-[16/9] group-hover:border-indigo-500/30 transition-all">
                  <img 
                    src="/aurasync_dashboard_mockup_1773780044407.png" 
                    alt="AuraSync Dashboard Preview" 
                    className="w-full h-full object-cover rounded-[2.2rem] shadow-2xl"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent opacity-60 dark:opacity-100" />
                  
                  {/* Floating Stat Cards for "Information" */}
                  <div className="absolute top-10 left-10 space-y-4 hidden md:block">
                     <motion.div 
                        initial={{ x: -50, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        className="bg-white dark:bg-slate-900/80 border border-indigo-500/20 rounded-2xl p-4 backdrop-blur-xl shadow-xl flex items-center gap-4"
                     >
                        <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                           <TrendingUp className="w-5 h-5 text-emerald-500" />
                        </div>
                        <div className="text-left">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Weekly Revenue</p>
                           <p className="text-lg font-black text-slate-900 dark:text-white leading-none">+145,200 Сом</p>
                        </div>
                     </motion.div>
                     <motion.div 
                        initial={{ x: -50, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white dark:bg-slate-900/80 border border-indigo-500/20 rounded-2xl p-4 backdrop-blur-xl shadow-xl flex items-center gap-4"
                     >
                        <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center">
                           <Users className="w-5 h-5 text-indigo-500" />
                        </div>
                        <div className="text-left">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">New Clients</p>
                           <p className="text-lg font-black text-slate-900 dark:text-white leading-none">84 This Week</p>
                        </div>
                     </motion.div>
                  </div>
               </div>
            </motion.div>
         </div>
      </section>

      {/* Interactive Showcase / Demo Flow */}
      <section id="demo" className="py-20 md:py-32 relative">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20 space-y-4">
               <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-500 text-[10px] font-black uppercase tracking-widest border border-indigo-500/20"
               >
                  <Bot className="w-3.5 h-3.5" />
                  Live Demo Tutorial
               </motion.div>
               <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tight">How it <span className="text-indigo-600 italic">Works</span></h2>
               <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xl mx-auto">Start your automation journey in under 5 minutes with our streamlined integration process.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[
                  { 
                    step: "01", 
                    icon: MessageSquare, 
                    title: "Connect BotFather", 
                    desc: "Simply paste your Telegram Bot Token. No coding, no servers, just plug and play.",
                    bg: "bg-blue-500/5",
                    text: "text-blue-500"
                  },
                  { 
                    step: "02", 
                    icon: Sparkles, 
                    title: "AI Configuration", 
                    desc: "Train your AI assistant with your business details to handle client inquiries 24/7.",
                    bg: "bg-purple-500/5",
                    text: "text-purple-500"
                  },
                  { 
                    step: "03", 
                    icon: Zap, 
                    title: "Go Live", 
                    desc: "Share your bot link and watch as clients book, pay, and interact with your brand.",
                    bg: "bg-amber-500/5",
                    text: "text-amber-500"
                  }
               ].map((item, i) => (
                  <motion.div 
                     key={i}
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     transition={{ delay: i * 0.1 }}
                     className="premium-card relative group hover:border-indigo-500/30 overflow-hidden"
                  >
                     <div className="absolute -right-4 -top-4 text-6xl font-black text-slate-100 dark:text-white/[0.02] group-hover:text-indigo-500/[0.05] transition-colors">{item.step}</div>
                     <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-inner", item.bg, item.text)}>
                        <item.icon className="w-7 h-7" />
                     </div>
                     <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">{item.title}</h3>
                     <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{item.desc}</p>
                     
                     <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Learn More</span>
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                     </div>
                  </motion.div>
               ))}
            </div>

            <motion.div 
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               className="mt-20 premium-card bg-indigo-600 !p-1 flex flex-col md:flex-row items-center gap-10 overflow-hidden"
            >
               <div className="flex-1 p-10 md:p-14 space-y-6 text-white text-center md:text-left">
                  <h3 className="text-3xl md:text-4xl font-black leading-tight uppercase tracking-tight">Ready to see <br/> the <span className="text-indigo-200">real power?</span></h3>
                  <p className="text-indigo-100 font-medium text-lg leading-relaxed">Join 200+ businesses who automated their workflow this week. No commitment required.</p>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                     <button onClick={() => setShowDemoModal(true)} className="btn-premium bg-white text-indigo-600 hover:bg-indigo-50 tracking-widest text-xs min-w-[200px]">
                        Watch Video Demo
                     </button>
                     <Link href="/register" className="btn-premium bg-indigo-500 text-white hover:bg-indigo-400 border border-white/10 tracking-widest text-xs min-w-[200px]">
                        Try For Free
                     </Link>
                  </div>
               </div>
               <div className="w-full md:w-1/2 aspect-video bg-black/20 backdrop-blur-3xl group relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                     <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 group-hover:scale-110 transition-transform cursor-pointer">
                        <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[15px] border-l-white border-b-[10px] border-b-transparent ml-1" />
                     </div>
                  </div>
                  <img src="/aurasync_dashboard_mockup_1773780044407.png" className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700" alt="Video Placeholder" />
               </div>
            </motion.div>
         </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-40 bg-slate-50 dark:bg-white/[0.02] backdrop-blur-3xl border-y border-slate-200 dark:border-white/5 transition-colors">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-24 space-y-4">
               <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{t.landing.features_title}</h2>
               <div className="w-24 h-1.5 bg-indigo-600 mx-auto rounded-full" />
            </div>
 
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
               {[
                  { icon: Calendar, title: t.landing.feature_booking, desc: t.landing.feature_booking_desc, color: 'text-indigo-500' },
                  { icon: BrainCircuit, title: t.landing.feature_ai, desc: t.landing.feature_ai_desc, color: 'text-purple-500' },
                  { icon: TrendingUp, title: t.landing.feature_analytics, desc: t.landing.feature_analytics_desc, color: 'text-emerald-500' }
               ].map((feat, i) => (
                  <motion.div 
                     key={i}
                     initial={{ opacity: 0, y: 30 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: i * 0.2 }}
                     className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-10 hover:bg-slate-50 dark:hover:bg-white/10 hover:-translate-y-2 transition-all group shadow-sm"
                  >
                     <div className={cn("w-16 h-16 bg-slate-100 dark:bg-white/5 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-inner", feat.color)}>
                        <feat.icon className="w-8 h-8" />
                     </div>
                     <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">{feat.title}</h3>
                     <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{feat.desc}</p>
                  </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-40 relative">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-24 space-y-4">
               <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{t.landing.pricing_title}</h2>
               <p className="text-slate-500 dark:text-slate-400 font-medium">{t.landing.pricing_subtitle}</p>
            </div>
 
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
               {/* Trial Plan */}
               <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[3rem] p-10 space-y-8 flex flex-col shadow-sm"
               >
                  <div className="space-y-4">
                     <h3 className="text-xl font-bold text-slate-400 uppercase tracking-widest">{t.landing.plan_trial}</h3>
                     <div className="flex items-end gap-2">
                        <span className="text-5xl font-black text-slate-900 dark:text-white">{t.landing.plan_trial_price}</span>
                        <span className="text-slate-500 font-bold mb-1 uppercase tracking-widest">{t.common.currency} / 7 {t.landing.period_day}</span>
                     </div>
                  </div>
                  <ul className="space-y-4 flex-1">
                     {t.landing.features_trial.map((item: string, i: number) => (
                        <li key={i} className="flex items-center gap-3 text-slate-600 dark:text-slate-300 font-medium">
                           <ShieldCheck className="w-5 h-5 text-emerald-500" />
                           {item}
                        </li>
                     ))}
                  </ul>
                  <Link href="/register" className="w-full py-5 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-900 dark:text-white rounded-[1.5rem] font-bold text-center transition-all uppercase tracking-widest text-xs border border-slate-200 dark:border-white/5">
                     {t.landing.btn_trial}
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
                        <h3 className="text-xl font-bold text-indigo-100 uppercase tracking-widest">{t.landing.plan_pro}</h3>
                        <div className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{t.landing.most_popular}</div>
                     </div>
                     <div className="flex items-end gap-2">
                        <span className="text-5xl font-black text-white">{t.landing.plan_pro_price}</span>
                        <span className="text-indigo-200 font-bold mb-1 uppercase tracking-widest">{t.common.currency} / {t.landing.period_month}</span>
                     </div>
                  </div>
                  <ul className="space-y-4 flex-1 relative z-10">
                     {t.landing.features_pro.map((item: string, i: number) => (
                        <li key={i} className="flex items-center gap-3 text-white font-medium">
                           <ShieldCheck className="w-5 h-5 text-indigo-200" />
                           {item}
                        </li>
                     ))}
                  </ul>
                  <Link href="/register" className="w-full py-5 bg-white text-indigo-600 rounded-[1.5rem] font-black text-center transition-all uppercase tracking-widest text-xs relative z-10 shadow-xl shadow-black/10">
                     {t.landing.btn_pro}
                  </Link>
               </motion.div>
            </div>
         </div>
      </section>
 
      {/* Footer */}
      <footer className="py-20 border-t border-slate-200 dark:border-white/5 transition-colors">
         <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="space-y-4 text-center md:text-left">
               <div className="flex items-center gap-2.5 justify-center md:justify-start">
                  <Zap className="w-6 h-6 text-indigo-600" />
                  <span className="text-xl font-black tracking-tighter uppercase italic text-slate-900 dark:text-white">AuraSync</span>
               </div>
               <p className="text-slate-500 dark:text-slate-500 font-medium text-sm">© 2024 AuraSync Platform. Built for the modern business.</p>
            </div>
            <div className="flex gap-10 text-xs font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
               <a href="#" className="hover:text-indigo-500 transition-colors">Privacy</a>
               <a href="#" className="hover:text-indigo-500 transition-colors">Terms</a>
               <a href="#" className="hover:text-indigo-500 transition-colors">Support</a>
            </div>
         </div>
      </footer>
    </div>
  );
}
