import React, { useState } from 'react';
import { Order, OrderStatus } from '../types';
import { updateOrder } from '../actions';

interface KitchenViewProps {
  orders: Order[];
  setOrders?: React.Dispatch<React.SetStateAction<Order[]>>;
}

const KitchenView: React.FC<KitchenViewProps> = ({ orders = [], setOrders }) => {
  const [filterCategory, setFilterCategory] = useState<'ALL' | 'PENDING' | 'PREPARING' | 'SERVED'>('ALL');

  const activeOrders = orders.filter(o => o.status !== OrderStatus.CANCELLED && o.status !== OrderStatus.COMPLETED);

  const pendingCount = orders.filter(o => o.status === OrderStatus.PENDING).length;
  const preparingCount = orders.filter(o => o.status === OrderStatus.PREPARING).length;
  const servedCount = orders.filter(o => o.status === OrderStatus.SERVED).length;

  const handleStatusChange = async (orderId: string, nextStatus: OrderStatus) => {
    try {
      await updateOrder(orderId, { status: nextStatus });
      if (setOrders) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: nextStatus } : o));
      }
    } catch (err: any) {
      alert('Gagal memperbarui status pesanan: ' + err.message);
    }
  };

  const filteredOrders = activeOrders.filter(o => {
    if (filterCategory === 'ALL') return true;
    return o.status === filterCategory;
  });

  const getMinutesAgo = (timestamp: number) => {
    const diff = Math.floor((Date.now() - timestamp) / 60000);
    if (diff < 1) return 'Baru saja';
    return `${diff} mnt lalu`;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* KDS Header & Counters */}
      <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-[9px] font-black uppercase tracking-widest border border-amber-500/30">
              🍳 Kitchen Display System (KDS)
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <h2 className="text-3xl font-black tracking-tight">Layar Dapur Live Queue</h2>
          <p className="text-xs text-slate-400 font-medium">Pantau dan ubah status pesanan yang harus dimasak secara real-time.</p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 bg-slate-800/80 p-2 rounded-2xl border border-slate-700">
          <button
            onClick={() => setFilterCategory('ALL')}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
              filterCategory === 'ALL' ? 'bg-fuchsia-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Semua ({activeOrders.length})
          </button>
          <button
            onClick={() => setFilterCategory('PENDING')}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              filterCategory === 'PENDING' ? 'bg-amber-500 text-slate-950 font-black shadow-md' : 'text-amber-400 hover:bg-amber-500/10'
            }`}
          >
            <span>🟡 Antrean Masak</span>
            <span className="px-1.5 py-0.5 bg-amber-950/40 rounded-full text-[8px]">{pendingCount}</span>
          </button>
          <button
            onClick={() => setFilterCategory('PREPARING')}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              filterCategory === 'PREPARING' ? 'bg-blue-600 text-white shadow-md' : 'text-blue-400 hover:bg-blue-600/10'
            }`}
          >
            <span>🔵 Sedang Dimasak</span>
            <span className="px-1.5 py-0.5 bg-blue-950/40 rounded-full text-[8px]">{preparingCount}</span>
          </button>
          <button
            onClick={() => setFilterCategory('SERVED')}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              filterCategory === 'SERVED' ? 'bg-emerald-600 text-white shadow-md' : 'text-emerald-400 hover:bg-emerald-600/10'
            }`}
          >
            <span>🟢 Siap Disajikan</span>
            <span className="px-1.5 py-0.5 bg-emerald-950/40 rounded-full text-[8px]">{servedCount}</span>
          </button>
        </div>
      </div>

      {/* Orders Grid */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] p-16 text-center border border-slate-100 shadow-sm space-y-4">
          <div className="w-20 h-20 bg-slate-50 text-4xl rounded-3xl mx-auto flex items-center justify-center">
            👨‍🍳
          </div>
          <h3 className="text-xl font-black text-slate-800">Tidak ada pesanan aktif di dapur</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Semua pesanan saat ini sudah selesai dimasak atau belum ada pesanan baru dari Kasir/POS.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map(order => {
            const isPending = order.status === OrderStatus.PENDING;
            const isPreparing = order.status === OrderStatus.PREPARING;
            const isServed = order.status === OrderStatus.SERVED;

            return (
              <div
                key={order.id}
                className={`bg-white rounded-[2.5rem] p-6 border-2 shadow-sm flex flex-col justify-between transition-all ${
                  isPending
                    ? 'border-amber-400 ring-2 ring-amber-100'
                    : isPreparing
                    ? 'border-blue-400 ring-2 ring-blue-100'
                    : 'border-emerald-400 ring-2 ring-emerald-100 opacity-80'
                }`}
              >
                {/* Header Card */}
                <div>
                  <div className="flex justify-between items-start mb-4 pb-4 border-b border-slate-100">
                    <div>
                      <span className="px-3 py-1 bg-slate-900 text-white rounded-xl text-[10px] font-black tracking-widest uppercase">
                        {order.tableNumber === 'Takeaway' ? '🥡 Takeaway' : `🪑 Meja ${order.tableNumber}`}
                      </span>
                      <h4 className="text-lg font-black text-slate-900 mt-2">Order #{order.id.slice(-6)}</h4>
                      {order.customerName && (
                        <p className="text-xs font-bold text-slate-500">Pelanggan: {order.customerName}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-100">
                        ⏱️ {getMinutesAgo(order.timestamp)}
                      </span>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="space-y-3 mb-6">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 rounded-2xl space-y-1">
                        <div className="flex justify-between items-start">
                          <p className="font-black text-sm text-slate-900">
                            <span className="text-fuchsia-600 font-extrabold mr-2">{item.quantity}x</span>
                            Item #{item.menuItemId.slice(-4)}
                          </p>
                        </div>
                        {item.selectedOptions && item.selectedOptions.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {item.selectedOptions.map((opt, oIdx) => (
                              <span key={oIdx} className="text-[10px] font-black text-fuchsia-700 bg-fuchsia-100 px-2 py-0.5 rounded-lg border border-fuchsia-200">
                                📌 {opt.optionName}
                              </span>
                            ))}
                          </div>
                        )}
                        {item.notes && (
                          <p className="text-[11px] font-black text-amber-700 bg-amber-50 p-1.5 rounded-lg border border-amber-200 mt-1 italic">
                            ✎ Catatan Khusus: {item.notes}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status Action Button */}
                <div className="pt-4 border-t border-slate-100">
                  {isPending && (
                    <button
                      onClick={() => handleStatusChange(order.id, OrderStatus.PREPARING)}
                      className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-2xl text-xs uppercase tracking-widest shadow-lg shadow-amber-200 transition-all flex items-center justify-center gap-2"
                    >
                      <span>🔥</span> Mulai Masak (PREPARING)
                    </button>
                  )}

                  {isPreparing && (
                    <button
                      onClick={() => handleStatusChange(order.id, OrderStatus.SERVED)}
                      className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl text-xs uppercase tracking-widest shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2"
                    >
                      <span>✅</span> Selesai Masak (SERVED)
                    </button>
                  )}

                  {isServed && (
                    <button
                      onClick={() => handleStatusChange(order.id, OrderStatus.COMPLETED)}
                      className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl text-xs uppercase tracking-widest shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2"
                    >
                      <span>🍽️</span> Sudah Disajikan (SELESAI)
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default KitchenView;
