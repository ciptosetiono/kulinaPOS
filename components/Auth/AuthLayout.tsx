
import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-500/10 rounded-full blur-[120px]" />
      
      <div className="w-full max-w-md z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-red-600/20">K</span>
            <span className="text-2xl font-black text-white tracking-tighter uppercase">Kulina<span className="text-red-600">POS</span></span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">{title}</h1>
          <p className="text-slate-400 mt-2 font-medium">{subtitle}</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] p-12 shadow-2xl overflow-hidden relative group transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent pointer-events-none" />
          {children}
        </div>

        <div className="mt-8 text-center">
          <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.2em]">
            &copy; 2025 KulinaPOS Enterprise Systems.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
