
import React from 'react';
import { Order, OrderStatus, MenuItem } from '../types';

interface ServiceDisplayProps {
  orders: Order[];
  onUpdateStatus: (id: string, status: OrderStatus) => void;
}

const ServiceDisplay: React.FC<ServiceDisplayProps> = ({ orders, onUpdateStatus }) => {
  const readyOrders = orders.filter(o => o.status === OrderStatus.SERVED);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="bg-emerald-500 p-8 rounded-[2.5rem] text-white shadow-xl shadow-emerald-100 mb-10 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black tracking-tighter uppercase">Siap Sajikan</h2>
          <p className="font-bold opacity-80 text-sm mt-1">Daftar pesanan yang sudah selesai dimasak</p>
        </div>
        <div className="text-5xl">🔔</div>
      </div>

      {readyOrders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
           <p className="text-slate-300 font-black uppercase tracking-widest text-xs">Belum ada pesanan yang siap</p>
        </div>
      ) : (
        readyOrders.map(order => (
          <div key={order.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center justify-between group hover:shadow-xl transition-all">
             <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl font-black">
                   {order.tableNumber}
                </div>
                <div>
                   <h3 className="text-xl font-black text-slate-800">Meja {order.tableNumber}</h3>
                   <p className="text-xs font-bold text-slate-400">Order #{order.id} • {order.items.length} Menu</p>
                </div>
             </div>
             
             <button 
              onClick={() => onUpdateStatus(order.id, OrderStatus.COMPLETED)}
              className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-emerald-500 transition-all shadow-xl shadow-slate-100"
             >
               Sudah Disajikan ✓
             </button>
          </div>
        ))
      )}
    </div>
  );
};

export default ServiceDisplay;
