
import React from 'react';
import AuthLayout from './AuthLayout';

interface EmailVerificationProps {
  onNavigate: (page: string) => void;
}

const EmailVerification: React.FC<EmailVerificationProps> = ({ onNavigate }) => {
  return (
    <AuthLayout 
      title="Verify Email" 
      subtitle="We've sent a code to your inbox"
    >
      <div className="text-center space-y-8">
        <div className="flex justify-center gap-3">
          {[1, 2, 3, 4].map(i => (
            <input 
              key={i}
              type="text" 
              maxLength={1}
              className="w-14 h-16 bg-white/5 border border-white/10 rounded-2xl text-white text-3xl font-black text-center outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          ))}
        </div>

        <div className="space-y-4">
          <button 
            type="button"
            onClick={() => onNavigate('login')}
            className="w-full py-5 bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 transition-all"
          >
            Verify & Continue
          </button>
          
          <p className="text-sm text-slate-400 font-medium">
            Didn't receive the email? {' '}
            <button className="text-emerald-500 font-bold hover:underline">
              Resend Code
            </button>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default EmailVerification;
