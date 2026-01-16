
import React, { useState } from 'react';

interface CategoryManagerProps {
  categories: string[];
  setCategories: React.Dispatch<React.SetStateAction<string[]>>;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({ categories, setCategories }) => {
  const [newCat, setNewCat] = useState('');

  const addCategory = () => {
    if (!newCat.trim() || categories.includes(newCat)) return;
    setCategories([...categories, newCat]);
    setNewCat('');
  };

  const removeCategory = (cat: string) => {
    setCategories(categories.filter(c => c !== cat));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
        <h3 className="text-xl font-black text-slate-800 mb-6 uppercase tracking-tight">Add New Category</h3>
        <div className="flex gap-4">
          <input 
            value={newCat}
            onChange={e => setNewCat(e.target.value)}
            placeholder="e.g. Sushi, Steaks, Special Drink..."
            className="flex-1 px-6 py-4 bg-slate-50 rounded-2xl border-none font-bold"
          />
          <button onClick={addCategory} className="px-10 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-600 transition-colors">Add</button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map(cat => (
          <div key={cat} className="bg-white p-6 rounded-[2rem] border-2 border-slate-100 flex justify-between items-center group hover:border-[#3f51b5] transition-all">
            <span className="font-bold text-slate-800">{cat}</span>
            <button onClick={() => removeCategory(cat)} className="text-red-400 hover:text-red-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryManager;
