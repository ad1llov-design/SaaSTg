"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, usePathname } from 'next/navigation';
import type { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  business: any | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  business: null,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

const PUBLIC_ROUTES = ['/login', '/register', '/dashboard', '/'];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
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

  async function loadBusiness(userId: string) {
    const { data } = await supabase
      .from('businesses')
      .select('*')
      .eq('owner_id', userId)
      .limit(1)
      .single();
    
    setBusiness(data);
    setLoading(false);
  }

  // Редирект только если пользователь лезет в защищенные настройки
  useEffect(() => {
    if (loading) return;
    
    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
    const isProtectingSettings = pathname === '/settings' || pathname === '/services';
    
    if (!user && isProtectingSettings) {
      router.push('/login');
    }
  }, [user, loading, pathname, router]);

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, business, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
