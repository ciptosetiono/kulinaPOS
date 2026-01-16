
import React, { useState } from 'react';
import { Customer, Feedback } from '../types';
import { exportToCSV } from '../lib/exportUtils';

interface CustomerManagerProps {
  customers: Customer[];
  feedbacks: Feedback[];
}

const CustomerManager: React.FC<CustomerManagerProps> = ({ customers, feedbacks }) => {
  const [activeTab, setActiveTab] = useState<'list' | 'loyalty' | 'feedback'>('list');

  const handleExport = () => {
    const exportData = customers.map(c => ({
      ID: c.id,
      Nama: c.name,
      Telepon: c.phone,
      Email: c.email,
      Tier: c.tier,
      Poin: c.points,
      Total_Belanja: c.totalSpent
    }));
    exportToCSV(exportData, 'KulinaPOS_Customer_Database');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          {[
            { id: 'list', label: 'Database', icon: '📋' },
            { id: 'loyalty', label: 'Loyalty Tiers', icon: '👑' },
            { id: 'feedback', label: 'Reviews', icon: '⭐' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all ${
                activeTab === tab.id ? 'bg-slate-900 text-white shadow-xl' : 'bg-white text-slate-400 hover:bg-slate-50'
              }`}
            >
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>
        
        {activeTab === 'list' && (
          <button 
            onClick={handleExport}
            className="bg-white border-2 border-slate-100 text-slate-900 px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-red-50 hover:border-red-100 transition-all flex items-center gap-2 shadow-sm"
          >
            <span>Ekspor CSV</span>
            <span className="text-lg">📥</span>
          </button>
        )}
      </div>

      {activeTab === 'list' && (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer Name</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Info</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tier</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Spent</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {customers.map(c => (
                <tr key={c.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#3f51b5]/10 flex items-center justify-center font-black text-[#3f51b5]">{c.name[0]}</div>
                      <span className="font-bold text-slate-800">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-sm text-slate-500 font-medium">{c.phone}</div>
                    <div className="text-[10px] text-slate-300 font-bold">{c.email}</div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      c.tier === 'PLATINUM' ? 'bg-purple-100 text-purple-700' : 
                      c.tier === 'GOLD' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {c.tier}
                    </span>
                  </td>
                  <td className="px-8 py-6 font-bold text-slate-700">Rp {c.totalSpent.toLocaleString('id-ID')}</td>
                  <td className="px-8 py-6 text-right font-black text-[#3f51b5]">{c.points.toLocaleString()} pts</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'loyalty' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { tier: 'SILVER', perks: ['5% Birthday Discount', 'Basic Rewards'], min: '0', color: 'bg-slate-100 text-slate-600' },
            { tier: 'GOLD', perks: ['10% Birthday Discount', 'Free Coffee Weekly', 'Priority Seating'], min: '500.000', color: 'bg-amber-100 text-amber-700' },
            { tier: 'PLATINUM', perks: ['15% Birthday Discount', 'Monthly Free Meal', 'Concierge Service', 'Private Events'], min: '2.000.000', color: 'bg-indigo-100 text-[#3f51b5]' }
          ].map(tier => (
            <div key={tier.tier} className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 flex flex-col items-center text-center">
              <div className={`w-16 h-16 rounded-3xl flex items-center justify-center text-2xl mb-6 ${tier.color}`}>🏆</div>
              <h3 className="text-2xl font-black mb-2">{tier.tier}</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-8">Spend Rp {tier.min}+</p>
              <div className="space-y-4 w-full">
                {tier.perks.map(perk => (
                  <div key={perk} className="text-sm font-bold text-slate-600 flex items-center gap-3">
                    <span className="text-emerald-500">✓</span> {perk}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'feedback' && (
        <div className="space-y-4 max-w-4xl mx-auto">
          {feedbacks.map(f => {
            const customer = customers.find(c => c.id === f.customerId);
            return (
              <div key={f.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex gap-6">
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl shrink-0">💬</div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-black text-slate-800 uppercase tracking-tight">{customer?.name || 'Anonymous'}</h4>
                    <span className="text-emerald-500 font-black text-lg">{'★'.repeat(f.rating)}{'☆'.repeat(5-f.rating)}</span>
                  </div>
                  <p className="text-slate-500 font-medium italic">"{f.comment}"</p>
                  <div className="mt-4 pt-4 border-t border-slate-50 text-[10px] font-black text-slate-300 uppercase tracking-widest">Received on {f.date}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CustomerManager;
