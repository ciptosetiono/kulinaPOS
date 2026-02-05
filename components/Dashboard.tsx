
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Order, OrderStatus } from '../types';

interface DashboardProps {
  orders: Order[];
}

const Dashboard: React.FC<DashboardProps> = ({ orders }) => {
  const stats = [
    { label: 'Revenue Momentum', value: 'Rp 18.2M', change: '+12.5%', icon: '💎' },
    { label: 'Active Kitchen Burn', value: orders.filter(o => o.status !== OrderStatus.COMPLETED).length, change: '-2%', icon: '🔥' },
    { label: 'Service Efficiency', value: '94.2%', change: '+5.2%', icon: '⚙️' },
    { label: 'Daily Ticket Volume', value: orders.length + 42, change: '+18%', icon: '📈' },
  ];

  const chartData = [
    { date: '01', revenue: 4500 },
    { date: '02', revenue: 5200 },
    { date: '03', revenue: 4800 },
    { date: '04', revenue: 7100 },
    { date: '05', revenue: 5900 },
    { date: '06', revenue: 8200 },
    { date: '07', revenue: 7500 },
  ];

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-700">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <div key={i} className="group bg-white p-8 rounded-[2.5rem] border border-slate-200/60 shadow-sm hover:shadow-2xl hover:shadow-fuchsia-500/5 hover:-translate-y-1 transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-500/[0.03] rounded-full translate-x-12 -translate-y-12" />
            <div className="flex flex-col gap-6">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-3xl shadow-inner group-hover:bg-fuchsia-50 transition-colors">
                {stat.icon}
              </div>
              <div>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2">{stat.label}</p>
                <h3 className="text-3xl font-black text-slate-950 tracking-tighter">{stat.value}</h3>
                <p className={`text-xs mt-3 font-black flex items-center gap-1 ${stat.change.startsWith('+') ? 'text-emerald-500' : 'text-slate-400'}`}>
                  {stat.change.startsWith('+') ? '▲' : '▼'} {stat.change} 
                  <span className="font-bold text-slate-300 ml-1 uppercase tracking-widest text-[9px]">vs Last Cycle</span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Analytics Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-[#020617] p-10 rounded-[3.5rem] shadow-2xl border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
            <div className="text-9xl font-black tracking-tighter text-white uppercase">Active</div>
          </div>
          
          <div className="flex items-center justify-between mb-12 relative z-10">
            <div>
              <h3 className="text-2xl font-black text-white tracking-tight uppercase tracking-[0.1em]">Growth Telemetry</h3>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Real-time business performance</p>
            </div>
            <div className="flex gap-2">
               <button className="px-5 py-2 bg-white/5 hover:bg-white/10 text-white rounded-full text-[9px] font-black uppercase tracking-widest transition-all">Last 7 Days</button>
               <button className="px-5 py-2 text-slate-500 rounded-full text-[9px] font-black uppercase tracking-widest hover:text-white transition-all">Last 30 Days</button>
            </div>
          </div>

          <div className="h-80 w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d946ef" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#d946ef" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#475569', fontSize: 10, fontWeight: '900', letterSpacing: '0.1em'}} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#475569', fontSize: 10, fontWeight: '900'}} 
                />
                <Tooltip 
                  contentStyle={{backgroundColor: '#0f172a', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)', padding: '20px'}} 
                  itemStyle={{color: '#d946ef', fontWeight: '900', fontSize: '14px'}}
                  labelStyle={{color: '#94a3b8', marginBottom: '8px', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em'}}
                />
                <Area type="monotone" dataKey="revenue" stroke="#d946ef" strokeWidth={5} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Side Logs */}
        <div className="lg:col-span-4 bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-200/60 flex flex-col">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Live Sales Feed</h3>
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
          </div>

          <div className="flex-1 space-y-8">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center gap-5 group cursor-pointer">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xs transition-all ${
                  order.tableNumber === 'Takeaway' ? 'bg-fuchsia-50 text-fuchsia-600 group-hover:bg-fuchsia-600 group-hover:text-white' : 'bg-slate-950 text-white group-hover:bg-fuchsia-600'
                }`}>
                  {order.tableNumber === 'Takeaway' ? '🥡' : `T${order.tableNumber}`}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-black text-slate-900 uppercase tracking-tight truncate">Journal #{order.id.slice(0, 8)}</div>
                  <div className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-0.5">{new Date(order.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} • HUB_SYNC</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-black text-slate-900 tracking-tight">Rp {order.grandTotal.toLocaleString()}</div>
                  <div className={`text-[8px] font-black uppercase mt-1 tracking-widest ${
                    order.status === OrderStatus.COMPLETED ? 'text-emerald-500' : 'text-fuchsia-500'
                  }`}>
                    {order.status}
                  </div>
                </div>
              </div>
            ))}
            {orders.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center opacity-20 py-20 grayscale">
                 <span className="text-6xl mb-6">📡</span>
                 <p className="text-[10px] font-black uppercase tracking-[0.4em]">Listening for Sales</p>
              </div>
            )}
          </div>

          <button className="w-full mt-10 py-5 text-slate-400 hover:text-fuchsia-600 font-black text-[10px] uppercase tracking-[0.3em] border-2 border-slate-50 hover:border-fuchsia-100 rounded-2xl transition-all">
            Full Audit Logs
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
