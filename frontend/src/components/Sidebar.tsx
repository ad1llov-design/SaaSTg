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
  Moon
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
  const { user, business, signOut, theme, toggleTheme } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white dark:bg-[#0f172a] lg:bg-transparent">
      {/* Логотип */}
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center gap-3 group" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-all border border-white/10">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">AuraSync</span>
            <p className="text-[10px] text-emerald-500 uppercase tracking-[0.2em] font-bold">Premium SaaS</p>
          </div>
        </Link>
      </div>

      {/* Навигация */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-2xl text-[13px] font-bold transition-all duration-300",
                isActive 
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-l-4 border-emerald-500" 
                  : "text-slate-500 hover:text-emerald-500 hover:bg-slate-50 dark:hover:bg-white/5"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "text-emerald-500" : "text-slate-400")} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Подвал сайдбара */}
      <div className="p-4 border-t border-slate-100 dark:border-white/5 space-y-4">
        {/* Переключатель темы */}
        <div className="flex items-center justify-between px-2">
           <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Тема</span>
           <button 
              onClick={toggleTheme}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:scale-110 active:scale-95 transition-all"
           >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
           </button>
        </div>

        {user ? (
          <div className="space-y-2">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
              <p className="text-xs font-bold truncate mb-0.5">{business?.name || 'Мой бизнес'}</p>
              <p className="text-[10px] text-slate-400 truncate tracking-tight">{user?.email}</p>
            </div>
            <button 
              onClick={signOut}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[13px] font-bold text-slate-400 hover:text-rose-500 hover:bg-rose-500/5 transition-all"
            >
              <LogOut className="w-4 h-4" />
              Выход
            </button>
          </div>
        ) : (
          <Link 
            href="/register"
            onClick={() => setIsMobileMenuOpen(false)}
            className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-emerald-500 text-white rounded-2xl text-[13px] font-bold shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            Начать бесплатно
          </Link>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Десктоп */}
      <aside className="hidden lg:flex fixed top-0 left-0 w-72 h-screen bg-white dark:bg-[#020617] border-r border-slate-100 dark:border-white/5 flex-col z-50">
        <SidebarContent />
      </aside>

      {/* Мобильная шапка */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 dark:bg-[#020617]/80 backdrop-blur-md border-b border-slate-100 dark:border-white/5 z-[60] flex items-center justify-between px-4 transition-colors">
        <div className="flex items-center gap-2">
           <Bot className="w-6 h-6 text-emerald-500" />
           <span className="font-bold text-lg">AuraSync</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white"
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
              className="fixed top-0 left-0 w-[280px] h-screen bg-white dark:bg-[#0f172a] z-[70] shadow-2xl overflow-hidden"
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
