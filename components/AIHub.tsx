import React, { useState, useEffect } from 'react';
import { getBusinessInsights, suggestNewMenuDescription } from '../services/geminiService';
import { InventoryItem } from '../types';

interface AIHubProps {
  inventory?: InventoryItem[];
}

const AIHub: React.FC<AIHubProps> = ({ inventory = [] }) => {
  const [insights, setInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [suggestName, setSuggestName] = useState('');
  const [suggestResult, setSuggestResult] = useState('');
  const [suggestLoading, setSuggestLoading] = useState(false);

  useEffect(() => {
    const fetchInsights = async () => {
      const result = await getBusinessInsights([], inventory);
      setInsights(result);
      setLoading(false);
    };
    fetchInsights();
  }, [inventory]);

  const handleSuggest = async () => {
    if (!suggestName) return;
    setSuggestLoading(true);
    const result = await suggestNewMenuDescription(suggestName);
    setSuggestResult(result);
    setSuggestLoading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-gradient-to-br from-fuchsia-600 to-fuchsia-900 rounded-[3rem] p-10 text-white shadow-2xl shadow-fuchsia-200">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-3xl shadow-lg">
            ✨
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight">KulinaAI Business Hub</h2>
            <p className="text-fuchsia-100 text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Analisis Kecerdasan Buatan</p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-white/5 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {insights.map((insight, idx) => (
              <div key={idx} className="bg-white/10 hover:bg-white/15 transition-all p-6 rounded-[2rem] border border-white/5 flex gap-5 items-center group">
                <span className="text-fuchsia-300 font-black text-2xl opacity-40 group-hover:opacity-100 transition-opacity">0{idx + 1}</span>
                <p className="text-base font-medium leading-relaxed">{insight}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-fuchsia-50 flex flex-col">
        <div className="flex items-center gap-4 mb-10 text-slate-900">
          <div className="w-14 h-14 bg-fuchsia-50 text-fuchsia-600 rounded-2xl flex items-center justify-center text-3xl shadow-sm">
            🖊️
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight">Generator Deskripsi Menu</h2>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Asisten Penulis Deskripsi Otomatis</p>
          </div>
        </div>

        <div className="flex-1 space-y-6">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Produk / Makanan</label>
            <input 
              value={suggestName}
              onChange={(e) => setSuggestName(e.target.value)}
              placeholder="Contoh: Nasi Goreng Spesial Kulina"
              className="w-full px-6 py-5 bg-slate-50 rounded-2xl border-none focus:ring-4 focus:ring-fuchsia-100 transition-all outline-none font-bold text-slate-900"
            />
          </div>

          <button 
            onClick={handleSuggest}
            disabled={suggestLoading}
            className="w-full py-5 bg-fuchsia-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-fuchsia-700 transition-all shadow-xl shadow-fuchsia-200 flex items-center justify-center gap-3 active:scale-95"
          >
            {suggestLoading ? (
              <span className="animate-spin text-xl">⚙️</span>
            ) : (
              <><span>Buat Deskripsi Otomatis</span><span>✨</span></>
            )}
          </button>

          {suggestResult && (
            <div className="mt-8 p-8 bg-fuchsia-50/50 rounded-[2.5rem] border border-fuchsia-100 relative animate-in fade-in zoom-in duration-300">
              <h4 className="text-[9px] uppercase font-black text-fuchsia-600 mb-4 tracking-[0.2em]">HASIL KULINAAI:</h4>
              <p className="text-lg italic font-medium text-slate-800 leading-relaxed text-center">"{suggestResult}"</p>
              <button 
                onClick={() => {
                   navigator.clipboard.writeText(suggestResult);
                   alert('Tersalin ke papan klip!');
                }}
                className="absolute top-6 right-6 text-fuchsia-600 hover:scale-110 transition-transform bg-white w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
              >
                📋
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIHub;