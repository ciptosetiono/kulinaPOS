import React, { useState } from 'react';
import { InventoryItem } from '../types';
import { createInventoryItem, updateInventoryItem, deleteInventoryItem } from '../actions';

interface InventoryManagerProps {
  inventory: InventoryItem[];
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  outletId?: string;
}

const InventoryManager: React.FC<InventoryManagerProps> = ({ inventory, setInventory, outletId = 'outlet-1' }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    stock: 0,
    unit: 'kg',
    minThreshold: 5,
  });

  const [loading, setLoading] = useState(false);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      stock: 10,
      unit: 'kg',
      minThreshold: 5,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      stock: item.stock,
      unit: item.unit,
      minThreshold: item.minThreshold,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    setLoading(true);
    try {
      if (editingItem) {
        // Update DB
        await updateInventoryItem(editingItem.id, {
          name: formData.name,
          stock: Number(formData.stock),
          unit: formData.unit,
          minThreshold: Number(formData.minThreshold),
        });

        setInventory(prev => prev.map(i => i.id === editingItem.id ? {
          ...i,
          name: formData.name,
          stock: Number(formData.stock),
          unit: formData.unit,
          minThreshold: Number(formData.minThreshold),
        } : i));
      } else {
        // Create DB
        const newDbItem = await createInventoryItem({
          outletId,
          name: formData.name,
          stock: Number(formData.stock),
          unit: formData.unit,
          minThreshold: Number(formData.minThreshold),
        });

        setInventory(prev => [...prev, {
          id: newDbItem.id,
          outletId: newDbItem.outletId,
          name: newDbItem.name,
          stock: newDbItem.stock,
          unit: newDbItem.unit,
          minThreshold: newDbItem.minThreshold,
        }]);
      }

      setIsModalOpen(false);
    } catch (err: any) {
      alert('Gagal menyimpan bahan baku: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStockQuick = async (id: string, delta: number) => {
    const currentItem = inventory.find(i => i.id === id);
    if (!currentItem) return;
    const newStock = Math.max(0, currentItem.stock + delta);
    
    // Optimistic UI update
    setInventory(prev => prev.map(item => 
      item.id === id ? { ...item, stock: newStock } : item
    ));

    try {
      await updateInventoryItem(id, { stock: newStock });
    } catch (err: any) {
      console.error('Failed to sync stock update:', err);
    }
  };

  const handleDelete = async (item: InventoryItem) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus ${item.name}?`)) return;
    try {
      await deleteInventoryItem(item.id);
      setInventory(prev => prev.filter(i => i.id !== item.id));
    } catch (err: any) {
      alert('Gagal menghapus item: ' + err.message);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Manajemen Stok & Bahan Baku</h2>
          <p className="text-xs text-slate-400 font-medium mt-1">Pantau, tambah, dan atur batas minimum stok bahan makanan di restoran Anda.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-6 py-4 bg-fuchsia-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-fuchsia-700 transition-all shadow-lg shadow-fuchsia-200 flex items-center gap-2"
        >
          <span>📦</span> Tambah Bahan Baku Baru
        </button>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Bahan / Aset</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Jumlah Stok Saat Ini</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Batas Minimal</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Aksi & Pengaturan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {inventory.map(item => {
              const isLow = item.stock <= item.minThreshold;
              return (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="font-bold text-slate-900 text-sm">{item.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {item.id.slice(0, 8)}</div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-xl font-black text-slate-900">{item.stock.toFixed(1)}</span>
                    <span className="text-slate-400 text-xs ml-1 font-bold">{item.unit}</span>
                  </td>
                  <td className="px-8 py-6 font-bold text-slate-500 text-sm">
                    {item.minThreshold} {item.unit}
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase ${
                      isLow ? 'bg-rose-100 text-rose-600 border border-rose-200' : 'bg-emerald-100 text-emerald-600 border border-emerald-200'
                    }`}>
                      {isLow ? '⚠️ Perlu Restok' : '✓ Aman'}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end items-center gap-3">
                      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
                        <button 
                          onClick={() => updateStockQuick(item.id, -1)}
                          className="w-8 h-8 rounded-lg bg-white text-slate-700 hover:bg-rose-50 hover:text-rose-600 transition-colors font-black text-sm shadow-sm"
                          title="Kurangi 1"
                        >-</button>
                        <button 
                          onClick={() => updateStockQuick(item.id, 1)}
                          className="w-8 h-8 rounded-lg bg-slate-900 text-white hover:bg-emerald-600 transition-colors font-black text-sm shadow-sm"
                          title="Tambah 1"
                        >+</button>
                      </div>

                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
                        className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all"
                      >
                        🗑️ Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {inventory.length === 0 && (
              <tr>
                <td colSpan={5} className="px-8 py-16 text-center text-slate-400 font-bold">
                  Belum ada data bahan baku. Klik tombol "Tambah Bahan Baku Baru" di atas untuk menambahkan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Inventory Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl border border-slate-100 space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h3 className="text-xl font-black text-slate-900">
                {editingItem ? 'Edit Bahan Baku' : 'Tambah Bahan Baku Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">Nama Bahan / Aset</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Daging Sapi Premium"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">Jumlah Stok</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formData.stock}
                    onChange={e => setFormData({ ...formData, stock: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">Satuan (Unit)</label>
                  <select
                    value={formData.unit}
                    onChange={e => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                  >
                    <option value="kg">kg (Kilogram)</option>
                    <option value="gr">gr (Gram)</option>
                    <option value="liter">liter (L)</option>
                    <option value="ml">ml (Milliliter)</option>
                    <option value="pcs">pcs (Pieces)</option>
                    <option value="pack">pack (Paket)</option>
                    <option value="box">box (Dus)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">Batas Minimal Stok (Restok Alert)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={formData.minThreshold}
                  onChange={e => setFormData({ ...formData, minThreshold: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3.5 bg-slate-100 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3.5 bg-fuchsia-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-fuchsia-700 transition-all shadow-lg shadow-fuchsia-200 disabled:opacity-50"
                >
                  {loading ? 'Simpan...' : 'Simpan Bahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManager;
