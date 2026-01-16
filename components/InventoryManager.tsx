
import React from 'react';
import { InventoryItem } from '../types';

interface InventoryManagerProps {
  inventory: InventoryItem[];
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
}

const InventoryManager: React.FC<InventoryManagerProps> = ({ inventory, setInventory }) => {
  const updateStock = (id: string, delta: number) => {
    setInventory(prev => prev.map(item => 
      item.id === id ? { ...item, stock: Math.max(0, item.stock + delta) } : item
    ));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Ingredient/Asset</th>
              <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Stock Level</th>
              <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Threshold</th>
              <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Status</th>
              <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {inventory.map(item => {
              const isLow = item.stock <= item.minThreshold;
              return (
                <tr key={item.id} className="hover:bg-slate-50/30 transition-colors">
                  <td className="px-8 py-6">
                    <div className="font-bold text-slate-800">{item.name}</div>
                    <div className="text-[10px] text-slate-400 font-black uppercase mt-1">ID: {item.id}</div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-lg font-black text-slate-900">{item.stock.toFixed(1)}</span>
                    <span className="text-slate-400 text-xs ml-1 font-bold">{item.unit}</span>
                  </td>
                  <td className="px-8 py-6 font-bold text-slate-500">
                    {item.minThreshold} {item.unit}
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase ${
                      isLow ? 'bg-red-100 text-red-600 ring-4 ring-red-50' : 'bg-emerald-100 text-emerald-600 ring-4 ring-emerald-50'
                    }`}>
                      {isLow ? '⚠️ Restock Required' : '✓ Healthy'}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => updateStock(item.id, -1)}
                        className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors font-bold"
                      >-</button>
                      <button 
                        onClick={() => updateStock(item.id, 1)}
                        className="w-10 h-10 rounded-xl bg-slate-900 text-white hover:bg-emerald-500 transition-colors font-bold"
                      >+</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryManager;
