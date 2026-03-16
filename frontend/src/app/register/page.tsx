"use client";
import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Bot, ArrowRight, Sparkles, Building, CheckCircle2, Zap } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function RegisterPage() {
  const { t } = useLanguage();
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
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-[#020617] transition-colors duration-500 font-sans">
        <div className="w-full max-w-md bg-white dark:bg-white/[0.03] p-10 rounded-[2.5rem] text-center space-y-8 border border-slate-200 dark:border-white/5 shadow-2xl animate-in zoom-in duration-500">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{t.auth.success_title}</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm leading-relaxed">
            {t.auth.success_desc} <br/><span className="text-indigo-600 dark:text-indigo-400 font-bold italic">{form.email}</span>
          </p>
          <div className="h-px bg-slate-200 dark:bg-white/10 w-full" />
          <button onClick={() => router.push('/login')} className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 text-sm">
            {t.auth.back_to_login}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-[#020617] transition-colors duration-500 overflow-hidden relative font-sans">
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-indigo-500/[0.03] rounded-full blur-[120px] -ml-48 -mt-48" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-violet-500/[0.03] rounded-full blur-[120px] -mr-48 -mb-48" />

      <div className="w-full max-w-lg relative z-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-indigo-500/30 -rotate-3 border border-white/20">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3 text-slate-900 dark:text-white">{t.auth.register_title}</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm opacity-80">{t.auth.register_subtitle}</p>
        </div>

        <div className="bg-white dark:bg-white/[0.03] backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-white/5 relative overflow-hidden">
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 tracking-wide ml-1">{t.auth.business_name}</label>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                    <Building className="w-5 h-5" />
                  </div>
                  <input required type="text" placeholder="Aura Beauty Express" className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-indigo-500 rounded-2xl pl-14 pr-6 py-4 focus:outline-none transition-all text-sm shadow-sm" value={form.businessName} onChange={(e) => setForm({...form, businessName: e.target.value})} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 tracking-wide ml-1">{t.auth.email}</label>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input required type="email" placeholder="owner@example.com" className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-indigo-500 rounded-2xl pl-14 pr-6 py-4 focus:outline-none transition-all text-sm shadow-sm" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 tracking-wide ml-1">{t.auth.password}</label>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input required type="password" placeholder="••••••••" className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-indigo-500 rounded-2xl pl-14 pr-6 py-4 focus:outline-none transition-all text-sm shadow-sm" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} />
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl text-rose-600 dark:text-rose-400 text-xs font-semibold text-center animate-in fade-in slide-in-from-top-2">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="w-full py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-2xl hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-3 text-sm">
              {loading ? '...' : <><Zap className="w-4 h-4" /> {t.auth.register_btn}</>}
            </button>
          </form>
        </div>

        <p className="text-center mt-10 text-slate-500 font-medium text-sm">
          {t.auth.have_account} <Link href="/login" className="text-indigo-600 dark:text-indigo-400 hover:underline font-bold ml-1">{t.auth.sign_in}</Link>
        </p>
      </div>
    </div>
  );
}
