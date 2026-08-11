'use client';

import React, { useState } from 'react';
import AuthLayout from './AuthLayout';
import { createClient } from '@/utils/supabase/client';

interface RegisterProps {
  onNavigate: (page: string) => void;
}

const Register: React.FC<RegisterProps> = ({ onNavigate }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    orgName: '',
    businessType: 'Restaurant'
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const supabase = createClient();

  const nextStep = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);
    setStep(prev => prev + 1);
  };
  const prevStep = () => {
    setErrorMsg(null);
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const emailRedirectTo = `${window.location.origin}/auth/callback?next=/dashboard`;
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo,
          data: {
            full_name: formData.name,
            org_name: formData.orgName,
            business_type: formData.businessType,
          }
        }
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        onNavigate(`verify?email=${encodeURIComponent(formData.email)}`);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title={step === 1 ? "Get Started" : "Organization Details"} 
      subtitle={step === 1 ? "Create your professional account" : "Tell us about your business"}
    >
      <div className="flex justify-center gap-2 mb-8">
        <div className={`h-1.5 rounded-full transition-all ${step >= 1 ? 'w-12 bg-emerald-500' : 'w-4 bg-white/10'}`} />
        <div className={`h-1.5 rounded-full transition-all ${step >= 2 ? 'w-12 bg-emerald-500' : 'w-4 bg-white/10'}`} />
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold">
          {errorMsg}
        </div>
      )}

      <form onSubmit={step === 1 ? nextStep : handleSubmit} className="space-y-6">
        {step === 1 ? (
          <>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                placeholder="Alexander Zen"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <input 
                type="email" 
                required
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                placeholder="alex@example.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <input 
                type="password" 
                required
                minLength={6}
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                placeholder="••••••••"
              />
            </div>
            <button 
              type="submit"
              className="w-full py-5 bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 transition-all"
            >
              Continue
            </button>
          </>
        ) : (
          <>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Organization Name</label>
              <input 
                type="text" 
                required
                value={formData.orgName}
                onChange={e => setFormData({ ...formData, orgName: e.target.value })}
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                placeholder="Zen Flavors Group"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Business Category</label>
              <select 
                value={formData.businessType}
                onChange={e => setFormData({ ...formData, businessType: e.target.value })}
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold outline-none focus:ring-2 focus:ring-emerald-500 transition-all appearance-none"
              >
                <option value="Restaurant" className="bg-slate-900 text-white">Restaurant & Dining</option>
                <option value="Cafe" className="bg-slate-900 text-white">Coffee Shop / Cafe</option>
                <option value="Bar" className="bg-slate-900 text-white">Bar & Nightlife</option>
                <option value="Retail" className="bg-slate-900 text-white">Retail & Boutique</option>
              </select>
            </div>
            <div className="flex gap-4">
              <button 
                type="button"
                onClick={prevStep}
                disabled={loading}
                className="flex-1 py-5 bg-white/5 text-slate-400 rounded-2xl font-black uppercase tracking-widest transition-all"
              >
                Back
              </button>
              <button 
                type="submit"
                disabled={loading}
                className="flex-[2] py-5 bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                ) : (
                  'Create Account'
                )}
              </button>
            </div>
          </>
        )}

        <div className="pt-4 text-center">
          <p className="text-sm text-slate-400 font-medium">
            Already have an account? {' '}
            <button 
              type="button"
              onClick={() => onNavigate('login')}
              className="text-emerald-500 font-bold hover:underline"
            >
              Sign In
            </button>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Register;
