"use client";
import React from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import Sidebar from '@/components/Sidebar';

const PUBLIC_ROUTES = ['/login', '/register'];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  // На публичных страницах (login/register) — без Sidebar
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // Показываем загрузку, пока Auth проверяет сессию
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Загрузка...</p>
        </div>
      </div>
    );
  }

  // Позволяем гостям видеть дашборд и другие ознакомительные страницы
  const isDemoAllowed = ['/', '/dashboard', '/appointments', '/clients'].includes(pathname);

  if (!user && !isDemoAllowed) {
    return null;
  }

  // Основной лейаут с Sidebar
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 ml-72 p-8 min-h-screen">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
