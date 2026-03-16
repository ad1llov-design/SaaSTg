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

  if (isPublicRoute) {
    return <div className="min-h-screen transition-colors duration-400">{children}</div>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)] transition-colors">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin shadow-lg shadow-emerald-500/10" />
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] animate-pulse">Initializing AuraSync</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-main transition-colors duration-400">
      <Sidebar />
      <main className="flex-1 lg:ml-72 px-4 py-24 lg:py-10 min-h-screen overflow-x-hidden">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
