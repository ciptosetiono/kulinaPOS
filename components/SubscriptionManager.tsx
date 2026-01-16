
import React from 'react';
import { MOCK_INVOICES, MOCK_TENANT } from '../constants';

const SubscriptionManager: React.FC = () => {
  // Calculate trial progress for visual representation
  const getTrialDaysLeft = () => {
    if (!MOCK_TENANT.isTrial || !MOCK_TENANT.trialEndDate) return 0;
    const end = new Date(MOCK_TENANT.trialEndDate).getTime();
    const now = new Date().getTime();
    return Math.max(0, Math.ceil((end - now) / (1000 * 60 * 60 * 24)));
  };

  const daysLeft = getTrialDaysLeft();
  const totalTrialDays = 90;
  const progressPercent = Math.min(100, Math.max(0, ((totalTrialDays - daysLeft) / totalTrialDays) * 100));

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {MOCK_TENANT.isTrial && (
        <div className="bg-red-50 border-2 border-red-100 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
           <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-red-200">🚀</div>
              <div>
                <h3 className="text-xl font-black text-red-600 uppercase tracking-tight">Active Trial Node</h3>
                <p className="text-sm font-bold text-red-400">90-day Free Trial is active for your organization.</p>
              </div>
           </div>
           <div className="flex-1 w-full md:max-w-md px-6">
              <div className="flex justify-between mb-2">
                <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">Trial Progress</span>
                <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">{daysLeft} Days Left</span>
              </div>
              <div className="w-full h-3 bg-red-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-red-600 transition-all duration-1000" 
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
           </div>
           <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-slate-200 hover:bg-red-600 transition-all">
             Unlock Full Plan
           </button>
        </div>
      )}

      {/* Current Plan Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 rounded-[3rem] p-10 text-white shadow-2xl shadow-slate-200 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">MaqPOS Level</p>
              <h2 className="text-4xl font-black tracking-tighter uppercase">{MOCK_TENANT.subscriptionPlan} {MOCK_TENANT.isTrial && '(Trial)'}</h2>
            </div>
            <span className="px-6 py-2 bg-red-600 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-600/30">
              {MOCK_TENANT.isTrial ? '90-Day Free' : 'Active Paid'}
            </span>
          </div>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-8 pt-10 border-t border-white/5">
            <div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Status End</p>
              <p className="text-xl font-bold">{MOCK_TENANT.trialEndDate ? new Date(MOCK_TENANT.trialEndDate).toLocaleDateString() : 'Active'}</p>
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Daily Burn</p>
              <p className="text-xl font-bold text-red-500">Rp 0</p>
            </div>
            <div className="col-span-2 md:col-span-1">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">MaqAI Capability</p>
              <p className="text-xl font-bold">Omni-Insight</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-red-50 flex flex-col justify-between">
           <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-2xl">💳</div>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Billing Info</h3>
           </div>
           <p className="text-sm font-medium text-slate-500 leading-relaxed mb-6">No billing scheduled until {MOCK_TENANT.trialEndDate}. Update your backup payment anytime.</p>
           <button className="w-full mt-auto py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-red-600 transition-all">
             Manage Methods
           </button>
        </div>
      </div>

      {/* Plan Selection */}
      <div className="pt-10">
        <h3 className="text-xl font-black text-slate-800 mb-8 uppercase tracking-tight ml-4">Available Node Configurations</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* STARTER */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm opacity-60 flex flex-col">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Starter</h4>
            <div className="text-2xl font-black text-slate-900 mb-6">Rp 499k <span className="text-xs font-bold text-slate-400">/ mo</span></div>
            <button className="w-full py-4 bg-slate-100 text-slate-400 rounded-xl font-black uppercase tracking-widest text-[10px] cursor-not-allowed">Standard</button>
          </div>
          {/* PREMIUM */}
          <div className="bg-white p-8 rounded-[2.5rem] border-4 border-red-600 shadow-xl shadow-red-100 flex flex-col relative">
            <div className="absolute top-0 right-8 -translate-y-1/2 bg-red-600 text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest">Active Level</div>
            <h4 className="text-xs font-black text-red-600 uppercase tracking-widest mb-2">Premium</h4>
            <div className="text-2xl font-black text-slate-900 mb-6">Rp 1.299k <span className="text-xs font-bold text-slate-400">/ mo</span></div>
            <button className="w-full py-4 bg-slate-50 text-slate-400 rounded-xl font-black uppercase tracking-widest text-[10px] cursor-default">Current Plan</button>
          </div>
          {/* ENTERPRISE */}
          <div className="bg-slate-900 p-8 rounded-[2.5rem] flex flex-col shadow-2xl">
            <h4 className="text-xs font-black text-red-500 uppercase tracking-widest mb-2">Enterprise</h4>
            <div className="text-2xl font-black text-white mb-6">Custom <span className="text-xs font-bold text-slate-500">/ mo</span></div>
            <button className="w-full py-4 bg-red-600 text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-red-700 transition-all">Request Omni</button>
          </div>
        </div>
      </div>

      {/* Invoice History */}
      <div className="pt-10">
        <div className="bg-white rounded-[3rem] border border-red-50 overflow-hidden shadow-sm">
          <div className="p-8 border-b border-red-50 flex justify-between items-center">
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Ledger Archive</h3>
            <button className="text-[10px] font-black text-red-600 uppercase tracking-widest hover:underline">Export Statements</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">REF ID</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">TIER</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">POST DATE</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">AMOUNT</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">STATUS</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-red-50/30">
                {MOCK_INVOICES.map(inv => (
                  <tr key={inv.id} className="hover:bg-red-50/20 transition-colors group">
                    <td className="px-8 py-6 font-black text-slate-800 tracking-tighter text-sm">{inv.id}</td>
                    <td className="px-8 py-6">
                       <span className="text-xs font-bold text-slate-500">{inv.plan}</span>
                    </td>
                    <td className="px-8 py-6">
                       <span className="text-xs font-bold text-slate-400">{inv.date}</span>
                    </td>
                    <td className="px-8 py-6 font-black text-slate-900">Rp {inv.amount.toLocaleString()}</td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[8px] font-black uppercase tracking-widest">
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-all">
                        📄
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionManager;
