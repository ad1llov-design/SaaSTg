"use client";
import React, { useState, useEffect } from 'react';
import { MessageSquare, Shield, CheckCircle2, AlertCircle, Copy, ExternalLink } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function SettingsPage() {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [botInfo, setBotInfo] = useState<{ username: string } | null>(null);
  const [business, setBusiness] = useState<any>(null);

  useEffect(() => {
    async function loadBusiness() {
      const { data } = await supabase.from('businesses').select('*').limit(1).single();
      if (data) {
        setBusiness(data);
        if (data.bot_token) setToken(data.bot_token);
      }
    }
    loadBusiness();
  }, []);

  const handleConnect = async () => {
    if (!token) return;
    setLoading(true);
    setStatus('idle');

    try {
      // For MVP, create a business if it doesn't exist
      let bizId = business?.id;
      if (!bizId) {
          const { data } = await supabase.from('businesses').insert({ 
              name: 'My Business', 
              owner_email: 'test@example.com' 
          }).select().single();
          bizId = data.id;
      }

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      const response = await fetch(`${backendUrl}/api/register-bot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessId: bizId, token })
      });

      const result = await response.json();
      if (result.success) {
        setStatus('success');
        setBotInfo({ username: result.botUsername });
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-3xl font-bold">Bot Settings</h2>
        <p className="text-slate-400 mt-1">Connect and configure your Telegram booking bot.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="glass p-8 rounded-3xl border border-slate-800">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Telegram Bot Token</h3>
                <p className="text-sm text-slate-400">Enter the token from @BotFather</p>
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
                {loading ? 'Connecting...' : status === 'success' ? 'Connected!' : 'Connect Bot'}
                {status === 'success' && <CheckCircle2 className="w-5 h-5" />}
              </button>

              {status === 'error' && (
                <div className="flex items-center gap-2 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm">
                  <AlertCircle className="w-5 h-5" />
                  Invalid token or server error. Please try again.
                </div>
              )}
            </div>
          </div>

          {status === 'success' || (business?.bot_token && !loading) ? (
            <div className="glass p-8 rounded-3xl border border-emerald-500/20 bg-emerald-500/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Your bot is active!</h4>
                    <p className="text-slate-400 text-sm">@{botInfo?.username || 'your_bot'}</p>
                  </div>
                </div>
                <a 
                  href={`https://t.me/${botInfo?.username}`} 
                  target="_blank"
                  className="p-3 bg-slate-800 rounded-xl hover:bg-slate-700 transition-colors"
                >
                  <ExternalLink className="w-5 h-5 text-slate-300" />
                </a>
              </div>
            </div>
          ) : null}
        </div>

        <div className="space-y-6">
            <div className="glass p-6 rounded-3xl border border-slate-800">
                <h4 className="font-bold mb-4">How to setup?</h4>
                <ol className="text-sm text-slate-400 space-y-4 list-decimal list-inside">
                    <li>Open <a href="https://t.me/botfather" target="_blank" className="text-emerald-400 hover:underline">@BotFather</a> on Telegram.</li>
                    <li>Create a new bot with <code className="bg-slate-800 px-1 rounded">/newbot</code>.</li>
                    <li>Copy the **API Token** and paste it here.</li>
                    <li>Save settings and your bot is ready!</li>
                </ol>
            </div>
        </div>
      </div>
    </div>
  );
}
