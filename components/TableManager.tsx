
import React, { useState } from 'react';
import { Table, TableStatus } from '../types';

interface TableManagerProps {
  tables: Table[];
  setTables: React.Dispatch<React.SetStateAction<Table[]>>;
  outletId: string;
}

const TableManager: React.FC<TableManagerProps> = ({ tables, setTables, outletId }) => {
  const [newTable, setNewTable] = useState({ number: '', capacity: 2 });
  const [isAdding, setIsAdding] = useState(false);
  const [qrModalTable, setQrModalTable] = useState<Table | null>(null);

  const addTable = () => {
    if (!newTable.number) return;
    const table: Table = {
      id: 't' + Date.now(),
      outletId: outletId,
      number: newTable.number,
      capacity: newTable.capacity,
      status: TableStatus.AVAILABLE
    };
    setTables([...tables, table]);
    setNewTable({ number: '', capacity: 2 });
    setIsAdding(false);
  };

  const updateStatus = (id: string, status: TableStatus) => {
    setTables(prev => prev.map(t => t.id === id ? { ...t, status } : t));
  };

  const removeTable = (id: string) => {
    setTables(prev => prev.filter(t => t.id !== id));
  };

  const getStatusColor = (status: TableStatus) => {
    switch (status) {
      case TableStatus.AVAILABLE: return 'bg-emerald-500';
      case TableStatus.OCCUPIED: return 'bg-[#3f51b5]';
      case TableStatus.RESERVED: return 'bg-amber-500';
      default: return 'bg-slate-400';
    }
  };

  const generateTableQR = (tableNum: string) => {
    // Di dunia nyata, ini adalah URL absolut kafe Anda
    const baseUrl = window.location.origin + window.location.pathname;
    const customerLink = `${baseUrl}?mode=customer&table=${tableNum}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(customerLink)}`;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Manajemen Meja</h2>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Cetak QR untuk akses pesanan pelanggan</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)} 
          className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-emerald-600 transition-all flex items-center gap-2"
        >
          Tambah Meja <span className="text-lg">+</span>
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {tables.map(table => (
          <div key={table.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden group hover:shadow-xl transition-all flex flex-col">
            <div className={`h-24 flex flex-col items-center justify-center text-white relative ${getStatusColor(table.status)}`}>
               <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Meja</span>
               <span className="text-3xl font-black">{table.number}</span>
               <div className="absolute top-3 right-3 flex gap-2">
                  <button onClick={() => setQrModalTable(table)} className="w-8 h-8 bg-white/20 hover:bg-white/40 rounded-lg flex items-center justify-center text-sm">📱</button>
                  <button onClick={() => removeTable(table.id)} className="w-8 h-8 bg-white/20 hover:bg-red-500 rounded-lg flex items-center justify-center text-sm">&times;</button>
               </div>
            </div>
            <div className="p-6 space-y-4 flex-1 flex flex-col">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kapasitas</span>
                <span className="text-sm font-bold text-slate-800">{table.capacity} Orang</span>
              </div>
              
              <div className="grid grid-cols-3 gap-1 bg-slate-50 p-1 rounded-xl">
                {Object.values(TableStatus).map(s => (
                  <button key={s} onClick={() => updateStatus(table.id, s)} className={`h-8 rounded-lg flex items-center justify-center transition-all ${table.status === s ? 'bg-white shadow-sm ring-1 ring-slate-200' : 'opacity-20 hover:opacity-100'}`}>
                    <span className={`w-3 h-3 rounded-full ${getStatusColor(s)}`}></span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* QR Code Modal for Table */}
      {qrModalTable && (
        <div className="fixed inset-0 z-[150] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl p-10 flex flex-col items-center text-center animate-in zoom-in duration-300">
            <h3 className="text-2xl font-black text-slate-900 mb-2 uppercase">QR Meja {qrModalTable.number}</h3>
            <p className="text-slate-400 text-xs font-bold mb-8 uppercase tracking-widest">Tempel QR ini di Meja fisik</p>
            
            <div className="bg-white p-6 rounded-[2rem] border-4 border-slate-50 shadow-inner mb-8">
              <img src={generateTableQR(qrModalTable.number)} className="w-64 h-64" alt="Table QR" />
            </div>

            <div className="w-full space-y-3">
              <button 
                onClick={() => window.print()} 
                className="w-full py-5 bg-[#3f51b5] text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-100"
              >
                Cetak Kode QR
              </button>
              <button onClick={() => setQrModalTable(null)} className="w-full py-4 text-slate-400 font-bold uppercase text-[10px]">Tutup</button>
            </div>
          </div>
        </div>
      )}

      {isAdding && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl p-10 space-y-8">
            <h3 className="text-2xl font-black text-slate-900 uppercase text-center">Meja Baru</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Nomor Meja</label>
                <input autoFocus placeholder="Cth: 01" className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none font-bold" value={newTable.number} onChange={e => setNewTable({...newTable, number: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Kapasitas Orang</label>
                <input type="number" className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none font-bold" value={newTable.capacity} onChange={e => setNewTable({...newTable, capacity: Number(e.target.value)})} />
              </div>
            </div>
            <div className="flex gap-4">
               <button onClick={() => setIsAdding(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-bold">Batal</button>
               <button onClick={addTable} className="flex-1 py-4 bg-[#3f51b5] text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-indigo-100">Simpan Meja</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableManager;
