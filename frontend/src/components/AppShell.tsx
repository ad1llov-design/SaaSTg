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
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin shadow-lg shadow-emerald-500/10" />
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest animate-pulse">Initializing AuraSync</p>
        </div>
      </div>
    );
  }

  // Позволяем гостям видеть все страницы в демо-режиме
  const isDemoAllowed = ['/', '/dashboard', '/appointments', '/clients', '/services', '/settings'].includes(pathname);

  if (!user && !isDemoAllowed) {
    return null;
  }

  // Основной лейаут
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 lg:ml-80 px-4 py-20 lg:py-10 min-h-screen w-full">
        <div className="max-w-6xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
