import React, { useState } from 'react';
import { Staff, Shift } from '../types';

interface StaffManagerProps {
  staff: Staff[];
  setStaff: React.Dispatch<React.SetStateAction<Staff[]>>;
}

const StaffManager: React.FC<StaffManagerProps> = ({ staff, setStaff }) => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [activeTab, setActiveTab] = useState<'roster' | 'shifts'>('roster');

  const clockIn = (staffId: string) => {
    const newShift: Shift = {
      id: 'sh' + Date.now(),
      staffId,
      startTime: Date.now(),
      date: new Date().toISOString().split('T')[0]
    };
    setShifts([newShift, ...shifts]);
  };

  const clockOut = (staffId: string) => {
    setShifts(prev => prev.map(s => 
      s.staffId === staffId && !s.endTime ? { ...s, endTime: Date.now() } : s
    ));
  };

  const isClockedIn = (staffId: string) => {
    return shifts.some(s => s.staffId === staffId && !s.endTime);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex gap-4 mb-4">
        <button onClick={() => setActiveTab('roster')} className={`px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest ${activeTab === 'roster' ? 'bg-slate-900 text-white' : 'bg-white text-slate-400'}`}>Daftar Karyawan</button>
        <button onClick={() => setActiveTab('shifts')} className={`px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest ${activeTab === 'shifts' ? 'bg-slate-900 text-white' : 'bg-white text-slate-400'}`}>Shift Harian</button>
      </div>

      {activeTab === 'roster' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {staff.map(member => (
            <div key={member.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col items-center">
              <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center text-3xl mb-4 relative overflow-hidden">
                <img src={`https://picsum.photos/seed/${member.name}/200/200`} className="absolute inset-0 object-cover" alt={member.name} />
              </div>
              <h3 className="text-xl font-black text-slate-800">{member.name}</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">{member.role}</p>
              
              <div className="w-full flex gap-3">
                {isClockedIn(member.id) ? (
                  <button onClick={() => clockOut(member.id)} className="flex-1 py-4 bg-red-100 text-red-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-200">Absen Keluar</button>
                ) : (
                  <button onClick={() => clockIn(member.id)} className="flex-1 py-4 bg-emerald-100 text-emerald-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-200">Absen Masuk</button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
           <table className="w-full text-left">
             <thead className="bg-slate-50 border-b">
               <tr>
                 <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Karyawan</th>
                 <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tanggal</th>
                 <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Jam Masuk</th>
                 <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Jam Keluar</th>
                 <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Durasi</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-50">
               {shifts.map(shift => {
                 const employee = staff.find(s => s.id === shift.staffId);
                 const duration = shift.endTime ? ((shift.endTime - shift.startTime) / (1000 * 60 * 60)).toFixed(1) : 'Berlangsung';
                 return (
                   <tr key={shift.id}>
                     <td className="px-8 py-6 font-bold text-slate-800">{employee?.name}</td>
                     <td className="px-8 py-6 text-slate-400 font-medium">{shift.date}</td>
                     <td className="px-8 py-6 font-mono text-emerald-500">{new Date(shift.startTime).toLocaleTimeString('id-ID')}</td>
                     <td className="px-8 py-6 font-mono text-red-400">{shift.endTime ? new Date(shift.endTime).toLocaleTimeString('id-ID') : '--:--'}</td>
                     <td className="px-8 py-6 font-black text-slate-900">{duration === 'Berlangsung' ? 'Berlangsung' : `${duration} jam`}</td>
                   </tr>
                 );
               })}
             </tbody>
           </table>
        </div>
      )}
    </div>
  );
};

export default StaffManager;
