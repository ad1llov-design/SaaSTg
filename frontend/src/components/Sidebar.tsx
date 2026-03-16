"use client";
import React from 'react';
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
  Bot
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  { name: 'Панель управления', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Записи на прием', href: '/appointments', icon: CalendarCheck },
  { name: 'Услуги', href: '/services', icon: Sparkles },
  { name: 'Клиенты', href: '/clients', icon: Users },
  { name: 'Настройки бота', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, business, signOut } = useAuth();

  return (
    <aside className="fixed top-0 left-0 w-72 h-screen bg-slate-900/50 backdrop-blur-xl border-r border-slate-800 flex flex-col z-50">
      {/* Логотип */}
      <div className="p-6 border-b border-slate-800">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-shadow">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight">LinkHub SaaS</span>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">Booking Platform</p>
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
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm" 
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "text-emerald-400" : "")} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Профиль и выход */}
      <div className="p-4 border-t border-slate-800 space-y-3">
        <div className="glass p-3 rounded-xl">
          <p className="text-sm font-bold truncate">{business?.name || 'Мой бизнес'}</p>
          <p className="text-xs text-slate-500 truncate">{user?.email}</p>
        </div>
        <button 
          onClick={signOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/5 transition-all"
        >
          <LogOut className="w-5 h-5" />
          Выйти из аккаунта
        </button>
      </div>
    </aside>
  );
}
