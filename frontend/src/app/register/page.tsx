"use client";
import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Bot, ArrowRight, Sparkles, Building, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
  const [form, setForm] = useState({ email: '', password: '', businessName: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { data: { business_name: form.businessName } }
      });

      if (authError) throw authError;
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Ошибка при регистрации');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-[#020617] transition-colors duration-500">
        <div className="w-full max-w-md glass p-10 rounded-[3rem] text-center space-y-8 border-white/5 shadow-2xl animate-in zoom-in duration-500">
          <div className="w-24 h-24 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <CheckCircle2 className="w-12 h-12 text-indigo-500" />
          </div>
          <h2 className="text-4xl font-bold tracking-tight uppercase">Protocol <span className="text-indigo-500 italic font-premium lowercase tracking-normal">Sent</span></h2>
          <p className="text-slate-500 font-bold text-sm uppercase tracking-widest leading-relaxed">Система подтверждения отправлена на <br/><span className="text-indigo-600 dark:text-indigo-400 font-bold italic">{form.email}</span></p>
          <div className="h-px bg-slate-500/10 w-full" />
          <button onClick={() => router.push('/login')} className="w-full py-5 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 uppercase tracking-[0.2em] text-xs">
            Initialize Access
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-[#020617] transition-colors duration-500 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-indigo-500/[0.03] rounded-full blur-[120px] -ml-48 -mt-48" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-violet-500/[0.03] rounded-full blur-[120px] -mr-48 -mb-48" />

      <div className="w-full max-w-lg relative z-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-indigo-500/30 -rotate-3 border border-white/20">
            <Sparkles className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-4 uppercase text-[var(--text-main)]">System <span className="font-premium text-indigo-500 italic lowercase tracking-tight">Deployment</span></h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold text-[10px] uppercase tracking-[0.4em] opacity-70 italic">Digital infrastructure for <span className="text-indigo-500 font-bold">AuraSync</span> ecosystem</p>
        </div>

        <div className="glass p-10 md:p-14 rounded-[3.5rem] shadow-2xl border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/[0.02] rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000" />
          
          <form onSubmit={handleRegister} className="space-y-8">
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] ml-1 opacity-70">Brand Identity</label>
                <div className="relative group/input">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 w-8 h-8 bg-indigo-500/5 rounded-xl flex items-center justify-center group-focus-within/input:bg-indigo-600 group-focus-within/input:text-white transition-all text-slate-400 shadow-inner">
                    <Building className="w-4 h-4" />
                  </div>
                  <input required type="text" placeholder="Organizational Identity" className="w-full bg-input/50 border-2 border-transparent focus:border-indigo-500/30 rounded-[1.5rem] pl-16 pr-8 py-5 focus:outline-none transition-all font-bold text-sm shadow-inner" value={form.businessName} onChange={(e) => setForm({...form, businessName: e.target.value})} />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] ml-1 opacity-70">Auth Credentials</label>
                <div className="relative group/input">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 w-8 h-8 bg-indigo-500/5 rounded-xl flex items-center justify-center group-focus-within/input:bg-indigo-600 group-focus-within/input:text-white transition-all text-slate-400 shadow-inner">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input required type="email" placeholder="owner@aura.sync" className="w-full bg-input/50 border-2 border-transparent focus:border-indigo-500/30 rounded-[1.5rem] pl-16 pr-8 py-5 focus:outline-none transition-all font-bold text-sm shadow-inner" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] ml-1 opacity-70">Secure Protocol Key</label>
                <div className="relative group/input">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 w-8 h-8 bg-indigo-500/5 rounded-xl flex items-center justify-center group-focus-within/input:bg-indigo-600 group-focus-within/input:text-white transition-all text-slate-400 shadow-inner">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input required type="password" placeholder="Secure Key Override" className="w-full bg-input/50 border-2 border-transparent focus:border-indigo-500/30 rounded-[1.5rem] pl-16 pr-8 py-5 focus:outline-none transition-all font-bold text-sm shadow-inner" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} />
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 p-5 rounded-2xl text-rose-500 text-[10px] font-bold uppercase tracking-[0.3em] text-center animate-shake leading-relaxed">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="w-full py-6 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-3xl shadow-indigo-600/30 flex items-center justify-center gap-4 uppercase tracking-[0.3em] text-[11px]">
              {loading ? 'Processing Protocol...' : <><CheckCircle2 className="w-5 h-5" /> Start 7-Day Cycle <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>
        </div>

        <p className="text-center mt-12 text-slate-500 font-bold text-[10px] uppercase tracking-[0.3em] opacity-60 italic">
          Already verified? <Link href="/login" className="text-indigo-500 ml-2 hover:underline decoration-2 underline-offset-4 font-bold">Log Access</Link>
        </p>
      </div>
    </div>
  );
}
