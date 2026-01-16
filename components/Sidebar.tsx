
import React, { useState } from 'react';
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
  // Ordered by: Overview -> Sales -> Ops -> CRM -> Management -> Settings
  const menuItems = [
    { id: 'dashboard', label: 'Ringkasan', icon: '📊' },
    { id: 'pos', label: 'Kasir (POS)', icon: '🛒' },
    { id: 'tables', label: 'Denah Meja', icon: '🪑' },
    { id: 'orders', label: 'Riwayat Sales', icon: '📝' },
    { id: 'menu', label: 'Katalog Menu', icon: '🍽️' },
    { id: 'inventory', label: 'Stok Bahan', icon: '📦' },
    { id: 'customers', label: 'Pelanggan', icon: '👑' },
    { id: 'staff', label: 'Karyawan', icon: '👥' },
    { id: 'promos', label: 'Promo/Diskon', icon: '🏷️' },
    { id: 'suppliers', label: 'Suplier', icon: '🚚' },
    { id: 'subscription', label: 'Langganan', icon: '💎' },
    { id: 'docs', label: 'Dokumentasi', icon: '📚' },
    { id: 'ai-hub', label: 'Wawasan', icon: '✨' },
  ];

  return (
    <div className={`${isCollapsed ? 'w-24' : 'w-64'} bg-slate-900 h-screen fixed left-0 top-0 flex flex-col text-white shadow-2xl z-50 transition-all duration-300`}>
      <div className={`p-6 border-b border-slate-800 flex items-center gap-2 overflow-hidden ${isCollapsed ? 'justify-center' : ''}`}>
        <span className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white font-black text-sm shrink-0 shadow-lg shadow-red-900/50">K</span>
        {!isCollapsed && (
          <div className="flex flex-col">
            <span className="text-xl font-black text-white tracking-tighter uppercase">Kulina<span className="text-red-600">POS</span></span>
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-red-500 animate-pulse' : 'bg-slate-500'}`}></span>
              <span className="text-[8px] font-black uppercase text-slate-500 tracking-widest">{isOnline ? 'Online' : 'Offline'}</span>
            </div>
          </div>
        )}
      </div>
      
      {!isCollapsed && (
        <div className="px-4 py-6 border-b border-slate-800">
          <button 
            onClick={onOpenCustomerPortal}
            className="w-full bg-red-600/10 hover:bg-red-600/20 p-4 rounded-2xl flex flex-col items-center justify-center transition-all border border-red-600/20 group"
          >
            <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">📱</span>
            <p className="text-[10px] font-black uppercase text-red-600 tracking-widest">Akses Menu QR</p>
          </button>
        </div>
      )}

      <nav className="flex-1 mt-6 px-4 space-y-1 overflow-y-auto scrollbar-hide pb-10">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center rounded-xl transition-all ${isCollapsed ? 'justify-center p-4' : 'px-4 py-3 gap-3'} ${
              activeTab === item.id 
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span className="text-xl shrink-0">{item.icon}</span>
            {!isCollapsed && <span className="font-bold tracking-tight text-sm whitespace-nowrap">{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className={`p-6 border-t border-slate-800 flex flex-col shrink-0 gap-4`}>
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
          <div className="w-10 h-10 rounded-full bg-slate-700 overflow-hidden shrink-0 ring-2 ring-slate-800">
            <img src="https://picsum.photos/seed/admin/100/100" alt="Admin" />
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <div className="text-sm font-semibold text-white truncate">Alexander Kulina</div>
              <div className="text-[10px] text-slate-500 font-bold uppercase">Owner</div>
            </div>
          )}
        </div>
        {!isCollapsed && (
          <div className="space-y-2">
             <div className="text-[8px] text-slate-600 font-black uppercase text-center">v{config.version}</div>
             <button onClick={onLogout} className="w-full py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors">Keluar</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
