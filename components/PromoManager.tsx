
import React, { useState } from 'react';
import { Discount } from '../types';

interface PromoManagerProps {
  promos: Discount[];
  setPromos: React.Dispatch<React.SetStateAction<Discount[]>>;
}

const PromoManager: React.FC<PromoManagerProps> = ({ promos, setPromos }) => {
  const [editingPromo, setEditingPromo] = useState<Partial<Discount> | null>(null);

  const handleSave = () => {
    if (!editingPromo?.name || editingPromo?.value === undefined) return;
    if (editingPromo.id) {
      setPromos(prev => prev.map(p => p.id === editingPromo.id ? editingPromo as Discount : p));
    } else {
      setPromos(prev => [...prev, { ...editingPromo, id: 'p' + Date.now(), isActive: true } as Discount]);
    }
    setEditingPromo(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-slate-800">Promotions & Discounts</h2>
        <button onClick={() => setEditingPromo({ type: 'PERCENTAGE', value: 0 })} className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-emerald-600 flex items-center gap-2">
          <span>New Promo</span><span className="text-xl">+</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {promos.map(promo => (
          <div key={promo.id} className={`p-8 bg-white rounded-[2.5rem] border-2 shadow-sm transition-all flex flex-col justify-between h-56 ${promo.isActive ? 'border-emerald-100' : 'border-slate-100 opacity-60'}`}>
            <div>
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-black text-slate-800">{promo.name}</h3>
                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${promo.isActive ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                  {promo.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="text-4xl font-black text-[#3f51b5] mt-4">
                {promo.type === 'PERCENTAGE' ? `${promo.value}%` : `Rp ${promo.value.toFixed(3)}`}
                <span className="text-sm font-bold text-slate-400 ml-2">OFF</span>
              </p>
            </div>
            <div className="flex gap-4 pt-6 border-t border-slate-50">
               <button onClick={() => setEditingPromo(promo)} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">Edit</button>
               <button onClick={() => setPromos(prev => prev.map(p => p.id === promo.id ? {...p, isActive: !p.isActive} : p))} className="text-[10px] font-black uppercase tracking-widest text-emerald-500 hover:text-emerald-700 transition-colors">
                 {promo.isActive ? 'Deactivate' : 'Activate'}
               </button>
               <button onClick={() => setPromos(prev => prev.filter(p => p.id !== promo.id))} className="text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-600 transition-colors ml-auto">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {editingPromo && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl p-10 space-y-6">
            <h3 className="text-2xl font-black">{editingPromo.id ? 'Edit Promo' : 'Create Promo'}</h3>
            <div className="space-y-4">
               <input placeholder="Promo Name" className="w-full px-6 py-4 bg-slate-50 rounded-2xl font-bold border-none" value={editingPromo.name || ''} onChange={e=>setEditingPromo({...editingPromo, name: e.target.value})} />
               <div className="flex gap-4">
                 <select className="flex-1 px-6 py-4 bg-slate-50 rounded-2xl font-bold border-none" value={editingPromo.type} onChange={e=>setEditingPromo({...editingPromo, type: e.target.value as any})}>
                   <option value="PERCENTAGE">Percentage (%)</option>
                   <option value="FIXED">Fixed Amount (Rp)</option>
                 </select>
                 <input type="number" placeholder="Value" className="flex-1 px-6 py-4 bg-slate-50 rounded-2xl font-bold border-none" value={editingPromo.value || ''} onChange={e=>setEditingPromo({...editingPromo, value: Number(e.target.value)})} />
               </div>
            </div>
            <div className="flex gap-3 pt-4">
               <button onClick={()=>setEditingPromo(null)} className="flex-1 py-4 bg-slate-100 rounded-2xl font-bold">Cancel</button>
               <button onClick={handleSave} className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-bold">Save Promo</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromoManager;
