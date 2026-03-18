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
  Sparkles,
  Scissors,
  Package,
  Send,
  Settings as SettingsIcon,
  Bell,
  CheckCircle2,
  Calendar,
  MessageSquare,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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

export default function DemoPage({ params }: { params: { slug?: string[] } }) {
  const { t } = useLanguage();
  const slug = params.slug?.[0] || 'dashboard';

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
          { label: t.dashboard.active_apts, val: stats.appointments, icon: CalendarCheck, growth: '+12%' },
          { label: t.dashboard.clients_base, val: stats.clients, icon: Users, growth: '+5%' },
          { label: t.dashboard.revenue, val: stats.revenue, icon: DollarSign, growth: '+18%' },
          { label: t.dashboard.average_bill, val: Math.round(stats.revenue / stats.appointments), icon: TrendingUp, growth: '+4%' }
        ].map((item, i) => (
          <motion.div key={i} variants={itemVariants} className="premium-card relative overflow-hidden group">
            <p className="text-3xl font-bold text-slate-900 dark:text-white tracking-tighter leading-none mb-2">{item.val.toLocaleString()}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</p>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 premium-card !p-8 h-[400px]">
           <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" opacity={0.05} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={4} fill="#6366f1" fillOpacity={0.1} />
              </AreaChart>
           </ResponsiveContainer>
        </div>
        <div className="space-y-6">
           <div className="premium-card !bg-indigo-600 !border-none p-8 text-white">
              <BrainCircuit className="w-10 h-10 mb-4" />
              <h3 className="text-xl font-black uppercase mb-2">{t.dashboard.insights}</h3>
              <p className="text-sm opacity-80">{t.dashboard.insights_desc}</p>
           </div>
        </div>
      </div>
    </div>
  );
}

function AppointmentsMockup({ t, itemVariants }: any) {
  return (
    <div className="space-y-10">
      <SectionHeader icon={<CalendarCheck className="w-3.5 h-3.5" />} title={t.appointments.title} subtitle={t.appointments.subtitle} t={t} />
      <div className="premium-card !p-0 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-white/[0.02] border-b border-slate-100 dark:border-white/5">
              <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">{t.appointments.table_datetime}</th>
              <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">{t.clients.title}</th>
              <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">{t.services.title}</th>
              <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">{t.appointments.table_status}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
            {[1,2,3,4,5].map(i => (
              <tr key={i} className="hover:bg-slate-50 dark:hover:bg-white/[0.01]">
                <td className="p-6 font-bold text-sm">Oct {10+i}, 1{i}:00</td>
                <td className="p-6 text-sm">Demo Client #{i}</td>
                <td className="p-6 text-sm">Premium Service A</td>
                <td className="p-6"><span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold rounded-lg uppercase">Confirmed</span></td>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1,2,3,4,5,6].map(i => (
          <div key={i} className="premium-card group hover:border-indigo-500/50">
            <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6">
              <Scissors className="w-6 h-6 text-indigo-500" />
            </div>
            <h3 className="text-lg font-bold mb-1">Service {i}</h3>
            <p className="text-sm text-slate-500 mb-4">60 min • Professional treatment</p>
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
              <span className="font-black text-indigo-600 dark:text-indigo-400">1,500 SOM</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => (
            <div key={i} className="premium-card text-center flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-white/5 mb-4 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 opacity-20" />
              </div>
              <h3 className="font-bold text-lg">Staff Member {i}</h3>
              <p className="text-xs text-indigo-500 font-bold uppercase tracking-widest mb-4">Senior Specialist</p>
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 text-[8px] font-black rounded uppercase">Active</span>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="premium-card flex gap-6">
                <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center shrink-0">
                    <BrainCircuit className="w-8 h-8 text-blue-500" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-xl font-bold">{t.modules.ai}</h3>
                    <p className="text-sm text-slate-500">{t.modules.ai_desc}</p>
                    <div className="pt-4 flex items-center gap-2 text-emerald-500 font-bold text-xs">
                        <CheckCircle2 className="w-4 h-4" /> Enabled
                    </div>
                </div>
            </div>
            <div className="premium-card flex gap-6">
                <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center shrink-0">
                    <Package className="w-8 h-8 text-purple-500" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-xl font-bold">{t.modules.shop}</h3>
                    <p className="text-sm text-slate-500">{t.modules.shop_desc}</p>
                    <div className="pt-4 flex items-center gap-2 text-slate-400 font-bold text-xs">
                        Disabled (Pro feature)
                    </div>
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => (
            <div key={i} className="premium-card !p-0 overflow-hidden">
              <div className="aspect-square bg-slate-100 dark:bg-white/5" />
              <div className="p-6 space-y-2">
                <h3 className="font-bold">Product Item #{i}</h3>
                <p className="text-sm text-indigo-500 font-black">2,500 SOM</p>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">15 in stock</div>
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
        <div className="premium-card">
            <div className="flex items-center gap-3 mb-8">
                <MessageSquare className="w-5 h-5 text-indigo-500" />
                <h3 className="text-lg font-bold">Campaign History</h3>
            </div>
            <div className="space-y-4">
                {[1,2].map(i => (
                    <div key={i} className="p-6 bg-slate-50 dark:bg-white/5 rounded-2xl flex justify-between items-center">
                        <div>
                            <p className="font-bold">Season Promotion Announcement</p>
                            <p className="text-xs text-slate-500 font-medium">Sent to 1,240 clients • Oct {i}, 2026</p>
                        </div>
                        <span className="px-3 py-1 bg-indigo-500/10 text-indigo-500 text-[10px] font-black rounded-lg">DELIVERED</span>
                    </div>
                ))}
            </div>
        </div>
      </div>
    );
}

function ClientsMockup({ t }: any) {
    return (
      <div className="space-y-10">
        <SectionHeader icon={<Users className="w-3.5 h-3.5" />} title={t.clients.title} subtitle={t.clients.subtitle} t={t} />
        <div className="premium-card !p-0 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-white/[0.02] border-b border-slate-100 dark:border-white/5">
                <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">Client Name</th>
                <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Visits</th>
                <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Spent</th>
                <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">Last Seen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {[1,2,3,4,5].map(i => (
                <tr key={i}>
                  <td className="p-6 font-bold truncate">Premium User {i}</td>
                  <td className="p-6 text-sm">12 times</td>
                  <td className="p-6 text-sm font-black text-indigo-500">18,400 SOM</td>
                  <td className="p-6 text-xs text-slate-500">2 days ago</td>
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="premium-card space-y-6">
                <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-indigo-500" />
                    <h3 className="font-bold">Bot Configuration</h3>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 block">BotFather Token</label>
                        <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/10 text-xs font-mono truncate">
                            712839123:AAH_Demo_Mock_Token_412312
                        </div>
                    </div>
                    <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-600/20 opacity-50 cursor-not-allowed">
                        Update Bot (Disabled in Demo)
                    </button>
                </div>
            </div>
            <div className="premium-card">
                 <div className="flex items-center gap-3 mb-6">
                    <Bell className="w-5 h-5 text-indigo-500" />
                    <h3 className="font-bold">Notifications</h3>
                </div>
                <div className="space-y-4">
                    {[1,2,3].map(i => (
                        <div key={i} className="flex items-center justify-between p-3">
                            <span className="text-sm font-medium">Alert Type #{i}</span>
                            <div className="w-10 h-6 bg-indigo-600 rounded-full relative">
                                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    );
}

function SectionHeader({ icon, title, subtitle, t }: any) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold tracking-wider text-[10px] uppercase mb-2">
          {icon}
          {title} (Demo)
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tighter text-slate-900 dark:text-white uppercase">
          {title}
        </h1>
        <p className="text-sm text-slate-500 font-medium">{subtitle}</p>
      </div>
      
      <div className="flex items-center gap-3 bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 px-4 py-2 rounded-xl shadow-sm backdrop-blur-xl">
        <div className="w-8 h-8 bg-indigo-500/10 rounded-lg flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-indigo-500" />
        </div>
        <div className="text-left">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Demo Mode</p>
          <p className="text-xs font-bold text-slate-900 dark:text-white">AuraSync Beauty & Spa</p>
        </div>
      </div>
    </div>
  );
}
