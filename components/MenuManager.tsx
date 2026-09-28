import React, { useState } from 'react';
import { MenuItem, Category, ProductOptionGroup, ProductOption } from '../types';
import { suggestNewMenuDescription } from '../services/geminiService';
import { createMenuItem, updateMenuItem, deleteMenuItem } from '../actions';

interface MenuManagerProps {
  items: MenuItem[];
  setItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
}

const MenuManager: React.FC<MenuManagerProps> = ({ items, setItems }) => {
  const [editingItem, setEditingItem] = useState<Partial<MenuItem> | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');

  const formatNumber = (num: number) => {
    return num.toLocaleString('id-ID');
  };

  const handleOpenAdd = () => {
    setEditingItem({
      name: '',
      price: 0,
      category: Category.MAIN_COURSE,
      description: '',
      imageUrl: '',
      inStock: true,
    });
    setImagePreview('');
  };

  const handleOpenEdit = (item: MenuItem) => {
    setEditingItem(item);
    setImagePreview(item.imageUrl || '');
  };

  // ---- Option Groups Helpers ----
  const addOptionGroup = () => {
    setEditingItem(prev => ({
      ...prev,
      optionGroups: [...(prev?.optionGroups || []), { groupName: '', type: 'SINGLE', options: [{ name: '', price: 0 }] }],
    }));
  };

  const removeOptionGroup = (groupIdx: number) => {
    setEditingItem(prev => ({
      ...prev,
      optionGroups: (prev?.optionGroups || []).filter((_, i) => i !== groupIdx),
    }));
  };

  const updateOptionGroup = (groupIdx: number, patch: Partial<ProductOptionGroup>) => {
    setEditingItem(prev => ({
      ...prev,
      optionGroups: (prev?.optionGroups || []).map((g, i) => (i === groupIdx ? { ...g, ...patch } : g)),
    }));
  };

  const addOption = (groupIdx: number) => {
    updateOptionGroup(groupIdx, { options: [...(editingItem?.optionGroups?.[groupIdx]?.options || []), { name: '', price: 0 }] });
  };

  const removeOption = (groupIdx: number, optIdx: number) => {
    updateOptionGroup(groupIdx, { options: (editingItem?.optionGroups?.[groupIdx]?.options || []).filter((_, i) => i !== optIdx) });
  };

  const updateOption = (groupIdx: number, optIdx: number, patch: Partial<ProductOption>) => {
    updateOptionGroup(groupIdx, {
      options: (editingItem?.optionGroups?.[groupIdx]?.options || []).map((o, i) => (i === optIdx ? { ...o, ...patch } : o)),
    });
  };

  const normalizeOptionGroups = (): ProductOptionGroup[] => {
    return (editingItem?.optionGroups || [])
      .map(g => ({ ...g, groupName: g.groupName.trim() || 'Opsi' }))
      .map(g => ({
        ...g,
        options: g.options
          .filter(o => o.name.trim() !== '')
          .map(o => ({ name: o.name.trim(), price: Number(o.price) || 0 })),
      }))
      .filter(g => g.options.length > 0);
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('Ukuran file foto terlalu besar. Maksimal 10MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        // Kompresi & resize agar data URL tetap kecil saat disimpan di database
        const MAX_DIMENSION = 800;
        const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const base64Url = canvas.toDataURL('image/jpeg', 0.8);
        setImagePreview(base64Url);
        setEditingItem(prev => prev ? { ...prev, imageUrl: base64Url } : null);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!editingItem?.name || editingItem.price === undefined) {
      alert('Mohon isi nama produk dan harga.');
      return;
    }

    const finalImageUrl = editingItem.imageUrl || imagePreview || `https://picsum.photos/seed/${encodeURIComponent(editingItem.name)}/400/400`;
    const optionGroups = normalizeOptionGroups();

    setSaving(true);
    try {
      if (editingItem.id) {
        // Update database
        await updateMenuItem(editingItem.id, {
          name: editingItem.name,
          price: Number(editingItem.price),
          category: editingItem.category || Category.MAIN_COURSE,
          description: editingItem.description || '',
          imageUrl: finalImageUrl,
          optionGroups: optionGroups.length > 0 ? optionGroups : null,
        });

        setItems(prev => prev.map(i => i.id === editingItem.id ? {
          ...i,
          name: editingItem.name!,
          price: Number(editingItem.price),
          category: editingItem.category || Category.MAIN_COURSE,
          description: editingItem.description || '',
          imageUrl: finalImageUrl,
          optionGroups: optionGroups.length > 0 ? optionGroups : undefined,
        } : i));
      } else {
        // Create database
        const newDbItem = await createMenuItem({
          name: editingItem.name,
          price: Number(editingItem.price),
          category: (editingItem.category as string) || Category.MAIN_COURSE,
          description: editingItem.description || '',
          imageUrl: finalImageUrl,
          optionGroups: optionGroups.length > 0 ? optionGroups : undefined,
        });

        setItems(prev => [{
          id: newDbItem.id,
          tenantId: newDbItem.tenantId,
          name: newDbItem.name,
          price: newDbItem.price,
          category: newDbItem.category,
          description: newDbItem.description,
          imageUrl: newDbItem.imageUrl,
          inStock: newDbItem.inStock,
          optionGroups: (newDbItem as any).optionGroups || undefined,
        }, ...prev]);
      }

      setEditingItem(null);
      setImagePreview('');
    } catch (err: any) {
      alert('Gagal menyimpan produk: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: MenuItem) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus produk "${item.name}"?`)) return;

    try {
      await deleteMenuItem(item.id);
      setItems(prev => prev.filter(i => i.id !== item.id));
    } catch (err: any) {
      alert('Gagal menghapus produk: ' + err.message);
    }
  };

  const generateAI = async () => {
    if (!editingItem?.name) {
      alert('Isi nama produk terlebih dahulu.');
      return;
    }
    setLoadingAI(true);
    const desc = await suggestNewMenuDescription(editingItem.name);
    setEditingItem(prev => ({ ...prev, description: desc }));
    setLoadingAI(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Katalog Produk & Foto</h2>
          <p className="text-xs text-slate-400 font-medium mt-1">Kelola daftar menu, harga, deskripsi, dan upload foto produk untuk ditampilkan di Terminal Kasir (POS).</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="bg-fuchsia-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-fuchsia-700 transition-all flex items-center gap-2 shadow-lg shadow-fuchsia-200"
        >
          <span>Tambah Produk Baru</span>
          <span className="text-xl">+</span>
        </button>
      </div>

      {/* Menu Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(item => (
          <div key={item.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all flex gap-4 group">
            <div className="w-24 h-24 rounded-3xl overflow-hidden bg-slate-50 shrink-0 border border-slate-100 shadow-inner relative">
              <img src={item.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={item.name} />
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-black text-slate-900 truncate text-base">{item.name}</h3>
                </div>
                <p className="text-fuchsia-600 font-black text-sm mt-0.5">Rp {formatNumber(item.price)}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">{item.category}</p>
                {item.optionGroups && item.optionGroups.length > 0 && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 mt-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-wider border border-emerald-100">
                    🧩 {item.optionGroups.length} grup opsi
                  </span>
                )}
                <p className="text-xs text-slate-500 line-clamp-2 mt-1">{item.description}</p>
              </div>
              
              <div className="flex gap-2 mt-3 pt-3 border-t border-slate-50">
                <button 
                  onClick={() => handleOpenEdit(item)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all"
                >
                  ✏️ Edit
                </button>
                <button 
                  onClick={() => handleDelete(item)}
                  className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all"
                >
                  🗑️ Hapus
                </button>
              </div>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="col-span-full bg-white p-16 rounded-[2.5rem] text-center border border-slate-100">
            <p className="text-slate-400 font-bold">Belum ada produk di katalog. Klik "Tambah Produk Baru" untuk mengunggah produk dan foto pertamamu.</p>
          </div>
        )}
      </div>

      {/* Edit / Add Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl p-8 space-y-6 max-h-[90vh] overflow-y-auto scrollbar-hide border border-slate-100">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h3 className="text-xl font-black text-slate-900">
                {editingItem.id ? 'Edit Produk & Foto' : 'Tambah Produk Baru'}
              </h3>
              <button 
                onClick={() => setEditingItem(null)}
                className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Photo Upload & Preview Section */}
              <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider">Foto Produk (Tampil di Kasir/POS)</label>
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="w-20 h-20 rounded-2xl bg-white overflow-hidden shrink-0 border border-slate-200 flex items-center justify-center text-2xl shadow-sm">
                    {editingItem.imageUrl || imagePreview ? (
                      <img src={editingItem.imageUrl || imagePreview} className="w-full h-full object-cover" alt="Preview" />
                    ) : (
                      <span>🖼️</span>
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 bg-fuchsia-600 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-fuchsia-700 transition-all shadow-md">
                      <span>📤 Upload Foto</span>
                      <input 
                        type="file" 
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageFileChange}
                      />
                    </label>
                    <p className="text-[10px] text-slate-400 font-medium">Pilih file gambar (PNG, JPG, WebP maks 10MB). Foto otomatis dikecilkan agar tampil lancar di kasir.</p>
                  </div>
                </div>

                {/* Option for direct image URL */}
                <div className="pt-1">
                  <input 
                    type="url"
                    placeholder="Atau masukkan URL Foto Web (opsional)..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-fuchsia-500"
                    value={editingItem.imageUrl || ''}
                    onChange={e => {
                      setEditingItem({ ...editingItem, imageUrl: e.target.value });
                      setImagePreview(e.target.value);
                    }}
                  />
                </div>
              </div>

              {/* Product Info Inputs */}
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Nama Produk</label>
                <input 
                  placeholder="Contoh: Burger Daging Truffle Spesial"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-fuchsia-500"
                  value={editingItem.name || ''}
                  onChange={e => setEditingItem({ ...editingItem, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Harga (Rp)</label>
                  <input 
                    type="number"
                    placeholder="50000"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-fuchsia-500"
                    value={editingItem.price !== undefined ? editingItem.price : ''}
                    onChange={e => setEditingItem({ ...editingItem, price: parseFloat(e.target.value) || 0 })}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Kategori Menu</label>
                  <select 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-fuchsia-500"
                    value={editingItem.category || Category.MAIN_COURSE}
                    onChange={e => setEditingItem({ ...editingItem, category: e.target.value as Category })}
                  >
                    {(Object.values(Category) as string[]).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="relative">
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Deskripsi Menu</label>
                <textarea 
                  placeholder="Deskripsi bahan & rasa..."
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-fuchsia-500"
                  value={editingItem.description || ''}
                  onChange={e => setEditingItem({ ...editingItem, description: e.target.value })}
                />
                <button 
                  type="button"
                  onClick={generateAI}
                  disabled={loadingAI}
                  className="absolute bottom-3 right-3 text-xs font-black text-fuchsia-600 hover:text-fuchsia-700 disabled:opacity-50 bg-white px-3 py-1 rounded-xl shadow-sm border border-fuchsia-100"
                >
                  {loadingAI ? 'Memikirkan...' : '✨ Buat via Gemini'}
                </button>
              </div>

              {/* Product Option Groups */}
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center">
                  <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider">
                    🧩 Pilihan Opsi Produk (Opsional)
                  </label>
                  <button
                    type="button"
                    onClick={addOptionGroup}
                    className="text-[10px] font-black text-fuchsia-600 hover:text-fuchsia-700 uppercase tracking-wider bg-fuchsia-50 border border-fuchsia-100 px-3 py-1.5 rounded-xl transition-all"
                  >
                    + Tambah Grup Opsi
                  </button>
                </div>

                {!editingItem.optionGroups?.length && (
                  <p className="text-[10px] text-slate-400 font-medium bg-slate-50 border border-dashed border-slate-200 p-3 rounded-xl leading-relaxed">
                    Tanpa opsi, produk langsung masuk keranjang saat ditekan di Kasir. Tambah grup opsi (mis. Tingkat Kepedasan, Topping) agar kasir wajib memilih sebelum masuk keranjang.
                  </p>
                )}

                {editingItem.optionGroups?.map((group, gIdx) => (
                  <div key={gIdx} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <input
                        placeholder="Nama grup (mis. Topping)"
                        className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-900 outline-none focus:ring-2 focus:ring-fuchsia-500"
                        value={group.groupName}
                        onChange={e => updateOptionGroup(gIdx, { groupName: e.target.value })}
                      />
                      <select
                        className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-600 outline-none focus:ring-2 focus:ring-fuchsia-500"
                        value={group.type}
                        onChange={e => updateOptionGroup(gIdx, { type: e.target.value as 'SINGLE' | 'MULTIPLE' })}
                      >
                        <option value="SINGLE">Pilih Satu</option>
                        <option value="MULTIPLE">Bisa Lebih Dari Satu</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => removeOptionGroup(gIdx)}
                        title="Hapus grup"
                        className="w-8 h-8 shrink-0 bg-white border border-rose-100 text-rose-500 hover:bg-rose-50 rounded-xl text-xs font-black transition-all"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="space-y-2">
                      {group.options.map((opt, oIdx) => (
                        <div key={oIdx} className="flex items-center gap-2">
                          <span className="text-[9px] font-black text-slate-300 uppercase tracking-wider ml-1 shrink-0">•</span>
                          <input
                            placeholder={`Pilihan ${oIdx + 1} (mis. Keju Mozzarella)`}
                            className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-fuchsia-500"
                            value={opt.name}
                            onChange={e => updateOption(gIdx, oIdx, { name: e.target.value })}
                          />
                          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl px-2 shrink-0">
                            <span className="text-[9px] font-black text-slate-400">Rp</span>
                            <input
                              type="number"
                              placeholder="0"
                              className="w-20 py-2 bg-transparent text-xs font-bold text-slate-900 outline-none"
                              value={opt.price !== undefined ? opt.price : ''}
                              onChange={e => updateOption(gIdx, oIdx, { price: parseFloat(e.target.value) || 0 })}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeOption(gIdx, oIdx)}
                            className="w-8 h-8 shrink-0 bg-white border border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-100 rounded-xl text-xs font-black transition-all"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => addOption(gIdx)}
                      className="w-full py-2 border border-dashed border-slate-300 text-[10px] font-black text-slate-500 uppercase tracking-wider rounded-xl hover:border-fuchsia-400 hover:text-fuchsia-600 transition-all"
                    >
                      + Tambah Pilihan
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-100">
              <button 
                type="button"
                onClick={() => setEditingItem(null)}
                className="flex-1 py-3.5 bg-slate-100 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
              >
                Batal
              </button>
              <button 
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="flex-1 py-3.5 bg-fuchsia-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-fuchsia-700 transition-all shadow-lg shadow-fuchsia-200 disabled:opacity-50"
              >
                {saving ? 'Simpan...' : 'Simpan Produk'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuManager;
