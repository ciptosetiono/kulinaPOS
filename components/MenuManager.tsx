
import React, { useState } from 'react';
import { MenuItem, Category } from '../types';
import { suggestNewMenuDescription } from '../services/geminiService';

interface MenuManagerProps {
  items: MenuItem[];
  setItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
}

const MenuManager: React.FC<MenuManagerProps> = ({ items, setItems }) => {
  const [editingItem, setEditingItem] = useState<Partial<MenuItem> | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);

  const handleSave = () => {
    if (!editingItem?.name || !editingItem?.price) return;
    
    if (editingItem.id) {
      setItems(prev => prev.map(i => i.id === editingItem.id ? editingItem as MenuItem : i));
    } else {
      const newItem = {
        ...editingItem,
        id: 'm' + Date.now(),
        imageUrl: editingItem.imageUrl || `https://picsum.photos/seed/${editingItem.name}/400/400`,
        inStock: true
      } as MenuItem;
      setItems(prev => [...prev, newItem]);
    }
    setEditingItem(null);
  };

  const generateAI = async () => {
    if (!editingItem?.name) return;
    setLoadingAI(true);
    const desc = await suggestNewMenuDescription(editingItem.name);
    setEditingItem(prev => ({ ...prev, description: desc }));
    setLoadingAI(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-slate-800">Menu Catalog</h2>
        <button 
          onClick={() => setEditingItem({ category: Category.MAIN_COURSE })}
          className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-emerald-600 transition-all flex items-center gap-2"
        >
          <span>Add New Product</span>
          <span className="text-xl">+</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(item => (
          <div key={item.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all flex gap-4">
            <img src={item.imageUrl} className="w-24 h-24 rounded-3xl object-cover shadow-inner" />
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-slate-800 truncate">{item.name}</h3>
                <span className="text-emerald-500 font-black text-sm">${item.price.toFixed(2)}</span>
              </div>
              <p className="text-xs text-slate-400 line-clamp-2 mt-1">{item.description}</p>
              <div className="flex gap-2 mt-3">
                <button 
                  onClick={() => setEditingItem(item)}
                  className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
                >Edit</button>
                <button 
                  onClick={() => setItems(prev => prev.filter(i => i.id !== item.id))}
                  className="text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-600 transition-colors"
                >Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingItem && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl p-10 space-y-6">
            <h3 className="text-2xl font-black text-slate-900">{editingItem.id ? 'Edit Product' : 'New Product'}</h3>
            <div className="space-y-4">
              <input 
                placeholder="Product Name"
                className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold"
                value={editingItem.name || ''}
                onChange={e => setEditingItem({ ...editingItem, name: e.target.value })}
              />
              <div className="flex gap-4">
                <input 
                  type="number"
                  placeholder="Price"
                  className="flex-1 px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold"
                  value={editingItem.price || ''}
                  onChange={e => setEditingItem({ ...editingItem, price: parseFloat(e.target.value) })}
                />
                <select 
                  className="flex-1 px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold"
                  value={editingItem.category}
                  onChange={e => setEditingItem({ ...editingItem, category: e.target.value as Category })}
                >
                  {/* Cast Object.values to string[] to resolve 'unknown' mapping errors */}
                  {(Object.values(Category) as string[]).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="relative">
                <textarea 
                  placeholder="Description"
                  rows={3}
                  className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold"
                  value={editingItem.description || ''}
                  onChange={e => setEditingItem({ ...editingItem, description: e.target.value })}
                />
                <button 
                  onClick={generateAI}
                  disabled={loadingAI}
                  className="absolute bottom-4 right-4 text-xs font-black text-emerald-600 hover:text-emerald-700 disabled:opacity-50"
                >
                  {loadingAI ? 'Thinking...' : '✨ Use Gemini'}
                </button>
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <button 
                onClick={() => setEditingItem(null)}
                className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-bold hover:bg-slate-200"
              >Cancel</button>
              <button 
                onClick={handleSave}
                className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-emerald-500 transition-all"
              >Save Item</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuManager;
