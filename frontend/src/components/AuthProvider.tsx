"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, usePathname } from 'next/navigation';
import type { User } from '@supabase/supabase-js';

interface Business {
  id: string;
  name: string;
  owner_email: string;
  bot_token?: string;
  trial_ends_at?: string;
  subscription_status?: 'trialing' | 'active' | 'expired';
}

interface AuthContextType {
  user: User | null; // Keeping User type for consistency with useState, though instruction snippet had 'any'
  business: Business | null;
  loading: boolean;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  signOut: () => Promise<void>;
  trialDaysLeft: number;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  business: null,
  loading: true,
  theme: 'dark',
  toggleTheme: () => {},
  signOut: async () => {},
  trialDaysLeft: 7
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [trialDaysLeft, setTrialDaysLeft] = useState(7);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Загрузка темы
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadBusiness(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadBusiness(session.user.id);
      } else {
        setBusiness(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  async function loadBusiness(userId: string) {
    const { data: bizData } = await supabase
      .from('businesses')
      .select('*')
      .eq('owner_id', userId)
      .limit(1)
      .single();
      if (bizData) {
        setBusiness(bizData);
        if (bizData.trial_ends_at) {
          const ends = new Date(bizData.trial_ends_at);
          const now = new Date();
          const diff = Math.ceil((ends.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          setTrialDaysLeft(Math.max(0, diff));
        }
      }
    setLoading(false);
  }

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, business, loading, theme, toggleTheme, signOut, trialDaysLeft }}>
      {children}
    </AuthContext.Provider>
  );
}
