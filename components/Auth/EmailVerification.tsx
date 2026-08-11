'use client';

import React, { useState } from 'react';
import AuthLayout from './AuthLayout';
import { createClient } from '@/utils/supabase/client';

interface EmailVerificationProps {
  email?: string;
  onNavigate: (page: string) => void;
}

const EmailVerification: React.FC<EmailVerificationProps> = ({ email = '', onNavigate }) => {
  const [resendLoading, setResendLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const supabase = createClient();

  const handleResend = async () => {
    if (!email) {
      setMessage({ type: 'error', text: 'Email address not provided.' });
      return;
    }

    setResendLoading(true);
    setMessage(null);

    try {
      const emailRedirectTo = `${window.location.origin}/auth/callback?next=/dashboard`;
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo,
        }
      });

      if (error) {
        setMessage({ type: 'error', text: error.message });
      } else {
        setMessage({ type: 'success', text: `Confirmation email re-sent to ${email}!` });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to resend confirmation email.' });
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Check Your Email" 
      subtitle={email ? `We sent a confirmation link to ${email}` : "We've sent a confirmation link to your inbox"}
    >
      <div className="text-center space-y-6">
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

        <div className="py-6 px-4 bg-white/5 border border-white/10 rounded-2xl">
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
            📬
          </div>
          <p className="text-sm text-slate-300 font-medium">
            Click the link in your email to verify your account and access KulinaPOS.
          </p>
        </div>

        <div className="space-y-4">
          <button 
            type="button"
            onClick={() => onNavigate('login')}
            className="w-full py-5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 transition-all active:scale-95"
          >
            Go to Sign In
          </button>
          
          <p className="text-sm text-slate-400 font-medium">
            Didn't receive the email? {' '}
            <button 
              type="button"
              onClick={handleResend}
              disabled={resendLoading}
              className="text-emerald-500 font-bold hover:underline disabled:opacity-50"
            >
              {resendLoading ? 'Sending...' : 'Resend Email'}
            </button>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default EmailVerification;
