import React from 'react';
import { Outlet, UserAccount } from '../types';

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
  currentUser?: UserAccount | null;
  onSwitchRole?: (role: string) => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  roles: string[];
}

interface MenuSection {
  title: string;
  items: MenuItem[];
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
  isOnline,
  currentUser,
  onSwitchRole,
}) => {
  const role = currentUser?.role || 'OWNER';

  // Structured UI/UX Navigation Groups
  const menuSections: MenuSection[] = [
    {
      title: 'Utama',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: '📊', roles: ['OWNER', 'MANAGER', 'CASHIER'] },
      ]
    },
    {
      title: 'Operasional Kasir',
      items: [
        { id: 'pos', label: 'Kasir (POS)', icon: '🛒', roles: ['OWNER', 'MANAGER', 'CASHIER'] },
        { id: 'customers', label: 'Pelanggan & Loyalitas', icon: '👑', roles: ['OWNER', 'MANAGER', 'CASHIER'] },
        { id: 'kitchen', label: 'Layar Dapur (KDS)', icon: '🍳', roles: ['OWNER', 'MANAGER', 'KITCHEN'] },
        { id: 'tables', label: 'Denah Meja', icon: '🪑', roles: ['OWNER', 'MANAGER', 'CASHIER'] },
        { id: 'orders', label: 'Riwayat Penjualan', icon: '📝', roles: ['OWNER', 'MANAGER', 'CASHIER', 'KITCHEN'] },
      ]
    },
    {
      title: 'Katalog & Stok',
      items: [
        { id: 'menu', label: 'Katalog Produk', icon: '🍽️', roles: ['OWNER', 'MANAGER'] },
        { id: 'inventory', label: 'Stok & Bahan', icon: '📦', roles: ['OWNER', 'MANAGER'] },
        { id: 'suppliers', label: 'Supplier & PO', icon: '🚚', roles: ['OWNER', 'MANAGER'] },
        { id: 'promos', label: 'Promo & Diskon', icon: '🏷️', roles: ['OWNER', 'MANAGER'] },
      ]
    },
    {
      title: 'Tim & Akses',
      items: [
        { id: 'staff', label: 'Karyawan & Shift', icon: '👥', roles: ['OWNER', 'MANAGER'] },
        { id: 'users', label: 'Hak Akses Pengguna', icon: '🔐', roles: ['OWNER'] },
      ]
    },
    {
      title: 'Analitik & AI',
      items: [
        { id: 'ai-hub', label: 'KulinaAI Hub', icon: '✨', roles: ['OWNER', 'MANAGER'] },
        { id: 'subscription', label: 'Langganan & Paket', icon: '🚀', roles: ['OWNER'] },
        { id: 'docs', label: 'Panduan Operasional', icon: '📚', roles: ['OWNER', 'MANAGER'] },
      ]
    }
  ];

  const roleColors: Record<string, string> = {
    OWNER: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    MANAGER: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    CASHIER: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    KITCHEN: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  };

  return (
    <div className={`${isCollapsed ? 'w-20' : 'w-72'} bg-[#020617] h-screen fixed left-0 top-0 flex flex-col text-white shadow-2xl z-50 transition-all duration-300 border-r border-white/5 font-sans`}>
      {/* Header & Toggle */}
      <div className={`h-24 px-6 border-b border-white/5 flex items-center justify-between overflow-hidden ${isCollapsed ? 'justify-center px-0 flex-col py-4 gap-2' : ''}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-fuchsia-500 to-fuchsia-700 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-fuchsia-950">
            <span className="font-black text-lg text-white">K</span>
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tighter uppercase leading-none text-white">Kulina<span className="text-fuchsia-500">POS</span></span>
              <div className="flex items-center gap-1.5 mt-1">
                <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-fuchsia-500 shadow-[0_0_8px_fuchsia]' : 'bg-slate-600'}`}></span>
                <span className="text-[8px] font-black uppercase text-slate-500 tracking-[0.2em]">{isOnline ? 'Jaringan Aktif' : 'Mode Offline'}</span>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? "Buka Sidebar" : "Kecilkan Sidebar"}
          className="w-9 h-9 bg-white/5 hover:bg-fuchsia-600 hover:text-white text-slate-400 rounded-xl flex items-center justify-center transition-all border border-white/10 shrink-0"
        >
          {isCollapsed ? '⏩' : '⏪'}
        </button>
      </div>

      {/* Outlet Selector */}
      {!isCollapsed ? (
        <div className="px-5 py-3 border-b border-white/5 bg-slate-950/40">
          <label className="block text-[8px] font-black uppercase text-slate-500 tracking-widest mb-1">Outlet Aktif:</label>
          <select
            value={currentOutlet.id}
            onChange={e => onSwitchOutlet(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-fuchsia-500 cursor-pointer"
          >
            {outlets.map(o => (
              <option key={o.id} value={o.id} className="bg-slate-900 text-white">
                📍 {o.name}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div className="py-2 text-center border-b border-white/5" title={`Outlet Aktif: ${currentOutlet.name}`}>
          <span className="text-xs">📍</span>
        </div>
      )}

      {/* Role Simulator (Dev/Test) */}
      {!isCollapsed && onSwitchRole && (
        <div className="px-5 py-2.5 border-b border-white/5 bg-slate-950/60">
          <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Simulasi Peran:</p>
          <div className="grid grid-cols-4 gap-1">
            {['OWNER', 'MANAGER', 'CASHIER', 'KITCHEN'].map(r => (
              <button
                key={r}
                onClick={() => onSwitchRole(r)}
                className={`py-1 rounded-lg text-[8px] font-black uppercase tracking-wider border transition-all ${
                  role === r
                    ? 'bg-fuchsia-600 text-white border-fuchsia-400 shadow-sm'
                    : 'bg-white/5 text-slate-400 hover:text-white border-white/5'
                }`}
              >
                {r.slice(0, 4)}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Customer Self-Order Banner */}
      {!isCollapsed ? (
        <div className="p-4">
          <button 
            onClick={onOpenCustomerPortal}
            className="w-full bg-fuchsia-600/10 hover:bg-fuchsia-600/20 p-3.5 rounded-2xl flex items-center gap-3 transition-all border border-fuchsia-600/20 group cursor-pointer"
          >
            <span className="text-xl group-hover:scale-110 transition-transform">📱</span>
            <div className="text-left">
              <p className="text-[9px] font-black uppercase text-fuchsia-500 tracking-[0.2em]">QR Pelanggan</p>
              <p className="text-[8px] font-bold uppercase text-slate-400">Pesan Mandiri (Self-Order)</p>
            </div>
          </button>
        </div>
      ) : (
        <div className="py-3 text-center">
          <button
            onClick={onOpenCustomerPortal}
            title="QR Pelanggan - Pesan Mandiri"
            className="w-10 h-10 bg-fuchsia-600/10 hover:bg-fuchsia-600/30 text-fuchsia-400 rounded-xl mx-auto flex items-center justify-center border border-fuchsia-600/20 cursor-pointer"
          >
            📱
          </button>
        </div>
      )}

      {/* Main Categorized Group Navigation */}
      <nav className="flex-1 mt-1 px-3 space-y-6 overflow-y-auto scrollbar-hide pb-10">
        {menuSections.map((section, idx) => {
          const visibleItems = section.items.filter(item => item.roles.includes(role));
          if (visibleItems.length === 0) return null;

          return (
            <div key={idx} className="space-y-1">
              {!isCollapsed && (
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2 ml-3">
                  {section.title}
                </p>
              )}
              {visibleItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  title={item.label}
                  className={`w-full flex items-center rounded-2xl transition-all duration-200 cursor-pointer ${
                    isCollapsed ? 'justify-center h-11 text-center' : 'px-4 py-3 gap-3'
                  } ${
                    activeTab === item.id 
                      ? 'bg-fuchsia-600 text-white shadow-[0_10px_20px_-10px_rgba(192,38,211,0.5)] font-black' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5 font-bold'
                  }`}
                >
                  <span className={`text-lg shrink-0 ${activeTab === item.id ? 'scale-110' : 'opacity-70'}`}>{item.icon}</span>
                  {!isCollapsed && <span className="tracking-tight text-xs whitespace-nowrap">{item.label}</span>}
                </button>
              ))}
            </div>
          );
        })}
      </nav>

      {/* Active User Profile & Logout */}
      <div className="p-4 border-t border-white/5 flex flex-col shrink-0 gap-3 bg-[#01040a]">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
          <div
            className="w-10 h-10 rounded-2xl bg-fuchsia-600/20 text-fuchsia-400 flex items-center justify-center font-black text-sm shrink-0 border border-fuchsia-500/30"
            title={`${currentUser?.name || 'User'} (${role})`}
          >
            {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <div className="text-xs font-black text-white truncate tracking-tight">{currentUser?.name || 'Alexander Maq'}</div>
              <div className="mt-0.5">
                <span className={`inline-block px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border ${roleColors[role] || roleColors.CASHIER}`}>
                  {role}
                </span>
              </div>
            </div>
          )}
        </div>
        
        {!isCollapsed ? (
          <button onClick={onLogout} className="w-full py-2.5 bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all border border-white/5 cursor-pointer">
            Keluar (Logout)
          </button>
        ) : (
          <button onClick={onLogout} title="Keluar" className="w-10 h-10 bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-xl mx-auto flex items-center justify-center border border-white/5 cursor-pointer">
            🚪
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
