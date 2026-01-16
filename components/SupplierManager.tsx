
import React, { useState } from 'react';
import { Supplier, PurchaseOrder } from '../types';
import { exportToCSV } from '../lib/exportUtils';

interface SupplierManagerProps {
  suppliers: Supplier[];
  purchaseOrders: PurchaseOrder[];
}

const SupplierManager: React.FC<SupplierManagerProps> = ({ suppliers, purchaseOrders }) => {
  const [activeTab, setActiveTab] = useState<'list' | 'po'>('list');

  const handleExportSuppliers = () => {
    const exportData = suppliers.map(s => ({
      ID: s.id,
      Nama: s.name,
      Kategori: s.category,
      Kontak: s.contact,
      Status: s.status
    }));
    exportToCSV(exportData, 'KulinaPOS_Supplier_List');
  };

  const handleExportPO = () => {
    const exportData = purchaseOrders.map(po => {
      const supplier = suppliers.find(s => s.id === po.supplierId);
      return {
        ID: po.id,
        Supplier: supplier?.name || 'Unknown',
        Items: po.items,
        Amount: po.totalAmount,
        Status: po.status,
        Tanggal: po.date
      };
    });
    exportToCSV(exportData, 'KulinaPOS_PO_History');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('list')}
            className={`px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
              activeTab === 'list' ? 'bg-slate-900 text-white shadow-xl' : 'bg-white text-slate-400'
            }`}
          >
            Daftar Suplier
          </button>
          <button
            onClick={() => setActiveTab('po')}
            className={`px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
              activeTab === 'po' ? 'bg-slate-900 text-white shadow-xl' : 'bg-white text-slate-400'
            }`}
          >
            Purchase Orders (PO)
          </button>
        </div>

        <button 
          onClick={activeTab === 'list' ? handleExportSuppliers : handleExportPO}
          className="bg-white border-2 border-slate-100 text-slate-900 px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-red-50 hover:border-red-100 transition-all flex items-center gap-2 shadow-sm"
        >
          <span>Ekspor CSV</span>
          <span className="text-lg">📥</span>
        </button>
      </div>

      {activeTab === 'list' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suppliers.map(s => (
            <div key={s.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-xl">🚚</div>
                  <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase ${s.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                    {s.status}
                  </span>
                </div>
                <h3 className="text-xl font-black text-slate-800">{s.name}</h3>
                <p className="text-[10px] font-black text-[#3f51b5] uppercase tracking-widest mb-6">{s.category}</p>
                <div className="p-4 bg-slate-50 rounded-2xl">
                  <p className="text-xs font-bold text-slate-500">Contact Person:</p>
                  <p className="text-sm font-black text-slate-800 mt-1">{s.contact}</p>
                </div>
              </div>
              <button className="w-full mt-8 py-3 border-2 border-slate-50 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-colors">Create PO</button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Order ID</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Supplier</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Items Detail</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {purchaseOrders.map(po => {
                const supplier = suppliers.find(s => s.id === po.supplierId);
                return (
                  <tr key={po.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-6 font-black text-slate-400">#{po.id}</td>
                    <td className="px-8 py-6 font-bold text-slate-800">{supplier?.name || 'Unknown'}</td>
                    <td className="px-8 py-6">
                      <p className="text-xs font-medium text-slate-600 truncate max-w-[200px]">{po.items}</p>
                      <p className="text-[9px] font-bold text-slate-300 uppercase mt-1">{po.date}</p>
                    </td>
                    <td className="px-8 py-6 font-black text-emerald-500">Rp {po.totalAmount.toLocaleString('id-ID')}</td>
                    <td className="px-8 py-6 text-right">
                      <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase ${
                        po.status === 'RECEIVED' ? 'bg-emerald-100 text-emerald-600' : 
                        po.status === 'PENDING' ? 'bg-amber-100 text-amber-600 animate-pulse' : 'bg-slate-100 text-slate-400'
                      }`}>
                        {po.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {purchaseOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-slate-300 font-black uppercase tracking-widest">
                    Belum ada riwayat PO
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SupplierManager;
