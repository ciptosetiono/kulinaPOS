import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Order, OrderStatus } from '../types';

interface DashboardProps {
  orders: Order[];
}

const Dashboard: React.FC<DashboardProps> = ({ orders }) => {
  const stats = [
    { label: 'Maq Revenue', value: 'Rp 18.240k', change: '+12.5%', icon: '💰', color: 'red' },
    { label: 'Active Burn', value: orders.filter(o => o.status !== OrderStatus.COMPLETED).length, change: '-2%', icon: '🔥', color: 'red' },
    { label: 'Avg Ticket', value: 'Rp 145k', change: '+5.2%', icon: '🎟️', color: 'red' },
    { label: 'Velocity', value: orders.length + 42, change: '+18%', icon: '🚀', color: 'red' },
  ];

  // Dummy data for visual
  const chartData = [
    { date: 'Mon', revenue: 4500 },
    { date: 'Tue', revenue: 5200 },
    { date: 'Wed', revenue: 4800 },
    { date: 'Thu', revenue: 6100 },
    { date: 'Fri', revenue: 5900 },
    { date: 'Sat', revenue: 8200 },
    { date: 'Sun', revenue: 7500 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-red-50 flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{stat.value}</h3>
              <p className={`text-xs mt-2 font-black ${stat.change.startsWith('+') ? 'text-red-600' : 'text-slate-400'}`}>
                {stat.change} <span className="font-normal text-slate-400 ml-1">v. prev</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-2xl shadow-sm">
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-red-50">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Maq Revenue Velocity</h3>
            <select className="bg-slate-50 border-none rounded-xl text-xs font-black text-slate-400 px-4 py-2 uppercase tracking-widest">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#dc2626" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#dc2626" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#fef2f2" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(220 38 38 / 0.1)', padding: '15px'}} 
                  itemStyle={{color: '#dc2626', fontWeight: '900'}}
                />
                <Area type="monotone" dataKey="revenue" stroke="#dc2626" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-red-50">
          <h3 className="text-lg font-black text-slate-900 mb-6 uppercase tracking-tight">Latest Logs</h3>
          <div className="space-y-6">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${
                  order.tableNumber === 'Takeaway' ? 'bg-red-50 text-red-600' : 'bg-slate-900 text-white'
                }`}>
                  {order.tableNumber === 'Takeaway' ? '🥡' : `T${order.tableNumber}`}
                </div>
                <div className="flex-1">
                  <div className="text-xs font-black text-slate-800 uppercase tracking-tight">Order #{order.id.slice(0, 5)}</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">{new Date(order.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-black text-red-600">Rp {order.grandTotal.toLocaleString()}</div>
                  <div className={`text-[8px] uppercase font-black px-2 py-0.5 rounded-full inline-block ${
                    order.status === OrderStatus.COMPLETED ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {order.status}
                  </div>
                </div>
              </div>
            ))}
            {orders.length === 0 && (
              <div className="text-center py-12 flex flex-col items-center">
                 <span className="text-4xl grayscale opacity-20 mb-4">💤</span>
                 <p className="text-slate-300 font-black uppercase tracking-widest text-[10px]">Stationary Mode</p>
              </div>
            )}
          </div>
          <button className="w-full mt-8 py-4 text-red-600 font-black text-[10px] uppercase tracking-widest border-2 border-red-50 rounded-2xl hover:bg-red-50 transition-colors">
            Full Audit Trail
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;