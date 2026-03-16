"use client";
import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { 
  Mail, 
  Lock, 
  User, 
  Building2, 
  ArrowRight,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export default function RegisterPage() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    businessName: '',
    ownerName: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Регистрация через Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            full_name: form.ownerName,
            business_name: form.businessName,
          }
        }
      });

      if (authError) throw authError;

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Ошибка при регистрации');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
        <div className="w-full max-w-md text-center space-y-6">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </div>
          <h1 className="text-3xl font-bold text-white">Регистрация завершена!</h1>
          <p className="text-slate-400">
            Мы отправили письмо подтверждения на <span className="text-emerald-400 font-medium">{form.email}</span>. 
            После подтверждения вы сможете войти в систему.
          </p>
          <Link 
            href="/login" 
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-lg shadow-emerald-500/20"
          >
            Перейти ко входу
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-lg space-y-8">
        {/* Заголовок */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Создайте аккаунт
          </h1>
          <p className="text-slate-400 text-lg">
            Начните автоматизировать записи через Telegram уже сегодня
          </p>
        </div>

        {/* Форма */}
        <form onSubmit={handleRegister} className="glass p-8 rounded-3xl border border-slate-800 space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-500" />
              Название вашего бизнеса
            </label>
            <input
              required
              type="text"
              placeholder="Салон красоты «Люкс»"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3.5 focus:outline-none focus:border-emerald-500 transition-colors placeholder:text-slate-600"
              value={form.businessName}
              onChange={e => setForm({...form, businessName: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-500" />
              Ваше имя
            </label>
            <input
              required
              type="text"
              placeholder="Иван Петров"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3.5 focus:outline-none focus:border-emerald-500 transition-colors placeholder:text-slate-600"
              value={form.ownerName}
              onChange={e => setForm({...form, ownerName: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-500" />
              Email
            </label>
            <input
              required
              type="email"
              placeholder="your@email.com"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3.5 focus:outline-none focus:border-emerald-500 transition-colors placeholder:text-slate-600"
              value={form.email}
              onChange={e => setForm({...form, email: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-500" />
              Пароль
            </label>
            <input
              required
              type="password"
              placeholder="Минимум 6 символов"
              minLength={6}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3.5 focus:outline-none focus:border-emerald-500 transition-colors placeholder:text-slate-600"
              value={form.password}
              onChange={e => setForm({...form, password: e.target.value})}
            />
          </div>

          {error && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 disabled:from-slate-700 disabled:to-slate-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Создать аккаунт
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-slate-500 text-sm">
          Уже есть аккаунт?{' '}
          <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-medium hover:underline">
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
}
