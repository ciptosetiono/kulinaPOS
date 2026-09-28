
import React from 'react';
import { Order, OrderStatus, MenuItem } from '../types';

interface KitchenDisplayProps {
  orders: Order[];
  menuItems: MenuItem[];
  onUpdateStatus: (id: string, status: OrderStatus) => void;
}

const KitchenDisplay: React.FC<KitchenDisplayProps> = ({ orders, menuItems, onUpdateStatus }) => {
  const kitchenOrders = orders.filter(o => o.status === OrderStatus.PENDING || o.status === OrderStatus.PREPARING);

  const getTimeDiff = (timestamp: number) => {
    const diff = Math.floor((Date.now() - timestamp) / 60000);
    return diff > 0 ? `${diff} mnt yang lalu` : 'Baru saja';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in duration-500">
      {kitchenOrders.length === 0 ? (
        <div className="col-span-full py-20 text-center text-slate-300 font-black uppercase tracking-widest">
          Dapur Bersih - Tidak Ada Pesanan
        </div>
      ) : kitchenOrders.map(order => (
        <div key={order.id} className={`bg-white rounded-[2rem] border-2 shadow-sm flex flex-col overflow-hidden ${order.status === OrderStatus.PREPARING ? 'border-[#3f51b5]' : 'border-slate-100'}`}>
          <div className={`p-5 flex justify-between items-center ${order.status === OrderStatus.PREPARING ? 'bg-[#3f51b5] text-white' : 'bg-slate-50 text-slate-900'}`}>
            <div>
              <h4 className="font-black text-sm uppercase tracking-tighter">Meja {order.tableNumber}</h4>
              <p className="text-[10px] font-bold opacity-70">#{order.id.slice(0,6)} • {getTimeDiff(order.timestamp)}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${order.status === OrderStatus.PREPARING ? 'bg-white/20' : 'bg-slate-200'}`}>
              {order.status}
            </span>
          </div>
          
          <div className="p-6 flex-1 space-y-4">
            {order.items.map((item, idx) => {
              const menu = menuItems.find(m => m.id === item.menuItemId);
              return (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <div className="flex justify-between items-start gap-4">
                    <p className="font-bold text-slate-800 leading-tight">{menu?.name}</p>
                    <span className="w-8 h-8 bg-white rounded-lg flex items-center justify-center font-black text-xs text-slate-700 shadow-sm border border-slate-100">x{item.quantity}</span>
                  </div>
                  {item.selectedOptions && item.selectedOptions.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {item.selectedOptions.map((opt, oIdx) => (
                        <span key={oIdx} className="text-[9px] font-black text-fuchsia-700 bg-fuchsia-100 px-2 py-0.5 rounded border border-fuchsia-200">
                          📌 {opt.optionName}
                        </span>
                      ))}
                    </div>
                  )}
                  {item.notes && <p className="text-[10px] text-amber-700 font-black mt-1 italic bg-amber-50 p-1 rounded border border-amber-200">✎ {item.notes}</p>}
                </div>
              );
            })}
          </div>

          <div className="p-4 bg-slate-50 border-t">
            {order.status === OrderStatus.PENDING ? (
              <button 
                onClick={() => onUpdateStatus(order.id, OrderStatus.PREPARING)}
                className="w-full py-4 bg-[#3f51b5] text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-100"
              >
                Mulai Masak
              </button>
            ) : (
              <button 
                onClick={() => onUpdateStatus(order.id, OrderStatus.SERVED)}
                className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100"
              >
                Selesai & Panggil Pelayan
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KitchenDisplay;
