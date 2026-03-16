"use client";
import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Bot, ArrowRight, Sparkles, Zap } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function LoginPage() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setError(authError.message === 'Invalid login credentials' ? 'Неверный email или пароль' : authError.message);
      setLoading(false);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-[#020617] transition-colors duration-500 overflow-hidden relative font-sans">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/[0.03] rounded-full blur-[120px] -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-violet-500/[0.03] rounded-full blur-[120px] -ml-48 -mb-48" />

      <div className="w-full max-w-lg relative z-10 animate-in fade-in zoom-in duration-700">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-indigo-500/30 rotate-3 border border-white/20">
            <Bot className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3 text-slate-900 dark:text-white">{t.auth.login_title}</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm opacity-80">{t.auth.login_subtitle}</p>
        </div>

        <div className="bg-white dark:bg-white/[0.03] backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-white/5 relative overflow-hidden">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 tracking-wide ml-1">{t.auth.email}</label>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input required type="email" placeholder="email@example.com" className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-indigo-500 rounded-2xl pl-14 pr-6 py-4 focus:outline-none transition-all text-sm shadow-sm" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 tracking-wide ml-1">{t.auth.password}</label>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input required type="password" placeholder="••••••••" className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-indigo-500 rounded-2xl pl-14 pr-6 py-4 focus:outline-none transition-all text-sm shadow-sm" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl text-rose-600 dark:text-rose-400 text-xs font-semibold text-center animate-in fade-in slide-in-from-top-2">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-3 text-sm">
              {loading ? '...' : <><Zap className="w-4 h-4" /> {t.auth.login_btn}</>}
            </button>
          </form>
        </div>

        <p className="text-center mt-10 text-slate-500 font-medium text-sm">
          {t.auth.no_account} <Link href="/register" className="text-indigo-600 dark:text-indigo-400 hover:underline font-bold ml-1">{t.auth.join}</Link>
        </p>
      </div>
    </div>
  );
}
