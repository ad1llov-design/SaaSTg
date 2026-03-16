"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
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
  ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const menuItems = [
  { name: 'Дашборд', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Записи', href: '/appointments', icon: CalendarCheck },
  { name: 'Услуги', href: '/services', icon: Sparkles },
  { name: 'Клиенты', href: '/clients', icon: Users },
  { name: 'Бот', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, business, signOut, theme, toggleTheme, trialDaysLeft, isAdmin } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[var(--bg-card)] lg:bg-transparent">
      {/* Логотип */}
      <div className="p-8">
        <Link href="/dashboard" className="flex items-center gap-4 group" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all border border-white/10 group-hover:-rotate-6">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="font-bold text-2xl tracking-tighter text-slate-900 dark:text-white uppercase leading-none">Aura<span className="text-indigo-500">Sync</span></span>
            <p className="text-[9px] text-slate-400 uppercase tracking-[0.4em] font-bold mt-1 opacity-70">Premium Node</p>
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
                "flex items-center gap-4 px-5 py-4 rounded-2xl text-[13px] font-bold transition-all duration-300 group",
                isActive 
                  ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/10 shadow-sm" 
                  : "text-slate-500 hover:text-indigo-600 hover:bg-indigo-500/[0.03]"
              )}
            >
              <item.icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", isActive ? "text-indigo-500" : "text-slate-400")} />
              <span className="uppercase tracking-widest text-[10px]">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Подвал сайдбара */}
      <div className="p-6 border-t border-slate-200 dark:border-white/5 space-y-6">
        {/* Trial Status Sidebar Item */}
        <div className="px-2">
          <div className="bg-indigo-500/[0.02] border border-indigo-500/10 rounded-3xl p-5 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/[0.02] rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700" />
            <div className="flex items-center justify-between mb-3 relative z-10">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                {trialDaysLeft > 0 ? "System Access" : "Protocol Expired"}
              </span>
              <span className="text-[10px] font-bold text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded-full">
                {trialDaysLeft > 0 ? `${trialDaysLeft} Days` : "Locked"}
              </span>
            </div>
            <div className="w-full h-1 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden mb-4 relative z-10">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-1000 shadow-[0_0_10px_rgba(99,102,241,0.3)]" 
                style={{ width: `${(trialDaysLeft / 7) * 100}%` }} 
              />
            </div>
            <Link 
              href="/billing" 
              className="flex items-center justify-center gap-2 w-full py-3 bg-indigo-600 text-white text-[10px] font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/10 uppercase tracking-widest"
            >
              <Zap className="w-3 h-3" /> Upgrade to Pro
            </Link>
          </div>
        </div>

        {/* Переключатель темы */}
        <div className="flex items-center justify-between px-2">
           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Mode</span>
           <button 
              onClick={toggleTheme}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-border/50 hover:bg-indigo-500/5 hover:text-indigo-500 transition-all"
           >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
           </button>
        </div>

        {user ? (
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-indigo-500/[0.02] border border-indigo-500/5 group hover:border-indigo-500/20 transition-all">
              <p className="text-[10px] font-bold truncate mb-1 text-slate-900 dark:text-white uppercase tracking-tight">{business?.name || 'Active Node'}</p>
              <p className="text-[9px] text-slate-400 truncate tracking-widest font-medium italic opacity-70">{user?.email}</p>
            </div>
            {/* Admin Section */}
            {isAdmin && (
              <div className="pt-4 mt-4 border-t border-slate-200 dark:border-white/5">
                <p className="px-5 mb-3 text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em] opacity-60">System Core</p>
                <Link 
                  href="/admin"
                  className={cn(
                    "flex items-center gap-3 px-5 py-4 rounded-2xl transition-all duration-300 group",
                    pathname === '/admin' ? "bg-amber-500 text-white shadow-xl shadow-amber-500/20" : "text-slate-500 hover:bg-amber-500/10 hover:text-amber-500"
                  )}
                >
                  <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                  <span className="font-bold text-[10px] uppercase tracking-widest">Admin Control</span>
                </Link>
              </div>
            )}

            <button 
              onClick={signOut}
              className="w-full flex items-center gap-3 px-5 py-3 rounded-2xl text-[10px] font-bold text-slate-400 hover:text-rose-500 hover:bg-rose-500/5 transition-all uppercase tracking-widest"
            >
              <LogOut className="w-4 h-4" />
              Terminate Session
            </button>
          </div>
        ) : (
          <Link 
            href="/register"
            onClick={() => setIsMobileMenuOpen(false)}
            className="w-full flex items-center justify-center gap-2 px-6 py-5 bg-indigo-600 text-white rounded-2xl text-[11px] font-bold shadow-2xl shadow-indigo-600/20 hover:bg-indigo-700 active:scale-[0.98] transition-all uppercase tracking-widest"
          >
            <Sparkles className="w-4 h-4" />
            Initialize Free
          </Link>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Десктоп */}
      <aside className="hidden lg:flex fixed top-0 left-0 w-72 h-screen bg-[var(--bg-card)] border-r border-slate-200 dark:border-white/5 flex-col z-50">
        <SidebarContent />
      </aside>

      {/* Мобильная шапка */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[var(--header-bg)] backdrop-blur-md border-b border-slate-200 dark:border-white/5 z-[60] flex items-center justify-between px-4 transition-colors">
        <div className="flex items-center gap-2">
           <Bot className="w-6 h-6 text-indigo-500" />
           <span className="font-bold text-lg text-slate-900 dark:text-white">AuraSync</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white"
        >
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {/* Мобильный дровер */}
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
              <div className="absolute top-4 right-4 z-10">
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
