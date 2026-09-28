import React, { useState } from 'react';
import { Outlet } from '../types';

interface OutletManagerProps {
  outlets: Outlet[];
  setOutlets: React.Dispatch<React.SetStateAction<Outlet[]>>;
  tenantId: string;
}

const OutletManager: React.FC<OutletManagerProps> = ({ outlets, setOutlets, tenantId }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingOutlet, setEditingOutlet] = useState<Partial<Outlet> | null>(null);

  const handleSave = () => {
    if (!editingOutlet?.name || !editingOutlet?.address) return;

    if (editingOutlet.id) {
      setOutlets(prev => prev.map(o => o.id === editingOutlet.id ? editingOutlet as Outlet : o));
    } else {
      const newOutlet: Outlet = {
        id: 'outlet-' + Date.now(),
        tenantId: tenantId,
        name: editingOutlet.name,
        address: editingOutlet.address,
        phone: editingOutlet.phone || 'N/A'
      };
      setOutlets(prev => [...prev, newOutlet]);
    }
    setIsAdding(false);
    setEditingOutlet(null);
  };

  const removeOutlet = (id: string) => {
    if (outlets.length <= 1) {
      alert("Setidaknya satu outlet harus tetap aktif.");
      return;
    }
    if (confirm("Apakah Anda yakin? Semua data yang terhubung ke outlet ini mungkin menjadi tidak dapat diakses.")) {
      setOutlets(prev => prev.filter(o => o.id !== id));
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Manajemen Outlet / Cabang</h2>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Konfigurasi cabang bisnis Anda</p>
        </div>
        <button 
          onClick={() => { setIsAdding(true); setEditingOutlet({ name: '', address: '', phone: '' }); }}
          className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-emerald-600 transition-all flex items-center gap-2 shadow-lg shadow-slate-200"
        >
          Tambah Cabang Baru <span className="text-lg">+</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {outlets.map(outlet => (
          <div key={outlet.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden group hover:shadow-xl transition-all flex flex-col p-8">
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-2xl text-emerald-600">📍</div>
              <div className="flex gap-2">
                <button 
                  onClick={() => { setEditingOutlet(outlet); setIsAdding(true); }}
                  className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:text-fuchsia-600 hover:bg-fuchsia-50 flex items-center justify-center transition-all"
                >
                  ✎
                </button>
                <button 
                  onClick={() => removeOutlet(outlet.id)}
                  className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-all"
                >
                  ×
                </button>
              </div>
            </div>

            <h3 className="text-xl font-black text-slate-800 mb-2">{outlet.name}</h3>
            <p className="text-[10px] font-black text-fuchsia-600 uppercase tracking-widest mb-4">ID Cabang: {outlet.id}</p>
            
            <div className="space-y-3 mt-auto">
              <div className="flex items-start gap-3">
                <span className="text-slate-300">🏠</span>
                <p className="text-xs font-medium text-slate-500 leading-relaxed">{outlet.address}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-slate-300">📞</span>
                <p className="text-xs font-bold text-slate-800">{outlet.phone}</p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-50 flex justify-between items-center">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[9px] font-black uppercase tracking-widest">Aktif</span>
              <button className="text-[10px] font-black uppercase tracking-widest text-fuchsia-600 hover:underline">Lihat Performa →</button>
            </div>
          </div>
        ))}
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl p-10 space-y-8 animate-in zoom-in duration-300">
            <h3 className="text-2xl font-black text-slate-900 uppercase text-center tracking-tight">
              {editingOutlet?.id ? 'Edit Cabang' : 'Cabang Baru'}
            </h3>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Nama Cabang</label>
                <input 
                  autoFocus
                  placeholder="Contoh: Outlet Cabang Jakarta"
                  className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none font-bold outline-none focus:ring-2 focus:ring-fuchsia-600"
                  value={editingOutlet?.name || ''}
                  onChange={e => setEditingOutlet({...editingOutlet, name: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Alamat Lengkap</label>
                <textarea 
                  placeholder="Jalan, Kota, Kode Pos"
                  className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none font-bold outline-none focus:ring-2 focus:ring-fuchsia-600"
                  rows={3}
                  value={editingOutlet?.address || ''}
                  onChange={e => setEditingOutlet({...editingOutlet, address: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Nomor Telepon</label>
                <input 
                  placeholder="Telepon / No HP"
                  className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none font-bold outline-none focus:ring-2 focus:ring-fuchsia-600"
                  value={editingOutlet?.phone || ''}
                  onChange={e => setEditingOutlet({...editingOutlet, phone: e.target.value})}
                />
              </div>
            </div>

            <div className="flex gap-4">
               <button 
                onClick={() => { setIsAdding(false); setEditingOutlet(null); }} 
                className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-bold hover:bg-slate-200 transition-colors"
               >
                 Batal
               </button>
               <button 
                onClick={handleSave} 
                className="flex-[2] py-4 bg-fuchsia-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-fuchsia-100 hover:bg-fuchsia-700 transition-all"
               >
                 Simpan Perubahan
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OutletManager;
