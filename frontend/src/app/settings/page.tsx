"use client";
import React, { useState, useEffect } from 'react';
import { MessageSquare, Shield, CheckCircle2, AlertCircle, ExternalLink, Bell } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import DemoModal from '@/components/DemoModal';

export default function SettingsPage() {
  const { business, user } = useAuth();
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [botInfo, setBotInfo] = useState<{ username: string } | null>(null);
  const [showDemoModal, setShowDemoModal] = useState(false);

  useEffect(() => {
    if (business?.bot_token) {
      setToken(business.bot_token);
    } else if (!user) {
      // Демо-токен для вида
      setToken('6829103541:AAF_demo_token_example_linkhub');
      setBotInfo({ username: 'DemoBookingBot' });
    }
  }, [business, user]);

  const handleConnect = async () => {
    if (!user) {
      setShowDemoModal(true);
      return;
    }
    if (!token || !business?.id) return;
    setLoading(true);
    setStatus('idle');
    setErrorMsg('');

    try {
      let backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      if (backendUrl.endsWith('/')) backendUrl = backendUrl.slice(0, -1);

      const response = await fetch(`${backendUrl}/api/register-bot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessId: business.id, token })
      });

      if (!response.ok) {
        const errorData = await response.json();
        const msg = errorData.error || 'Ошибка сервера';
        setErrorMsg(msg);
        setStatus('error');
        return;
      }

      const result = await response.json();
      if (result.success) {
        setStatus('success');
        setBotInfo({ username: result.botUsername });
      } else {
        setStatus('error');
      }
    } catch (err: any) {
      console.error('Fetch error:', err);
      setErrorMsg(err.message || 'Ошибка сети: бэкенд недоступен');
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-8">
      <DemoModal isOpen={showDemoModal} onClose={() => setShowDemoModal(false)} />
      <div>
        <h2 className="text-3xl font-bold">Настройки бота</h2>
        <p className="text-slate-400 mt-1">Подключите и настройте вашего Telegram-бота для приема записей.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="glass p-8 rounded-3xl border border-slate-800">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Токен Telegram-бота</h3>
                <p className="text-sm text-slate-400">Введите токен от @BotFather</p>
              </div>
            </div>

            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="123456789:ABCdefGHIjkl..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-4 font-mono text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                value={token}
                onChange={e => setToken(e.target.value)}
              />
              
              <button 
                onClick={handleConnect}
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : status === 'success' ? (
                  <>Подключено! <CheckCircle2 className="w-5 h-5" /></>
                ) : (
                  'Подключить бота'
                )}
              </button>

              {status === 'error' && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-400">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p className="text-sm">{errorMsg || 'Произошла ошибка при подключении.'}</p>
                </div>
              )}
            </div>
          </div>

          {(status === 'success' || business?.bot_token) && (
            <div className="glass p-8 rounded-3xl border border-emerald-500/20 bg-emerald-500/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Ваш бот активен!</h4>
                    <p className="text-slate-400 text-sm">@{botInfo?.username || 'ваш_бот'}</p>
                  </div>
                </div>
                <a 
                  href={`https://t.me/${botInfo?.username || ''}`} 
                  target="_blank"
                  className="p-3 bg-slate-800 rounded-xl hover:bg-slate-700 transition-colors"
                >
                  <ExternalLink className="w-5 h-5 text-slate-300" />
                </a>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="glass p-6 rounded-3xl border border-slate-800">
            <h4 className="font-bold mb-4">Как подключить?</h4>
            <ol className="text-sm text-slate-400 space-y-4 list-decimal list-inside">
              <li>Откройте <a href="https://t.me/botfather" target="_blank" className="text-emerald-400 hover:underline">@BotFather</a> в Telegram.</li>
              <li>Создайте бота командой <code className="bg-slate-800 px-1 rounded">/newbot</code>.</li>
              <li>Скопируйте <strong>API Token</strong> и вставьте выше.</li>
              <li>Нажмите «Подключить» и бот готов!</li>
            </ol>
          </div>

          <div className="glass p-6 rounded-3xl border border-slate-800">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="w-5 h-5 text-amber-400" />
              <h4 className="font-bold">Уведомления</h4>
            </div>
            <p className="text-sm text-slate-400">
              Напишите вашему боту <code className="bg-slate-800 px-1 rounded">/start</code> в Telegram, 
              чтобы получать уведомления о новых записях в личные сообщения.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
