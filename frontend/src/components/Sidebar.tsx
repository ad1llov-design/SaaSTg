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
    <div className="flex flex-col h-full">
      {/* Логотип */}
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center gap-3 group" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-all border border-white/10">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">AuraSync</span>
            <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold">Premium SaaS</p>
          </div>
        </Link>
      </div>

      {/* Навигация */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-medium transition-all duration-300",
                isActive 
                  ? "bg-gradient-to-r from-emerald-500/15 to-transparent text-emerald-500 border-l-2 border-emerald-500 shadow-sm" 
                  : "text-slate-500 hover:text-emerald-500 hover:bg-slate-800/5 dark:hover:bg-white/5"
              )}
            >
              <item.icon className={cn("w-5 h-5 transition-transform duration-300", isActive ? "scale-110" : "group-hover:scale-110")} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Переключатель темы и профиль */}
      <div className="p-4 border-t border-slate-500/10 space-y-4">
        <button 
          onClick={toggleTheme}
          className="w-full flex items-center justify-between p-3.5 rounded-2xl glass transition-all hover:scale-[1.02]"
        >
          <div className="flex items-center gap-3">
            {theme === 'dark' ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
            <span className="text-sm font-medium">{theme === 'dark' ? 'Темная тема' : 'Светлая тема'}</span>
          </div>
          <div className={cn(
            "w-10 h-5 rounded-full relative transition-colors duration-300",
            theme === 'dark' ? "bg-slate-700" : "bg-slate-200"
          )}>
            <div className={cn(
              "absolute top-1 w-3 h-3 rounded-full transition-all duration-300 shadow-sm",
              theme === 'dark' ? "left-6 bg-indigo-400" : "left-1 bg-white"
            )} />
          </div>
        </button>

        {user ? (
          <div className="space-y-3">
            <div className="glass p-4 rounded-2xl border-l-2 border-emerald-500/30">
              <p className="text-sm font-bold truncate leading-none mb-1.5">{business?.name || 'Мой бизнес'}</p>
              <p className="text-[10px] text-slate-500 font-medium truncate uppercase tracking-widest">{user?.email}</p>
            </div>
            <button 
              onClick={signOut}
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-medium text-slate-500 hover:text-rose-500 hover:bg-rose-500/5 transition-all group"
            >
              <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Выйти
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            <Link 
              href="/register"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-2xl text-sm font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-emerald-500/20"
            >
              <Sparkles className="w-4 h-4" />
              Начать бесплатно
            </Link>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Десктопный сайдбар */}
      <aside className="hidden lg:flex fixed top-4 left-4 w-72 bottom-4 h-[calc(100vh-2rem)] glass rounded-[2.5rem] border border-slate-500/10 flex-col z-50">
        <SidebarContent />
      </aside>

      {/* Мобильная шапка */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 glass-dark border-b border-white/5 z-[60] flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Bot className="w-6 h-6 text-emerald-400" />
          <span className="font-bold text-lg tracking-tight">AuraSync</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-white">
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {/* Мобильный сайдбар (Дровер) */}
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
              className="fixed top-0 left-0 w-[280px] h-screen bg-slate-900 z-[70] shadow-2xl border-r border-white/5"
            >
              <div className="absolute top-5 right-5 z-10">
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-500 hover:text-white">
                  <X className="w-6 h-6" />
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
