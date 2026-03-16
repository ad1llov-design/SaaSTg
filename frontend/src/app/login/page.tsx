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
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/[0.03] rounded-full blur-[120px] -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-violet-500/[0.03] rounded-full blur-[120px] -ml-48 -mb-48" />

      <div className="w-full max-w-lg relative z-10 animate-in fade-in zoom-in duration-700">
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-indigo-500/30 rotate-3 border border-white/20">
            <Bot className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-4 uppercase text-[var(--text-main)]">System <span className="font-premium text-indigo-500 italic lowercase tracking-tight">Access</span></h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold text-[10px] uppercase tracking-[0.4em] opacity-70 italic">Initialize your business node via <span className="text-indigo-500">AuraSync</span></p>
        </div>

        <div className="glass p-10 md:p-14 rounded-[3.5rem] shadow-2xl border-white/5 relative overflow-hidden group">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
          
          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] ml-1 opacity-70">Identity Protocol</label>
                <div className="relative group/input">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 w-8 h-8 bg-indigo-500/5 rounded-xl flex items-center justify-center group-focus-within/input:bg-indigo-600 group-focus-within/input:text-white transition-all text-slate-400 shadow-inner">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <input required type="email" placeholder="name@company.com" className="w-full bg-input/50 border-2 border-transparent focus:border-indigo-500/30 rounded-[1.5rem] pl-16 pr-8 py-5 focus:outline-none transition-all font-bold text-sm shadow-inner" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] ml-1 opacity-70">Secure Key</label>
                <div className="relative group/input">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 w-8 h-8 bg-indigo-500/5 rounded-xl flex items-center justify-center group-focus-within/input:bg-indigo-600 group-focus-within/input:text-white transition-all text-slate-400 shadow-inner">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <input required type="password" placeholder="••••••••" className="w-full bg-input/50 border-2 border-transparent focus:border-indigo-500/30 rounded-[1.5rem] pl-16 pr-8 py-5 focus:outline-none transition-all font-bold text-sm shadow-inner" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 p-5 rounded-2xl text-rose-500 text-[10px] font-bold uppercase tracking-[0.3em] text-center animate-shake leading-relaxed">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="w-full py-6 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-3xl shadow-indigo-600/30 flex items-center justify-center gap-4 uppercase tracking-[0.3em] text-[11px]">
              {loading ? 'Authenticating...' : <><Zap className="w-4 h-4" /> Initialize Dashboard <ArrowRight className="w-3.5 h-3.5" /></>}
            </button>
          </form>
        </div>

        <p className="text-center mt-12 text-slate-500 font-bold text-[10px] uppercase tracking-[0.3em] opacity-60 italic">
          New business node? <Link href="/register" className="text-indigo-500 ml-2 hover:underline decoration-2 underline-offset-4 font-bold">Join Protocol</Link>
        </p>
      </div>
    </div>
  );
}
