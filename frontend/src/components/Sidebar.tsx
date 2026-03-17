"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { useLanguage, Locale } from '@/context/LanguageContext';
import { 
  LayoutDashboard, 
  CalendarCheck, 
  Sparkles, 
  Users, 
  Settings, 
  LogOut,
  Bot,
  Menu,
  X,
  Sun,
  Moon,
  Zap,
  ShieldCheck,
  Globe,
  UserSquare,
  Package,
  ShoppingBag,
  Megaphone
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function Sidebar() {
  const pathname = usePathname();
  const isDemo = pathname === '/demo' || pathname?.startsWith('/demo/');
  const { user, business, signOut, theme, toggleTheme, trialDaysLeft, isAdmin } = useAuth();
  const { locale, setLocale, t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { name: t.common.dashboard, href: isDemo ? '/demo' : '/dashboard', icon: LayoutDashboard },
    { name: t.common.appointments, href: isDemo ? '/demo/appointments' : '/appointments', icon: CalendarCheck },
    { name: t.common.services, href: isDemo ? '/demo/services' : '/services', icon: Sparkles },
    { name: t.staff.title, href: isDemo ? '/demo/staff' : '/staff', icon: UserSquare },
    { name: t.modules?.title || 'Modules', href: isDemo ? '/demo/modules' : '/modules', icon: Package },
    ...(business?.modules_config?.shop || isDemo ? [{ name: t.modules?.shop || 'Shop', href: isDemo ? '/demo/shop' : '/shop', icon: ShoppingBag }] : []),
    ...(business?.modules_config?.marketing || isDemo ? [{ name: t.marketing?.title || 'Marketing', href: isDemo ? '/demo/marketing' : '/marketing', icon: Megaphone }] : []),
    { name: t.common.clients, href: isDemo ? '/demo/clients' : '/clients', icon: Users },
    { name: t.common.settings, href: isDemo ? '/demo/settings' : '/settings', icon: Settings },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[var(--bg-card)] lg:bg-transparent">
      {/* Логотип */}
      <div className="p-8">
        <Link href={isDemo ? "/demo" : "/dashboard"} className="flex items-center gap-4 group" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all border border-white/10 group-hover:-rotate-6">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="font-bold text-2xl tracking-tighter text-slate-900 dark:text-white uppercase leading-none">Aura<span className="text-indigo-500">Sync</span></span>
            <p className="text-[10px] text-slate-400 font-semibold mt-1 opacity-70 italic tracking-widest">{isDemo ? 'Demo Mode' : (business?.name || 'Smart Beauty')}</p>
          </div>
        </Link>
      </div>

      {/* Навигация */}
      <nav className="flex-1 px-6 space-y-2 overflow-y-auto pt-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "flex items-center gap-4 px-5 py-4 rounded-xl text-sm font-semibold transition-all duration-300 group",
                isActive 
                  ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shadow-sm" 
                  : "text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-white/5"
              )}
            >
              <item.icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", isActive ? "text-indigo-500" : "text-slate-400")} />
              <span className="tracking-wide">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Подвал сайдбара */}
      <div className="p-6 border-t border-slate-200 dark:border-white/5 space-y-6">
        {/* Trial Status Sidebar Item */}
        <div className="px-2">
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-white/5 dark:to-transparent rounded-2xl p-4 relative overflow-hidden group shadow-inner">
            <div className="flex items-center justify-between mb-3 relative z-10">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                {trialDaysLeft > 0 ? t.common.access : t.common.trial_expired}
              </span>
              <span className="text-[11px] font-bold text-indigo-600 bg-indigo-500/10 px-2 py-0.5 rounded-lg">
                {trialDaysLeft > 0 ? `${trialDaysLeft} ${t.common.days_left}` : t.common.trial_expired}
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mb-4 relative z-10">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-1000" 
                style={{ width: `${(trialDaysLeft / 7) * 100}%` }} 
              />
            </div>
            <Link 
              href="/billing" 
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-indigo-600 text-white text-[11px] font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-md uppercase tracking-wider"
            >
              <Zap className="w-3.5 h-3.5" /> {t.common.upgrade}
            </Link>
          </div>
        </div>

        {/* Инструменты: Режим + Язык */}
        {/* Инструменты: Режим + Язык (Минималистично) */}
        <div className="px-2">
           <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5">
              <button 
                 onClick={toggleTheme}
                 className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white dark:hover:bg-white/5 text-slate-500 hover:text-indigo-500 transition-all shadow-sm hover:shadow-md border border-transparent hover:border-slate-100 dark:hover:border-white/10"
              >
                 {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </button>
              
              <div className="flex-1 relative group">
                <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none group-focus-within:text-indigo-500 transition-colors" />
                <select 
                  value={locale} 
                  onChange={(e) => setLocale(e.target.value as Locale)}
                  className="w-full h-10 bg-transparent border-none rounded-xl pl-8 pr-4 text-[11px] font-black text-slate-600 dark:text-slate-400 focus:ring-0 outline-none uppercase tracking-widest cursor-pointer"
                >
                  <option value="ru">Russian</option>
                  <option value="en">English</option>
                  <option value="ky">Kyrgyz</option>
                  <option value="uz">Uzbek</option>
                </select>
              </div>
           </div>
        </div>

        {user ? (
          <div className="space-y-4">
             <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 font-black text-xs">
                {user.email?.[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black truncate text-slate-900 dark:text-white uppercase tracking-tight">{business?.name || 'Owner'}</p>
                <p className="text-[10px] text-slate-400 truncate font-bold">{user?.email}</p>
              </div>
              <button 
                onClick={signOut}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-all"
                title={t.common.logout}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            {isAdmin && (
              <Link 
                href="/admin"
                className={cn(
                  "flex items-center gap-3 px-5 py-3 rounded-xl transition-all duration-300 group",
                  pathname === '/admin' ? "bg-amber-500 text-white shadow-md shadow-amber-500/20" : "text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-500/10"
                )}
              >
                <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                <span className="font-bold text-sm tracking-wide">{t.common.admin}</span>
              </Link>
            )}
          </div>
        ) : (
          <Link 
            href="/register"
            onClick={() => setIsMobileMenuOpen(false)}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 active:scale-[0.98] transition-all tracking-wide"
          >
            <Sparkles className="w-4 h-4" />
            {t.auth.join}
          </Link>
        )}
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex fixed top-0 left-0 w-[280px] h-screen bg-[var(--bg-card)] border-r border-slate-200 dark:border-white/5 flex-col z-50 shadow-sm">
        <SidebarContent />
      </aside>

      <header className="lg:hidden fixed top-0 left-0 right-0 h-[72px] bg-[var(--header-bg)] backdrop-blur-md border-b border-slate-200 dark:border-white/5 z-[60] flex items-center justify-between px-6 transition-colors shadow-sm">
        <div className="flex items-center gap-3">
           <Bot className="w-7 h-7 text-indigo-500" />
           <span className="font-bold text-xl text-slate-900 dark:text-white tracking-tight uppercase">AuraSync</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white"
        >
          <Menu className="w-6 h-6" />
        </button>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="mobile-menu-overlay"
            />
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 w-[280px] h-screen bg-[var(--bg-card)] z-[70] shadow-2xl overflow-hidden"
            >
              <div className="absolute top-6 right-4 z-10">
                <button onClick={() => setIsMobileMenuOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-white/10 text-slate-500 hover:text-rose-500 transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
