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
        <div className="w-full max-w-md glass p-10 rounded-[3rem] text-center space-y-6 border-white/5 shadow-2xl animate-in zoom-in duration-500">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
          </div>
          <h2 className="text-3xl font-bold">Проверьте почту!</h2>
          <p className="text-slate-500 font-medium">Мы отправили ссылку для подтверждения на <span className="text-emerald-500 font-bold">{form.email}</span></p>
          <div className="h-px bg-slate-500/10 w-full" />
          <button onClick={() => router.push('/login')} className="w-full py-4 bg-emerald-500 text-white font-bold rounded-2xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20">
            Перейти ко входу
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-[#020617] transition-colors duration-500 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] -ml-48 -mt-48" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] -mr-48 -mb-48" />

      <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-500/20 -rotate-3 border border-white/20">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-3">Создать аккаунт</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium italic">Ваш новый стандарт управления на <span className="font-premium text-emerald-500">AuraSync</span></p>
        </div>

        <div className="glass p-8 md:p-10 rounded-[3rem] shadow-2xl border-white/5">
          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Название бизнеса</label>
                <div className="relative">
                  <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input required type="text" placeholder="Barber Shop Premium" className="w-full bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl pl-12 pr-6 py-4.5 focus:outline-none focus:border-emerald-500 transition-all font-medium" value={form.businessName} onChange={(e) => setForm({...form, businessName: e.target.value})} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input required type="email" placeholder="owner@aura.sync" className="w-full bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl pl-12 pr-6 py-4.5 focus:outline-none focus:border-emerald-500 transition-all font-medium" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Пароль</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input required type="password" placeholder="Мин. 6 символов" className="w-full bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl pl-12 pr-6 py-4.5 focus:outline-none focus:border-emerald-500 transition-all font-medium" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} />
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl text-rose-500 text-xs font-bold text-center">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="w-full py-5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3">
              {loading ? 'Создание...' : <><CheckCircle2 className="w-5 h-5" /> Начать 7 дней Demo <ArrowRight className="w-5 h-5" /></>}
            </button>
          </form>
        </div>

        <p className="text-center mt-10 text-slate-500 font-medium">
          Уже есть аккаунт? <Link href="/login" className="text-emerald-500 font-bold hover:underline">Войти</Link>
        </p>
      </div>
    </div>
  );
}
