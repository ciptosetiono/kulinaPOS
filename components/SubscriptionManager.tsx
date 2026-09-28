import React from 'react';
import { Tenant, Invoice } from '../types';

interface SubscriptionManagerProps {
  tenant?: Tenant | null;
}

const SubscriptionManager: React.FC<SubscriptionManagerProps> = ({ tenant }) => {
  const currentTenant = tenant || {
    id: 'tenant-1',
    name: 'Hospitality Enterprise',
    subscriptionPlan: 'PREMIUM' as const,
    isTrial: true,
    trialStartDate: '2025-01-01',
    trialEndDate: '2025-04-01',
  };

  const mockInvoices: Invoice[] = [
    { id: 'INV-TRIAL-90D', date: currentTenant.trialStartDate || '2025-01-01', amount: 0, status: 'PAID', plan: 'Uji Coba Premium (90 Hari)' },
  ];

  const getTrialDaysLeft = () => {
    if (!currentTenant.isTrial || !currentTenant.trialEndDate) return 0;
    const end = new Date(currentTenant.trialEndDate).getTime();
    const now = new Date().getTime();
    return Math.max(0, Math.ceil((end - now) / (1000 * 60 * 60 * 24)));
  };

  const daysLeft = getTrialDaysLeft();
  const totalTrialDays = 90;
  const progressPercent = Math.min(100, Math.max(0, ((totalTrialDays - daysLeft) / totalTrialDays) * 100));

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {currentTenant.isTrial && (
        <div className="bg-fuchsia-50 border-2 border-fuchsia-100 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
           <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-fuchsia-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-fuchsia-200">🚀</div>
              <div>
                <h3 className="text-xl font-black text-fuchsia-600 uppercase tracking-tight">Masa Uji Coba Aktif</h3>
                <p className="text-sm font-bold text-fuchsia-400">Uji coba gratis 90 hari aktif untuk organisasi Anda.</p>
              </div>
           </div>
           <div className="flex-1 w-full md:max-w-md px-6">
              <div className="flex justify-between mb-2">
                <span className="text-[10px] font-black text-fuchsia-600 uppercase tracking-widest">Progres Uji Coba</span>
                <span className="text-[10px] font-black text-fuchsia-600 uppercase tracking-widest">{daysLeft} Hari Tersisa</span>
              </div>
              <div className="w-full h-3 bg-fuchsia-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-fuchsia-600 transition-all duration-1000" 
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
           </div>
           <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-slate-200 hover:bg-fuchsia-600 transition-all">
             Tingkatkan Paket Full
           </button>
        </div>
      )}

      {/* Current Plan Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 rounded-[3rem] p-10 text-white shadow-2xl shadow-slate-200 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-600/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Paket Langganan</p>
              <h2 className="text-4xl font-black tracking-tighter uppercase">{currentTenant.subscriptionPlan} {currentTenant.isTrial && '(Uji Coba)'}</h2>
            </div>
            <span className="px-6 py-2 bg-fuchsia-600 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-fuchsia-600/30">
              {currentTenant.isTrial ? 'Gratis 90 Hari' : 'Berbayar Aktif'}
            </span>
          </div>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-8 pt-10 border-t border-white/5">
            <div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Akhir Masa Berlaku</p>
              <p className="text-xl font-bold">{currentTenant.trialEndDate ? new Date(currentTenant.trialEndDate).toLocaleDateString('id-ID') : 'Aktif'}</p>
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Biaya Harian</p>
              <p className="text-xl font-bold text-fuchsia-500">Rp 0</p>
            </div>
            <div className="col-span-2 md:col-span-1">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Kemampuan AI Hub</p>
              <p className="text-xl font-bold">Wawasan Lengkap</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-fuchsia-50 flex flex-col justify-between">
           <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-fuchsia-50 rounded-2xl flex items-center justify-center text-2xl">💳</div>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Informasi Tagihan</h3>
           </div>
           <p className="text-sm font-medium text-slate-500 leading-relaxed mb-6">Tidak ada tagihan hingga {currentTenant.trialEndDate || 'masa uji coba berakhir'}. Anda dapat memperbarui metode pembayaran kapan saja.</p>
           <button className="w-full mt-auto py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-fuchsia-600 transition-all">
             Kelola Metode Pembayaran
           </button>
        </div>
      </div>

      {/* Plan Selection */}
      <div className="pt-10">
        <h3 className="text-xl font-black text-slate-800 mb-8 uppercase tracking-tight ml-4">Pilihan Paket Tersedia</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* STARTER */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm opacity-60 flex flex-col">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Starter</h4>
            <div className="text-2xl font-black text-slate-900 mb-6">Rp 499rb <span className="text-xs font-bold text-slate-400">/ bln</span></div>
            <button className="w-full py-4 bg-slate-100 text-slate-400 rounded-xl font-black uppercase tracking-widest text-[10px] cursor-not-allowed">Standar</button>
          </div>
          {/* PREMIUM */}
          <div className="bg-white p-8 rounded-[2.5rem] border-4 border-fuchsia-600 shadow-xl shadow-fuchsia-100 flex flex-col relative">
            <div className="absolute top-0 right-8 -translate-y-1/2 bg-fuchsia-600 text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest">Paket Aktif</div>
            <h4 className="text-xs font-black text-fuchsia-600 uppercase tracking-widest mb-2">Premium</h4>
            <div className="text-2xl font-black text-slate-900 mb-6">Rp 1.299rb <span className="text-xs font-bold text-slate-400">/ bln</span></div>
            <button className="w-full py-4 bg-slate-50 text-slate-400 rounded-xl font-black uppercase tracking-widest text-[10px] cursor-default">Paket Saat Ini</button>
          </div>
          {/* ENTERPRISE */}
          <div className="bg-slate-900 p-8 rounded-[2.5rem] flex flex-col shadow-2xl">
            <h4 className="text-xs font-black text-fuchsia-500 uppercase tracking-widest mb-2">Enterprise</h4>
            <div className="text-2xl font-black text-white mb-6">Kustom <span className="text-xs font-bold text-slate-500">/ bln</span></div>
            <button className="w-full py-4 bg-fuchsia-600 text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-fuchsia-700 transition-all">Hubungi Tim Sales</button>
          </div>
        </div>
      </div>

      {/* Invoice History */}
      <div className="pt-10">
        <div className="bg-white rounded-[3rem] border border-fuchsia-50 overflow-hidden shadow-sm">
          <div className="p-8 border-b border-fuchsia-50 flex justify-between items-center">
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Arsip Faktur & Tagihan</h3>
            <button className="text-[10px] font-black text-fuchsia-600 uppercase tracking-widest hover:underline">Ekspor Laporan</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">NO REF</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">PAKET</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">TANGGAL</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">JUMLAH</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">STATUS</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-fuchsia-50/30">
                {mockInvoices.map(inv => (
                  <tr key={inv.id} className="hover:bg-fuchsia-50/20 transition-colors group">
                    <td className="px-8 py-6 font-black text-slate-800 tracking-tighter text-sm">{inv.id}</td>
                    <td className="px-8 py-6">
                       <span className="text-xs font-bold text-slate-500">{inv.plan}</span>
                    </td>
                    <td className="px-8 py-6">
                       <span className="text-xs font-bold text-slate-400">{inv.date}</span>
                    </td>
                    <td className="px-8 py-6 font-black text-slate-900">Rp {inv.amount.toLocaleString('id-ID')}</td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[8px] font-black uppercase tracking-widest">
                        {inv.status === 'PAID' ? 'LUNAS' : inv.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-fuchsia-50 hover:text-fuchsia-600 transition-all">
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