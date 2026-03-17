"use client";
import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import Sidebar from '@/components/Sidebar';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/lib/supabase';
import { useNotification } from '@/context/NotificationContext';
import { useEffect } from 'react';

const PUBLIC_ROUTES = ['/login', '/register', '/'];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, business, trialDaysLeft, isAdmin } = useAuth();
  const { t } = useLanguage();
  const { notify } = useNotification();
  
  useEffect(() => {
    if (!business?.id) return;

    // Listen for new appointments
    const aptsSub = supabase
      .channel('apts-realtime')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'appointments',
        filter: `business_id=eq.${business.id}`
      }, (payload) => {
        notify('push', 'New Appointment!', 'A client just booked a new session via Telegram.');
      })
      .subscribe();

    // Listen for new clients
    const clientsSub = supabase
      .channel('clients-realtime')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'clients',
        filter: `business_id=eq.${business.id}`
      }, (payload) => {
        notify('push', 'New Client Registered', 'Someone new just joined your bot community.');
      })
      .subscribe();

    return () => {
      supabase.removeChannel(aptsSub);
      supabase.removeChannel(clientsSub);
    };
  }, [business?.id, notify]);
  
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  if (isPublicRoute) {
    return <div className="min-h-screen transition-colors duration-400">{children}</div>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-main transition-colors">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin shadow-lg shadow-indigo-500/10" />
          <p className="text-slate-500 font-medium text-sm animate-pulse">{t.common.loading}</p>
        </div>
      </div>
    );
  }

  const isExpired = !isAdmin && trialDaysLeft !== undefined && trialDaysLeft <= 0 && business?.subscription_status !== 'active';
  const isBillingPage = pathname === '/billing';

  // Редирект на оплату, если триал истек (и это не публичный роут)
  if (isExpired && !isBillingPage) {
    router.push('/billing');
    return null; // Or a loading spinner while redirecting
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
