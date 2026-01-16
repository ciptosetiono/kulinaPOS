import React, { useState } from 'react';
import AuthLayout from './AuthLayout';

interface LoginProps {
  onLogin: (email: string) => void;
  onNavigate: (page: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email);
  };

  return (
    <AuthLayout 
      title="Secure Login" 
      subtitle="Access your Redline Terminal"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Enterprise Email</label>
          <input 
            type="email" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-2xl text-white font-bold outline-none focus:ring-2 focus:ring-red-600 transition-all placeholder:text-slate-700"
            placeholder="ceo@maqpos.com"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Passkey</label>
            <button 
              type="button"
              onClick={() => onNavigate('forgot')}
              className="text-[10px] font-black text-red-600 uppercase tracking-widest hover:text-red-500"
            >
              Reset?
            </button>
          </div>
          <input 
            type="password" 
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-2xl text-white font-bold outline-none focus:ring-2 focus:ring-red-600 transition-all placeholder:text-slate-700"
            placeholder="••••••••"
          />
        </div>

        <button 
          type="submit"
          className="w-full py-5 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-red-600/30 transition-all active:scale-95"
        >
          AUTHENTICATE
        </button>

        <div className="pt-4 text-center">
          <p className="text-sm text-slate-400 font-medium">
            New Organization? {' '}
            <button 
              type="button"
              onClick={() => onNavigate('register')}
              className="text-red-600 font-black hover:underline uppercase tracking-tighter"
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