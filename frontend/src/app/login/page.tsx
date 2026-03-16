"use client";
import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Bot, ArrowRight, Sparkles, Zap } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-[#020617] transition-colors duration-500 overflow-hidden relative">
      {/* Декор */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] -ml-48 -mb-48" />

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in duration-700">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-500/20 rotate-3 border border-white/20">
            <Bot className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-3">С возвращением</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Войдите в <span className="font-premium italic text-emerald-500">AuraSync</span> для управления бизнесом</p>
        </div>

        <div className="glass p-8 md:p-10 rounded-[3rem] shadow-2xl border-white/5 relative overflow-hidden group">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Электронная почта</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                  <input required type="email" placeholder="name@company.com" className="w-full bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl pl-12 pr-6 py-4.5 focus:outline-none focus:border-emerald-500 transition-all font-medium" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Пароль</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                  <input required type="password" placeholder="••••••••" className="w-full bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl pl-12 pr-6 py-4.5 focus:outline-none focus:border-emerald-500 transition-all font-medium" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl text-rose-500 text-xs font-bold text-center animate-in shake duration-500">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="w-full py-5 bg-emerald-500 text-white font-bold rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3">
              {loading ? 'Авторизация...' : <><Zap className="w-5 h-5" /> Войти в панель <ArrowRight className="w-5 h-5" /></>}
            </button>
          </form>
        </div>

        <p className="text-center mt-10 text-slate-500 font-medium">
          Нет аккаунта? <Link href="/register" className="text-emerald-500 font-bold hover:underline">Зарегистрироваться</Link>
        </p>
      </div>
    </div>
  );
}
