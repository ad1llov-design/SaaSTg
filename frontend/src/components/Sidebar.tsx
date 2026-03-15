"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Calendar, 
  Settings, 
  Users, 
  Package, 
  MessageSquare,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  { name: 'Панель управления', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Записи на прием', href: '/appointments', icon: Calendar },
  { name: 'Услуги', href: '/services', icon: Package },
  { name: 'Клиенты', href: '/clients', icon: Users },
  { name: 'Настройки бота', href: '/settings', icon: MessageSquare },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-72 h-screen fixed left-0 top-0 border-r border-slate-800 bg-slate-900/50 backdrop-blur-xl p-6 flex flex-col">
      <div className="flex items-center gap-3 mb-10 px-4">
        <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
          <Calendar className="text-white w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          LinkHub SaaS
        </h1>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                isActive 
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-slate-800">
        <button className="flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:text-rose-400 hover:bg-rose-500/5 rounded-xl transition-colors">
          <LogOut className="w-5 h-5" />
          <span className="font-medium text-sm">Выход</span>
        </button>
      </div>
    </div>
  );
}
