import React, { useState, useEffect } from 'react';
import { Supplier, PurchaseOrder } from '../types';
import { 
  createSupplier, updateSupplier, deleteSupplier, 
  createPurchaseOrder, updatePurchaseOrder, deletePurchaseOrder 
} from '../actions';
import { exportToCSV } from '../lib/exportUtils';

interface SupplierManagerProps {
  suppliers: Supplier[];
  purchaseOrders: PurchaseOrder[];
  setSuppliers?: React.Dispatch<React.SetStateAction<Supplier[]>>;
  setPurchaseOrders?: React.Dispatch<React.SetStateAction<PurchaseOrder[]>>;
}

const SupplierManager: React.FC<SupplierManagerProps> = ({ 
  suppliers = [], 
  purchaseOrders = [],
  setSuppliers,
  setPurchaseOrders
}) => {
  const [activeTab, setActiveTab] = useState<'list' | 'po'>('list');
  const [localSuppliers, setLocalSuppliers] = useState<Supplier[]>(suppliers);
  const [localPOs, setLocalPOs] = useState<PurchaseOrder[]>(purchaseOrders);

  useEffect(() => {
    setLocalSuppliers(suppliers);
  }, [suppliers]);

  useEffect(() => {
    setLocalPOs(purchaseOrders);
  }, [purchaseOrders]);

  // Supplier Modals
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [supplierFormData, setSupplierFormData] = useState<{
    name: string;
    category: string;
    contact: string;
    status: 'ACTIVE' | 'INACTIVE';
  }>({
    name: '',
    category: 'Bahan Baku',
    contact: '',
    status: 'ACTIVE',
  });

  // PO Modals
  const [isPOModalOpen, setIsPOModalOpen] = useState(false);
  const [poFormData, setPOFormData] = useState({
    supplierId: '',
    items: '',
    totalAmount: 0,
    status: 'PENDING',
    date: new Date().toISOString().split('T')[0],
  });

  const [loading, setLoading] = useState(false);

  // Supplier Handlers
  const handleOpenAddSupplier = () => {
    setEditingSupplier(null);
    setSupplierFormData({
      name: '',
      category: 'Bahan Makanan',
      contact: '',
      status: 'ACTIVE',
    });
    setIsSupplierModalOpen(true);
  };

  const handleOpenEditSupplier = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setSupplierFormData({
      name: supplier.name,
      category: supplier.category,
      contact: supplier.contact,
      status: (supplier.status as 'ACTIVE' | 'INACTIVE') || 'ACTIVE',
    });
    setIsSupplierModalOpen(true);
  };

  const handleSaveSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplierFormData.name || !supplierFormData.contact) return;

    setLoading(true);
    try {
      if (editingSupplier) {
        await updateSupplier(editingSupplier.id, supplierFormData);
        const updated = localSuppliers.map(s => s.id === editingSupplier.id ? { ...s, ...supplierFormData } : s);
        setLocalSuppliers(updated);
        if (setSuppliers) setSuppliers(updated);
      } else {
        const newSup = await createSupplier(supplierFormData);
        const added = [{ id: newSup.id, ...supplierFormData }, ...localSuppliers];
        setLocalSuppliers(added);
        if (setSuppliers) setSuppliers(added);
      }
      setIsSupplierModalOpen(false);
    } catch (err: any) {
      alert('Gagal menyimpan supplier: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSupplier = async (supplier: Supplier) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus supplier ${supplier.name}?`)) return;
    try {
      await deleteSupplier(supplier.id);
      const filtered = localSuppliers.filter(s => s.id !== supplier.id);
      setLocalSuppliers(filtered);
      if (setSuppliers) setSuppliers(filtered);
    } catch (err: any) {
      alert('Gagal menghapus supplier: ' + err.message);
    }
  };

  // PO Handlers
  const handleOpenAddPO = (supplierId?: string) => {
    setPOFormData({
      supplierId: supplierId || localSuppliers[0]?.id || '',
      items: '',
      totalAmount: 0,
      status: 'PENDING',
      date: new Date().toISOString().split('T')[0],
    });
    setIsPOModalOpen(true);
  };

  const handleSavePO = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!poFormData.supplierId || !poFormData.items) return;

    setLoading(true);
    try {
      const newPO = await createPurchaseOrder({
        supplierId: poFormData.supplierId,
        items: poFormData.items,
        totalAmount: Number(poFormData.totalAmount),
        status: poFormData.status,
        date: poFormData.date,
      });

      const addedPOs = [{
        id: newPO.id,
        supplierId: newPO.supplierId,
        items: newPO.items,
        totalAmount: newPO.totalAmount,
        status: newPO.status as any,
        date: newPO.date,
      }, ...localPOs];

      setLocalPOs(addedPOs);
      if (setPurchaseOrders) setPurchaseOrders(addedPOs);
      setIsPOModalOpen(false);
    } catch (err: any) {
      alert('Gagal membuat Purchase Order: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePOStatus = async (poId: string, status: string) => {
    try {
      await updatePurchaseOrder(poId, { status });
      const updated = localPOs.map(p => p.id === poId ? { ...p, status: status as any } : p);
      setLocalPOs(updated);
      if (setPurchaseOrders) setPurchaseOrders(updated);
    } catch (err: any) {
      alert('Gagal memperbarui status PO: ' + err.message);
    }
  };

  const handleDeletePO = async (poId: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus PO ini?`)) return;
    try {
      await deletePurchaseOrder(poId);
      const filtered = localPOs.filter(p => p.id !== poId);
      setLocalPOs(filtered);
      if (setPurchaseOrders) setPurchaseOrders(filtered);
    } catch (err: any) {
      alert('Gagal menghapus PO: ' + err.message);
    }
  };

  // Export
  const handleExportSuppliers = () => {
    const exportData = localSuppliers.map(s => ({
      ID: s.id,
      Nama: s.name,
      Kategori: s.category,
      Kontak: s.contact,
      Status: s.status
    }));
    exportToCSV(exportData, 'Daftar_Supplier_KulinaPOS');
  };

  const handleExportPO = () => {
    const exportData = localPOs.map(po => {
      const supplier = localSuppliers.find(s => s.id === po.supplierId);
      return {
        ID: po.id,
        Supplier: supplier?.name || 'Tidak Diketahui',
        Barang: po.items,
        Total: po.totalAmount,
        Status: po.status,
        Tanggal: po.date
      };
    });
    exportToCSV(exportData, 'Riwayat_PO_KulinaPOS');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Top Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('list')}
            className={`px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
              activeTab === 'list' ? 'bg-slate-900 text-white shadow-xl' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            Daftar Supplier ({localSuppliers.length})
          </button>
          <button
            onClick={() => setActiveTab('po')}
            className={`px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
              activeTab === 'po' ? 'bg-slate-900 text-white shadow-xl' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            Pesanan Pembelian / PO ({localPOs.length})
          </button>
        </div>

        <div className="flex flex-wrap gap-3">
          {activeTab === 'list' ? (
            <button 
              onClick={handleOpenAddSupplier}
              className="bg-fuchsia-600 text-white px-6 py-3.5 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-fuchsia-700 transition-all flex items-center gap-2 shadow-lg shadow-fuchsia-200"
            >
              <span>🚚</span> Tambah Supplier Baru
            </button>
          ) : (
            <button 
              onClick={() => handleOpenAddPO()}
              className="bg-fuchsia-600 text-white px-6 py-3.5 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-fuchsia-700 transition-all flex items-center gap-2 shadow-lg shadow-fuchsia-200"
            >
              <span>📝</span> Buat PO Baru
            </button>
          )}

          <button 
            onClick={activeTab === 'list' ? handleExportSuppliers : handleExportPO}
            className="bg-white border-2 border-slate-200 text-slate-900 px-6 py-3.5 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-fuchsia-50 hover:border-fuchsia-200 transition-all flex items-center gap-2 shadow-sm"
          >
            <span>Ekspor CSV</span>
            <span className="text-lg">📥</span>
          </button>
        </div>
      </div>

      {/* Supplier Grid View */}
      {activeTab === 'list' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {localSuppliers.map(s => (
            <div key={s.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-xl transition-all">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-fuchsia-50 text-fuchsia-600 rounded-2xl flex items-center justify-center text-xl border border-fuchsia-100">🚚</div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase ${s.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                      {s.status === 'ACTIVE' ? 'AKTIF' : s.status}
                    </span>
                    <button 
                      onClick={() => handleOpenEditSupplier(s)}
                      className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-xs"
                      title="Edit Supplier"
                    >
                      ✏️
                    </button>
                    <button 
                      onClick={() => handleDeleteSupplier(s)}
                      className="w-8 h-8 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center text-xs"
                      title="Hapus Supplier"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <h3 className="text-xl font-black text-slate-900">{s.name}</h3>
                <p className="text-[10px] font-black text-fuchsia-600 uppercase tracking-widest mb-6">{s.category}</p>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Kontak Person / Telepon:</p>
                  <p className="text-sm font-bold text-slate-800 mt-1">{s.contact}</p>
                </div>
              </div>

              <button 
                onClick={() => handleOpenAddPO(s.id)}
                className="w-full mt-8 py-3.5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-fuchsia-600 transition-all shadow-md"
              >
                + Buat PO ke Supplier Ini
              </button>
            </div>
          ))}

          {localSuppliers.length === 0 && (
            <div className="col-span-full bg-white p-16 rounded-[2.5rem] text-center border border-slate-100">
              <p className="text-slate-400 font-bold">Belum ada data supplier. Klik "Tambah Supplier Baru" untuk menambahkan.</p>
            </div>
          )}
        </div>
      ) : (
        /* PO Table View */
        <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">ID PO</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Supplier</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Detail Barang</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Harga</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status PO</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {localPOs.map(po => {
                const supplier = localSuppliers.find(s => s.id === po.supplierId);
                return (
                  <tr key={po.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-6 font-mono font-bold text-slate-600 text-xs">#{po.id.slice(0, 8)}</td>
                    <td className="px-8 py-6 font-bold text-slate-900">{supplier?.name || 'Supplier Tidak Dikenal'}</td>
                    <td className="px-8 py-6">
                      <p className="text-xs font-bold text-slate-700 max-w-[250px]">{po.items}</p>
                      <p className="text-[10px] font-mono text-slate-400 mt-1">📅 Tanggal: {po.date}</p>
                    </td>
                    <td className="px-8 py-6 font-black text-fuchsia-600 text-sm">Rp {po.totalAmount.toLocaleString('id-ID')}</td>
                    <td className="px-8 py-6">
                      <select
                        value={po.status}
                        onChange={e => handleUpdatePOStatus(po.id, e.target.value)}
                        className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase outline-none border cursor-pointer ${
                          po.status === 'RECEIVED' 
                            ? 'bg-emerald-100 text-emerald-700 border-emerald-300' 
                            : po.status === 'PENDING' 
                            ? 'bg-amber-100 text-amber-700 border-amber-300' 
                            : 'bg-rose-100 text-rose-700 border-rose-300'
                        }`}
                      >
                        <option value="PENDING">🟡 PROSES (PENDING)</option>
                        <option value="RECEIVED">🟢 DITERIMA (RECEIVED)</option>
                        <option value="CANCELLED">🔴 DIBATALKAN</option>
                      </select>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button
                        onClick={() => handleDeletePO(po.id)}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all"
                      >
                        🗑️ Hapus
                      </button>
                    </td>
                  </tr>
                );
              })}
              {localPOs.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-16 text-center text-slate-400 font-bold">
                    Belum ada riwayat Purchase Order (PO). Klik "Buat PO Baru" untuk memulai pesanan ke supplier.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Supplier Modal */}
      {isSupplierModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl border border-slate-100 space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h3 className="text-xl font-black text-slate-900">
                {editingSupplier ? 'Edit Data Supplier' : 'Tambah Supplier Baru'}
              </h3>
              <button
                onClick={() => setIsSupplierModalOpen(false)}
                className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSupplier} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">Nama Perusahaan / Supplier</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: PT Sumber Daging Segar"
                  value={supplierFormData.name}
                  onChange={e => setSupplierFormData({ ...supplierFormData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">Kategori Supplier</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Daging & Bahan Makanan"
                  value={supplierFormData.category}
                  onChange={e => setSupplierFormData({ ...supplierFormData, category: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">Kontak Person / No HP / Email</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Budi (0812-3456-7890)"
                  value={supplierFormData.contact}
                  onChange={e => setSupplierFormData({ ...supplierFormData, contact: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">Status Active</label>
                <select
                  value={supplierFormData.status}
                  onChange={e => setSupplierFormData({ ...supplierFormData, status: e.target.value as 'ACTIVE' | 'INACTIVE' })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                >
                  <option value="ACTIVE">AKTIF</option>
                  <option value="INACTIVE">NONAKTIF</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsSupplierModalOpen(false)}
                  className="flex-1 py-3.5 bg-slate-100 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3.5 bg-fuchsia-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-fuchsia-700 transition-all shadow-lg shadow-fuchsia-200 disabled:opacity-50"
                >
                  {loading ? 'Simpan...' : 'Simpan Supplier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Purchase Order Modal */}
      {isPOModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-lg w-full shadow-2xl border border-slate-100 space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h3 className="text-xl font-black text-slate-900">
                Buat Purchase Order (PO) Baru
              </h3>
              <button
                onClick={() => setIsPOModalOpen(false)}
                className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePO} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">Pilih Supplier</label>
                <select
                  required
                  value={poFormData.supplierId}
                  onChange={e => setPOFormData({ ...poFormData, supplierId: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                >
                  <option value="">-- Pilih Supplier --</option>
                  {localSuppliers.map(s => (
                    <option key={s.id} value={s.id}>
                      🚚 {s.name} ({s.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">Detail Barang & Jumlah</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Contoh: 50kg Daging Sirloin, 20L Minyak Goreng"
                  value={poFormData.items}
                  onChange={e => setPOFormData({ ...poFormData, items: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">Total Harga (Rp)</label>
                  <input
                    type="number"
                    required
                    placeholder="5000000"
                    value={poFormData.totalAmount || ''}
                    onChange={e => setPOFormData({ ...poFormData, totalAmount: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">Tanggal Pemesanan</label>
                  <input
                    type="date"
                    required
                    value={poFormData.date}
                    onChange={e => setPOFormData({ ...poFormData, date: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPOModalOpen(false)}
                  className="flex-1 py-3.5 bg-slate-100 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3.5 bg-fuchsia-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-fuchsia-700 transition-all shadow-lg shadow-fuchsia-200 disabled:opacity-50"
                >
                  {loading ? 'Simpan...' : 'Terbitkan PO'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierManager;
