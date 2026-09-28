'use client';

import React, { useState } from 'react';
import AuthLayout from './AuthLayout';

interface ForgotPasswordProps {
  onNavigate: (page: string) => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Mocking the password reset process since Supabase is removed
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage({
        type: 'success',
        text: `If the email exists, a password reset link has been sent to ${email}.`,
      });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'An unexpected error occurred.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Riset Kata Sandi"
      subtitle="Masukkan email Anda untuk menerima tautan riset kata sandi"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {message && (
          <div
            className={`p-4 rounded-2xl text-xs font-bold ${
              message.type === 'success'
                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
            Email Perusahaan
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-2xl text-white font-bold outline-none focus:ring-2 focus:ring-fuchsia-600 transition-all placeholder:text-slate-700"
            placeholder="nama@perusahaan.com"
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
            'KIRIM TAUTAN RESET'
          )}
        </button>

        <div className="pt-4 text-center">
          <p className="text-sm text-slate-400 font-medium">
            Ingat kata sandi Anda?{' '}
            <button
              type="button"
              onClick={() => onNavigate('login')}
              className="text-fuchsia-600 font-black hover:underline uppercase tracking-tighter"
            >
              Kembali ke Login
            </button>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;
