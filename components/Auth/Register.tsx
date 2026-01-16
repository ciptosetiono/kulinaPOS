
import React, { useState } from 'react';
import AuthLayout from './AuthLayout';

interface RegisterProps {
  onNavigate: (page: string) => void;
}

const Register: React.FC<RegisterProps> = ({ onNavigate }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    orgName: '',
    businessType: 'Restaurant'
  });

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('verify');
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

      <form onSubmit={handleSubmit} className="space-y-6">
        {step === 1 ? (
          <>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
              <input 
                type="text" 
                required
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                placeholder="Alexander Zen"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <input 
                type="email" 
                required
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                placeholder="alex@example.com"
              />
            </div>
            <button 
              type="button"
              onClick={nextStep}
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
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                placeholder="Zen Flavors Group"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Business Category</label>
              <select className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold outline-none focus:ring-2 focus:ring-emerald-500 transition-all appearance-none">
                <option value="Resto">Restaurant & Dining</option>
                <option value="Cafe">Coffee Shop / Cafe</option>
                <option value="Bar">Bar & Nightlife</option>
                <option value="Retail">Retail & Boutique</option>
              </select>
            </div>
            <div className="flex gap-4">
              <button 
                type="button"
                onClick={prevStep}
                className="flex-1 py-5 bg-white/5 text-slate-400 rounded-2xl font-black uppercase tracking-widest transition-all"
              >
                Back
              </button>
              <button 
                type="submit"
                className="flex-[2] py-5 bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 transition-all"
              >
                Create Account
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
