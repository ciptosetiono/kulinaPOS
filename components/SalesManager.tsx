
import React from 'react';
import { Order, OrderStatus } from '../types';
import { exportToCSV } from '../lib/exportUtils';

interface SalesManagerProps {
  orders: Order[];
}

const SalesManager: React.FC<SalesManagerProps> = ({ orders }) => {
  const handleExport = () => {
    const exportData = orders.map(o => ({
      ID: o.id,
      Tanggal: new Date(o.timestamp).toLocaleDateString(),
      Jam: new Date(o.timestamp).toLocaleTimeString(),
      Customer: o.customerName || 'Tamu',
      Meja: o.tableNumber,
      Subtotal: o.total,
      Pajak: o.tax,
      Total: o.grandTotal,
      Metode_Bayar: o.paymentMethod || 'N/A',
      Status: o.status
    }));
    exportToCSV(exportData, 'KulinaPOS_Sales_Report');
  };

  const formatCurrency = (val: number) => `Rp ${val.toLocaleString('id-ID')}`;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Riwayat Penjualan</h2>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Pantau semua transaksi outlet Anda</p>
        </div>
        <button 
          onClick={handleExport}
          className="bg-white border-2 border-slate-100 text-slate-900 px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-red-50 hover:border-red-100 transition-all flex items-center gap-2 shadow-sm"
        >
          <span>Ekspor CSV</span>
          <span className="text-lg">📥</span>
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Order ID</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Detail Pelanggan</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Meja</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Total</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {orders.map(order => (
              <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-6 font-black text-slate-400">#{order.id.slice(0, 6)}</td>
                <td className="px-8 py-6">
                  <div className="font-bold text-slate-800">{order.customerName || 'Walk-in Customer'}</div>
                  <div className="text-[10px] text-slate-300 font-bold uppercase">{new Date(order.timestamp).toLocaleString()}</div>
                </td>
                <td className="px-8 py-6">
                   <span className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-500 uppercase">
                     {order.tableNumber === 'Takeaway' ? '🥡 T.AWAY' : `🪑 MEJA ${order.tableNumber}`}
                   </span>
                </td>
                <td className="px-8 py-6 font-black text-red-600">
                   {formatCurrency(order.grandTotal)}
                </td>
                <td className="px-8 py-6 text-right">
                   <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase ${
                     order.status === OrderStatus.COMPLETED ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                   }`}>
                     {order.status}
                   </span>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={5} className="px-8 py-20 text-center text-slate-300 font-black uppercase tracking-widest">
                  Belum ada data transaksi
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesManager;
