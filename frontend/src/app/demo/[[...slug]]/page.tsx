"use client";
import React from 'react';
import { useParams } from 'next/navigation';
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
  Sparkles,
  Scissors,
  Plus,
  Send,
  Bell,
  Settings as SettingsIcon,
  CheckCircle2,
  Package,
  Megaphone,
  Bot,
  MessageSquare,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import { cn } from '@/lib/utils';
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

export default function DemoPage() {
  const { t } = useLanguage();
  const params = useParams();
  const slug = (params?.slug as string[])?.[0] || 'dashboard';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants: any = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
  };

  const renderContent = () => {
    switch(slug) {
      case 'dashboard': return <DashboardMockup t={t} containerVariants={containerVariants} itemVariants={itemVariants} />;
      case 'appointments': return <AppointmentsMockup t={t} itemVariants={itemVariants} />;
      case 'services': return <ServicesMockup t={t} itemVariants={itemVariants} />;
      case 'staff': return <StaffMockup t={t} itemVariants={itemVariants} />;
      case 'modules': return <ModulesMockup t={t} itemVariants={itemVariants} />;
      case 'shop': return <ShopMockup t={t} itemVariants={itemVariants} />;
      case 'marketing': return <MarketingMockup t={t} itemVariants={itemVariants} />;
      case 'clients': return <ClientsMockup t={t} itemVariants={itemVariants} />;
      case 'settings': return <SettingsMockup t={t} itemVariants={itemVariants} />;
      default: return <DashboardMockup t={t} containerVariants={containerVariants} itemVariants={itemVariants} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 py-6 md:py-10 px-4 font-sans relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={slug}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>

      {/* Demo Badge */}
      <div className="fixed top-24 right-10 z-[100] hidden xl:block">
        <div className="bg-amber-500 text-white px-6 py-2 rounded-full font-black uppercase tracking-widest text-[10px] shadow-2xl animate-bounce shadow-amber-500/20">
          Viewing Demo Mode • Read Only
        </div>
      </div>

      {/* CTA Section for Demo Users */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="premium-card bg-gradient-to-r from-indigo-900 to-indigo-800 border-indigo-500/30 p-12 text-center space-y-8 mt-20"
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
    </div>
  );
}

// --- MOCKUP COMPONENTS ---

function DashboardMockup({ t, containerVariants, itemVariants }: any) {
  const stats = { appointments: 145, revenue: 284500, clients: 1240 };
  return (
    <div className="space-y-10">
      <SectionHeader icon={<LayoutDashboard className="w-3.5 h-3.5" />} title={t.dashboard.title} subtitle={t.dashboard.subtitle} t={t} />
      
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: t.dashboard.active_apts, val: stats.appointments, icon: CalendarCheck, growth: '+12%', color: 'indigo' },
          { label: t.dashboard.clients_base, val: stats.clients, icon: Users, growth: '+5%', color: 'emerald' },
          { label: t.dashboard.revenue, val: stats.revenue, icon: DollarSign, growth: '+18%', color: 'amber' },
          { label: t.dashboard.average_bill, val: Math.round(stats.revenue / stats.appointments), icon: TrendingUp, growth: '+4%', color: 'rose' }
        ].map((item, i) => (
          <motion.div key={i} variants={itemVariants} className="premium-card relative overflow-hidden group">
            <div className={cn("absolute -right-4 -top-4 opacity-5 pointer-events-none group-hover:scale-110 group-hover:opacity-10 transition-all", `text-${item.color}-500`)}>
                <item.icon className="w-24 h-24" />
            </div>
            <div className="flex items-center justify-between mb-4">
                 <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-white/5", `text-${item.color}-500`)}>
                    <item.icon className="w-5 h-5" />
                 </div>
                 <span className={cn("px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest", `bg-${item.color}-500/10 text-${item.color}-500`)}>{item.growth}</span>
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white tracking-tighter leading-none mb-2">{item.val.toLocaleString()}</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{item.label}</p>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2 premium-card !p-8 h-[450px]">
           <div className="flex items-center justify-between mb-10">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">Revenue Analytics</h3>
                <div className="flex gap-2">
                    <div className="w-3 h-3 bg-indigo-500 rounded-full" />
                    <div className="w-3 h-3 bg-indigo-500/20 rounded-full" />
                </div>
           </div>
           <ResponsiveContainer width="100%" height="80%">
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" opacity={0.05} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} dy={10} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={5} fill="#6366f1" fillOpacity={0.1} />
              </AreaChart>
           </ResponsiveContainer>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
           <div className="premium-card !bg-indigo-600 !border-none p-10 text-white relative overflow-hidden shadow-2xl shadow-indigo-600/20">
              <BrainCircuit className="w-12 h-12 mb-6" />
              <h3 className="text-2xl font-black uppercase mb-3 leading-tight tracking-tighter">{t.dashboard.insights}</h3>
              <p className="text-indigo-100/80 font-medium leading-relaxed mb-10">{t.dashboard.insights_desc}</p>
              <button className="w-full flex items-center justify-between px-6 py-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all">
                Generate AI Audit <ArrowUpRight className="w-4 h-4" />
              </button>
           </div>
           <div className="premium-card !p-8">
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-100 dark:border-white/5 pb-4">Top Services</h4>
               <div className="space-y-4">
                  {[1,2,3].map(i => (
                    <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500"><Sparkles className="w-4 h-4" /></div>
                            <span className="text-sm font-bold text-slate-900 dark:text-white">Aura {i === 1 ? 'Facial' : i === 2 ? 'Haircut' : 'Spa'}</span>
                        </div>
                        <span className="text-xs font-black text-slate-400">{(65 + 10/(i+1)).toFixed(0)}%</span>
                    </div>
                  ))}
               </div>
           </div>
        </motion.div>
      </div>
    </div>
  );
}

function AppointmentsMockup({ t }: any) {
  return (
    <div className="space-y-10">
      <SectionHeader icon={<CalendarCheck className="w-3.5 h-3.5" />} title={t.appointments.title} subtitle={t.appointments.subtitle} t={t} />
      <div className="premium-card !p-0 overflow-hidden shadow-xl border-slate-200 dark:border-white/5">
        <div className="p-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Queue Management</h3>
            <div className="flex bg-slate-100 dark:bg-white/5 rounded-xl p-1">
                <button className="px-4 py-1.5 bg-white dark:bg-slate-700 rounded-lg text-xs font-bold shadow-sm">Today</button>
                <button className="px-4 py-1.5 text-xs text-slate-500 font-bold">Week</button>
            </div>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-white/[0.01] border-b border-slate-100 dark:border-white/5">
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Client Info</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Selected Service</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Specialist</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
            {[
                { name: 'Alice Walker', email: 'alice@tg.com', time: '14:30', service: 'Deep Tissue Massage', staff: 'Sarah L.', status: 'Confirmed' },
                { name: 'Bob Smith', email: 'bob99@tg.com', time: '15:45', service: 'Professional Haircut', staff: 'Mike V.', status: 'In Progress' },
                { name: 'Jessica Green', email: 'jessG@tg.com', time: '17:00', service: 'Gel Polish Manicure', staff: 'Anna D.', status: 'Waiting' },
                { name: 'David Ross', email: 'david@tg.com', time: '18:15', service: 'Aura Facial Treatment', staff: 'Sarah L.', status: 'Upcoming' },
                { name: 'Elena Petrova', email: 'elena@tg.com', time: '19:30', service: 'Spa Package Royal', staff: 'Mike V.', status: 'Upcoming' }
            ].map((apt, i) => (
              <tr key={i} className="hover:bg-slate-50 dark:hover:bg-white/[0.01] group">
                <td className="p-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center font-bold text-indigo-500 text-xs">{apt.name[0]}</div>
                        <div>
                            <p className="font-bold text-sm text-slate-900 dark:text-white leading-tight">{apt.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold">{apt.time} • Today</p>
                        </div>
                    </div>
                </td>
                <td className="p-6 text-sm font-medium text-slate-600 dark:text-slate-400">{apt.service}</td>
                <td className="p-6 text-sm font-bold text-indigo-500">{apt.staff}</td>
                <td className="p-6">
                    <span className={cn(
                        "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
                        apt.status === 'Confirmed' ? "bg-emerald-500/10 text-emerald-500" :
                        apt.status === 'In Progress' ? "bg-amber-500/10 text-amber-500" :
                        "bg-slate-200 dark:bg-white/10 text-slate-400"
                    )}>
                        {apt.status}
                    </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ServicesMockup({ t }: any) {
  return (
    <div className="space-y-10">
      <SectionHeader icon={<Scissors className="w-3.5 h-3.5" />} title={t.services.title} subtitle={t.services.subtitle} t={t} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
            { name: 'Aura Signature Massage', time: '90 min', price: '2,500', icon: Sparkles, color: 'indigo' },
            { name: 'Professional Hair Style', time: '45 min', price: '1,200', icon: Scissors, color: 'purple' },
            { name: 'Express Facial Care', time: '30 min', price: '900', icon: Zap, color: 'emerald' },
            { name: 'Royal Spa Treatment', time: '120 min', price: '4,500', icon: Sparkles, color: 'amber' },
            { name: 'Gentleman\'s Cut', time: '40 min', price: '1,000', icon: Scissors, color: 'rose' },
            { name: 'Gel Manicure Pro', time: '60 min', price: '1,500', icon: Sparkles, color: 'blue' }
        ].map((svc, i) => (
          <div key={i} className="premium-card group hover:scale-[1.02] transition-all cursor-pointer">
            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-8 shadow-inner rotate-3", `bg-${svc.color}-500/5 text-${svc.color}-500`)}>
              <svc.icon className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold mb-1 text-slate-900 dark:text-white uppercase tracking-tight">{svc.name}</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-6 mb-8">{svc.time} • Service Room #2</p>
            <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-white/5">
              <span className="font-black text-2xl text-indigo-600 dark:text-indigo-400 tracking-tighter">{svc.price} <span className="text-xs uppercase">SOM</span></span>
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StaffMockup({ t }: any) {
    return (
      <div className="space-y-10">
        <SectionHeader icon={<Users className="w-3.5 h-3.5" />} title={t.staff.title} subtitle={t.staff.subtitle} t={t} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
              { name: 'Sarah Lincoln', rank: 'Head Specialist', rating: 4.9, appointments: 84 },
              { name: 'Mike Volkov', rank: 'Senior Barber', rating: 4.8, appointments: 120 },
              { name: 'Anna Davitova', rank: 'Nail Artist', rating: 5.0, appointments: 65 },
              { name: 'Robert Miles', rank: 'Stylist Junior', rating: 4.7, appointments: 42 }
          ].map((stf, i) => (
            <div key={i} className="premium-card text-center flex flex-col items-center group relative overflow-hidden">
                <div className="absolute top-4 right-4 text-[9px] font-black text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded-lg tracking-widest uppercase">★ {stf.rating}</div>
              <div className="w-24 h-24 rounded-3xl bg-slate-100 dark:bg-white/5 mb-6 overflow-hidden relative group-hover:scale-105 transition-transform">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 opacity-20" />
                <div className="absolute inset-0 flex items-center justify-center text-3xl font-black text-indigo-500 opacity-10">{stf.name[0]}</div>
              </div>
              <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-1 uppercase tracking-tight">{stf.name}</h3>
              <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest mb-6 leading-none italic">{stf.rank}</p>
              
              <div className="w-full grid grid-cols-2 gap-4 pt-6 border-t border-slate-100 dark:border-white/5">
                <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Apts</p>
                    <p className="font-bold text-slate-900 dark:text-white">{stf.appointments}</p>
                </div>
                <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                    <span className="text-[9px] font-black text-emerald-500 uppercase">Active</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
}

function ModulesMockup({ t }: any) {
    return (
      <div className="space-y-10">
        <SectionHeader icon={<Zap className="w-3.5 h-3.5" />} title={t.modules.title} subtitle={t.modules.subtitle} t={t} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="premium-card relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center shrink-0 border border-blue-500/10">
                        <BrainCircuit className="w-8 h-8 text-blue-500" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black uppercase tracking-tight leading-none mb-2">{t.modules.ai}</h3>
                        <div className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[8px] font-black rounded uppercase tracking-widest inline-block">Active</div>
                    </div>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-10">{t.modules.ai_desc}</p>
                <div className="flex gap-4 pt-6 mt-auto border-t border-slate-100 dark:border-white/5">
                    <button className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-600/20">Configure</button>
                    <button className="w-14 h-14 bg-slate-100 dark:bg-white/5 rounded-2xl flex items-center justify-center text-slate-400"><LayoutDashboard className="w-4 h-4" /></button>
                </div>
            </div>

            <div className="premium-card relative overflow-hidden group opacity-80">
                <div className="absolute -right-4 -top-4 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center shrink-0 border border-purple-500/10">
                        <Package className="w-8 h-8 text-purple-500" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black uppercase tracking-tight leading-none mb-2">{t.modules.shop}</h3>
                        <div className="px-2 py-0.5 bg-slate-200 dark:bg-white/10 text-slate-400 text-[8px] font-black rounded uppercase tracking-widest inline-block">Pro Level</div>
                    </div>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-10">{t.modules.shop_desc}</p>
                <div className="pt-6 mt-auto border-t border-slate-100 dark:border-white/5">
                    <button className="w-full py-4 bg-slate-200 dark:bg-white/10 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest cursor-not-allowed">Upgrade to Unlock</button>
                </div>
            </div>

            <div className="premium-card relative overflow-hidden group">
                 <div className="absolute -right-4 -top-4 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center shrink-0 border border-indigo-500/10">
                        <Calendar className="w-8 h-8 text-indigo-500" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black uppercase tracking-tight leading-none mb-2">Booking</h3>
                        <div className="px-2 py-0.5 bg-indigo-500/10 text-indigo-500 text-[8px] font-black rounded uppercase tracking-widest inline-block font-mono">CORE</div>
                    </div>
                </div>
                 <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-10">Smart Telegram-based booking system with automated reminders.</p>
                <div className="pt-6 mt-auto border-t border-slate-100 dark:border-white/5">
                    <button className="w-full py-4 bg-slate-100 dark:bg-white/5 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest">Manage Flow</button>
                </div>
            </div>
        </div>
      </div>
    );
}

function ShopMockup({ t }: any) {
    return (
      <div className="space-y-10">
        <SectionHeader icon={<Package className="w-3.5 h-3.5" />} title={t.shop.title} subtitle={t.shop.subtitle} t={t} />
        <div className="flex items-center justify-between mb-8 px-2">
            <div className="flex gap-4">
                <button className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">All Items</button>
                <button className="px-6 py-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">Cosmetics</button>
            </div>
            <button className="flex items-center gap-2 px-6 py-2 border border-slate-100 dark:border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500">
                <Plus className="w-3.5 h-3.5" /> Add Stock
            </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
              { name: 'Aura Skin Serum', price: '2,800', stock: 12, cat: 'Face' },
              { name: 'Natural Hair Oil', price: '1,500', stock: 45, cat: 'Hair' },
              { name: 'Royal Spa Mist', price: '950', stock: 156, cat: 'Body' },
              { name: 'Premium Nail Kit', price: '3,200', stock: 8, cat: 'Nails' }
          ].map((item, i) => (
            <div key={i} className="premium-card !p-0 overflow-hidden group hover:scale-[1.02] transition-all">
              <div className="aspect-square bg-slate-100 dark:bg-white/5 border-b border-slate-100 dark:border-white/5 flex items-center justify-center">
                  <Package className="w-12 h-12 text-slate-200 dark:text-slate-800" />
              </div>
              <div className="p-8 space-y-4">
                <div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white uppercase tracking-tight">{item.name}</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.cat}</p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
                    <p className="text-xl font-black text-indigo-500 tracking-tighter">{item.price} SOM</p>
                    <div className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest bg-emerald-500/10 px-2 py-1 rounded-lg">Qty: {item.stock}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
}

function MarketingMockup({ t }: any) {
    return (
      <div className="space-y-10">
        <SectionHeader icon={<Send className="w-3.5 h-3.5" />} title={t.marketing.title} subtitle={t.marketing.subtitle} t={t} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 premium-card">
                <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-100 dark:border-white/5">
                    <div className="flex items-center gap-4">
                        <MessageSquare className="w-6 h-6 text-indigo-500" />
                        <h3 className="text-xl font-black uppercase tracking-tight">Active Broadcasts</h3>
                    </div>
                    <button className="p-3 bg-indigo-600 text-white rounded-xl shadow-xl shadow-indigo-600/20"><Plus className="w-5 h-5" /></button>
                </div>
                <div className="space-y-6">
                    {[
                        { title: 'New Year Mega Sale!', sent: 'Oct 15', clients: 1240, type: 'SMS + Bot' },
                        { title: 'Welcome Gift for New Users', sent: 'Oct 12', clients: 84, type: 'Automated' },
                        { title: 'Re-activation Campaign', sent: 'Oct 10', clients: 212, type: 'Push' }
                    ].map((cmp, i) => (
                        <div key={i} className="p-8 bg-slate-50 dark:bg-white/[0.03] rounded-[2rem] border border-slate-200/50 dark:border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 group">
                            <div className="space-y-1">
                                <h4 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight leading-none mb-1">{cmp.title}</h4>
                                <p className="text-xs text-slate-500 font-medium">Sent on {cmp.sent} to <span className="text-indigo-500 font-bold">{cmp.clients}</span> clients via {cmp.type}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="px-4 py-1.5 bg-indigo-500 text-white text-[10px] font-black rounded-xl uppercase tracking-widest">Delivered</span>
                                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-amber-500 transition-colors cursor-pointer"><PieChartIcon className="w-4 h-4" /></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="space-y-6">
                <div className="premium-card !bg-slate-900 dark:!bg-white/10 !border-none text-white p-10">
                    <Megaphone className="w-12 h-12 mb-6 opacity-30" />
                    <h3 className="text-2xl font-black uppercase tracking-tight mb-4">Broadcast Power</h3>
                    <p className="text-sm text-slate-400 font-medium leading-relaxed mb-10 italic">"Drive 40% more repeats by sending automated 'Miss You' rewards to clients who haven't visited in 30 days."</p>
                    <button className="w-full py-4 border border-white/10 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all">Setup Automation</button>
                </div>
            </div>
        </div>
      </div>
    );
}

function ClientsMockup({ t }: any) {
    return (
      <div className="space-y-10">
        <SectionHeader icon={<Users className="w-3.5 h-3.5" />} title={t.clients.title} subtitle={t.clients.subtitle} t={t} />
        <div className="premium-card !p-0 overflow-hidden shadow-2xl">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-white/[0.03] border-b border-slate-100 dark:border-white/5">
                <th className="p-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Client Info</th>
                <th className="p-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Loyalty Status</th>
                <th className="p-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Total Visits</th>
                <th className="p-8 text-[10px] font-black uppercase tracking-widest text-slate-400">LTV (Lifetime Value)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {[
                  { name: 'Alice Walker', phone: '+996 700 *** 12', visits: 12, ltv: '18,400', status: 'VIP' },
                  { name: 'Robert Miles', phone: '+996 550 *** 44', visits: 1, ltv: '1,200', status: 'New' },
                  { name: 'Jessica Green', phone: '+996 777 *** 99', visits: 8, ltv: '9,850', status: 'Loyal' },
                  { name: 'David Ross', phone: '+996 505 *** 01', visits: 0, ltv: '0', status: 'Potential' },
                  { name: 'Elena Petrova', phone: '+996 701 *** 55', visits: 5, ltv: '7,200', status: 'Regular' }
              ].map((clnt, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-white/[0.01] transition-colors">
                  <td className="p-8">
                      <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center font-black text-lg text-slate-400">{clnt.name[0]}</div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white uppercase tracking-tight">{clnt.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold">{clnt.phone}</p>
                          </div>
                      </div>
                  </td>
                  <td className="p-8">
                      <span className={cn(
                          "px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest",
                          clnt.status === 'VIP' ? "bg-amber-500/10 text-amber-600 border border-amber-500/10" :
                          clnt.status === 'Loyal' ? "bg-indigo-500/10 text-indigo-500" :
                          "bg-slate-100 dark:bg-white/10 text-slate-400"
                      )}>
                          {clnt.status}
                      </span>
                  </td>
                  <td className="p-8 text-sm font-bold text-slate-600 dark:text-slate-400">{clnt.visits} times</td>
                  <td className="p-8">
                      <p className="text-xl font-black text-indigo-600 dark:text-indigo-400 tracking-tighter">{clnt.ltv} <span className="text-[10px] uppercase">SOM</span></p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
}

function SettingsMockup({ t }: any) {
    return (
      <div className="space-y-10">
        <SectionHeader icon={<SettingsIcon className="w-3.5 h-3.5" />} title={t.settings.title} subtitle={t.settings.subtitle} t={t} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="premium-card space-y-10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500"><Bot className="w-6 h-6" /></div>
                    <h3 className="text-2xl font-black uppercase tracking-tight">Bot Engine Core</h3>
                </div>
                <div className="space-y-8">
                    <div className="p-8 bg-slate-100 dark:bg-black/20 rounded-[2rem] border border-slate-200 dark:border-white/5 flex items-center justify-between">
                        <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">BotFather Status</p>
                            <p className="text-sm font-bold text-emerald-500">API CONNECTED</p>
                        </div>
                        <CheckCircle2 className="w-8 h-8 text-emerald-500 opacity-20" />
                    </div>
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 block">Telegram Token</label>
                        <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-2xl border border-dashed border-slate-200 dark:border-white/10 text-xs font-mono text-slate-500 overflow-hidden">
                            7******************************************K
                        </div>
                    </div>
                    <button className="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-2xl shadow-indigo-600/30 opacity-50 cursor-not-allowed">
                        Save Changes (Read Only)
                    </button>
                </div>
            </div>
            
            <div className="space-y-8">
                <div className="premium-card">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500"><Bell className="w-6 h-6" /></div>
                        <h3 className="text-xl font-black uppercase tracking-tight">Admin Alerts</h3>
                    </div>
                    <div className="space-y-6">
                        {[
                            { label: 'New Appointment Notifications', active: true },
                            { label: 'Daily Revenue Summary', active: true },
                            { label: 'Client Retention Alerts', active: false }
                        ].map((alt, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-white/5 rounded-2xl">
                                <span className="text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-tight">{alt.label}</span>
                                <div className={cn("w-12 h-7 rounded-full relative transition-colors", alt.active ? "bg-emerald-500" : "bg-slate-300 dark:bg-white/10")}>
                                    <div className={cn("absolute top-1 w-5 h-5 bg-white rounded-full transition-all", alt.active ? "right-1" : "left-1")} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </div>
    );
}

function SectionHeader({ icon, title, subtitle, t }: any) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
      <div className="space-y-2">
        <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400 font-black tracking-[0.2em] text-[10px] uppercase mb-4">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/10 flex items-center justify-center">{icon}</div>
          {title} <span className="opacity-40 translate-x-1">/ Demo Flow</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 dark:text-white uppercase leading-none">
          {title}
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-500 font-medium max-w-xl">{subtitle}</p>
      </div>
      
      <div className="flex items-center gap-4 bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 px-6 py-4 rounded-[2rem] shadow-2xl backdrop-blur-3xl">
        <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center shadow-inner">
          <Sparkles className="w-6 h-6 text-indigo-500" />
        </div>
        <div className="text-left">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 leading-none">AuraSync Demo</p>
          <p className="text-sm font-black text-slate-900 dark:text-white uppercase">Symmetry Spa & Bot</p>
        </div>
      </div>
    </div>
  );
}
