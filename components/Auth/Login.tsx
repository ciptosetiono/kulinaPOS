'use client';

import React, { useState } from 'react';
import AuthLayout from './AuthLayout';
import { createClient } from '@/utils/supabase/client';

interface LoginProps {
  onLogin: (email: string) => void;
  onNavigate: (page: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        onLogin(email);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to authenticate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Secure Login" 
      subtitle="Access your KulinaPOS Terminal"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold">
            {errorMsg}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Enterprise Email</label>
          <input 
            type="email" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-2xl text-white font-bold outline-none focus:ring-2 focus:ring-fuchsia-600 transition-all placeholder:text-slate-700"
            placeholder="ceo@maqpos.com"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Passkey</label>
            <button 
              type="button"
              onClick={() => onNavigate('forgot')}
              className="text-[10px] font-black text-fuchsia-600 uppercase tracking-widest hover:text-fuchsia-500"
            >
              Reset?
            </button>
          </div>
          <input 
            type="password" 
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-2xl text-white font-bold outline-none focus:ring-2 focus:ring-fuchsia-600 transition-all placeholder:text-slate-700"
            placeholder="••••••••"
          />
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full py-5 bg-fuchsia-600 hover:bg-fuchsia-700 disabled:opacity-50 text-white rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-fuchsia-600/30 transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          {loading ? (
            <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
          ) : (
            'AUTHENTICATE'
          )}
        </button>

        <div className="pt-4 text-center">
          <p className="text-sm text-slate-400 font-medium">
            New Organization? {' '}
            <button 
              type="button"
              onClick={() => onNavigate('register')}
              className="text-fuchsia-600 font-black hover:underline uppercase tracking-tighter"
            >
              Initialize Node
            </button>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Login;