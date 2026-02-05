
import React from 'react';
import { Outlet } from '../types';
import { config } from '../lib/config';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  outlets: Outlet[];
  currentOutlet: Outlet;
  onSwitchOutlet: (id: string) => void;
  onLogout: () => void;
  onOpenCustomerPortal: () => void;
  isOnline: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  isCollapsed, 
  setIsCollapsed, 
  outlets, 
  currentOutlet, 
  onSwitchOutlet,
  onLogout,
  onOpenCustomerPortal,
  isOnline
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Business Insights', icon: '📊' },
    { id: 'pos', label: 'Sales Terminal', icon: '🛒' },
    { id: 'orders', label: 'Sales Journal', icon: '📝' },
    { id: 'tables', label: 'Floor Blueprint', icon: '🪑' },
    { id: 'menu', label: 'Product Catalog', icon: '🍽️' },
    { id: 'inventory', label: 'Stock & Supplies', icon: '📦' },
    { id: 'customers', label: 'CRM & Loyalty', icon: '👑' },
    { id: 'ai-hub', label: 'AI Wawasan', icon: '✨' },
    { id: 'docs', label: 'Operations Vault', icon: '📚' },
  ];

  return (
    <div className={`${isCollapsed ? 'w-24' : 'w-72'} bg-[#020617] h-screen fixed left-0 top-0 flex flex-col text-white shadow-2xl z-50 transition-all duration-500 border-r border-white/5`}>
      {/* Brand Header */}
      <div className={`h-24 px-8 border-b border-white/5 flex items-center gap-4 overflow-hidden ${isCollapsed ? 'justify-center px-0' : ''}`}>
        <div className="w-10 h-10 bg-gradient-to-br from-fuchsia-500 to-fuchsia-700 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-fuchsia-950">
          <span className="font-black text-lg">K</span>
        </div>
        {!isCollapsed && (
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tighter uppercase leading-none">Kulina<span className="text-fuchsia-500">POS</span></span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-fuchsia-500 shadow-[0_0_8px_fuchsia]' : 'bg-slate-600'}`}></span>
              <span className="text-[8px] font-black uppercase text-slate-500 tracking-[0.2em]">{isOnline ? 'Network Active' : 'Offline Mode'}</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Customer Portal Quick Access */}
      {!isCollapsed && (
        <div className="p-6">
          <button 
            onClick={onOpenCustomerPortal}
            className="w-full bg-fuchsia-600/10 hover:bg-fuchsia-600/20 p-5 rounded-3xl flex items-center gap-4 transition-all border border-fuchsia-600/20 group"
          >
            <span className="text-2xl group-hover:scale-110 transition-transform">📱</span>
            <div className="text-left">
              <p className="text-[10px] font-black uppercase text-fuchsia-500 tracking-[0.2em]">Customer QR</p>
              <p className="text-[8px] font-bold uppercase text-slate-500 mt-0.5">Scan & Order</p>
            </div>
          </button>
        </div>
      )}

      {/* Main Navigation */}
      <nav className="flex-1 mt-4 px-4 space-y-1 overflow-y-auto scrollbar-hide pb-10">
        <p className={`text-[9px] font-black text-slate-600 uppercase tracking-[0.4em] mb-4 ml-4 ${isCollapsed ? 'hidden' : ''}`}>Management Hub</p>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center rounded-2xl transition-all duration-300 ${isCollapsed ? 'justify-center h-14' : 'px-6 py-4 gap-4'} ${
              activeTab === item.id 
                ? 'bg-fuchsia-600 text-white shadow-[0_10px_20px_-10px_rgba(192,38,211,0.5)]' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span className={`text-xl shrink-0 ${activeTab === item.id ? 'scale-110' : 'opacity-60'}`}>{item.icon}</span>
            {!isCollapsed && <span className="font-bold tracking-tight text-sm whitespace-nowrap">{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Profile Footer */}
      <div className={`p-6 border-t border-white/5 flex flex-col shrink-0 gap-6 bg-[#01040a]`}>
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-4'}`}>
          <div className="w-12 h-12 rounded-2xl bg-slate-800 overflow-hidden shrink-0 border border-white/10 shadow-xl">
            <img src="https://picsum.photos/seed/admin/100/100" alt="Admin" className="w-full h-full object-cover" />
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <div className="text-sm font-bold text-white truncate tracking-tight">Alexander Kulina</div>
              <div className="text-[9px] text-fuchsia-500 font-black uppercase tracking-[0.2em]">Global Admin</div>
            </div>
          )}
        </div>
        
        {!isCollapsed && (
          <button onClick={onLogout} className="w-full py-4 bg-white/5 hover:bg-red-500/10 text-slate-500 hover:text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-white/5 border-dashed">
            Sign Out
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
