'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import POS from './POS';
import KitchenView from './KitchenView';
import SubscriptionManager from './SubscriptionManager';
import AIHub from './AIHub';
import TableManager from './TableManager';
import MenuManager from './MenuManager';
import InventoryManager from './InventoryManager';
import CustomerManager from './CustomerManager';
import StaffManager from './StaffManager';
import UserManager from './UserManager';
import PromoManager from './PromoManager';
import SupplierManager from './SupplierManager';
import SalesManager from './SalesManager';
import Documentation from './Documentation';
import CustomerPortal from './CustomerPortal';
import { Order, MenuItem, InventoryItem, Table, Customer, Staff, Discount, Supplier, Tenant, Outlet, UserAccount, PurchaseOrder } from '../types';
import { createOrder } from '../actions';
import { config } from '../lib/config';

interface AppClientProps {
  tenant: Tenant | null;
  outlets: Outlet[];
  initialMenu: MenuItem[];
  initialOrders: Order[];
  initialTables: Table[];
  initialCustomers: Customer[];
  initialInventory: InventoryItem[];
  initialStaff: Staff[];
  initialSuppliers: Supplier[];
  initialPurchaseOrders?: PurchaseOrder[];
  initialPromos: Discount[];
  initialUsers?: UserAccount[];
}

const TAB_TITLES: Record<string, string> = {
  dashboard: 'Dashboard',
  pos: 'Terminal Kasir (POS)',
  kitchen: 'Layar Dapur (KDS)',
  tables: 'Manajemen Meja',
  orders: 'Riwayat Penjualan',
  menu: 'Katalog Menu',
  inventory: 'Stok & Bahan Baku',
  customers: 'Database Pelanggan',
  users: 'Manajemen Akun & Hak Akses',
  staff: 'Absensi Karyawan',
  promos: 'Diskon & Promosi',
  suppliers: 'Supplier & PO',
  subscription: 'Paket Langganan',
  docs: 'Panduan & Dokumentasi',
  'ai-hub': 'KulinaAI Hub',
};

const INDONESIAN_CATEGORIES = ['Makanan Utama', 'Minuman', 'Camilan', 'Dessert', 'Tambahan'];

export default function AppClient({
  tenant,
  outlets,
  initialMenu,
  initialOrders,
  initialTables,
  initialCustomers,
  initialInventory,
  initialStaff,
  initialSuppliers,
  initialPurchaseOrders = [],
  initialPromos,
  initialUsers = [],
}: AppClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenu);
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [tables, setTables] = useState<Table[]>(initialTables);
  const [customers] = useState<Customer[]>(initialCustomers);
  const [staff, setStaff] = useState<Staff[]>(initialStaff);
  const [users, setUsers] = useState<UserAccount[]>(initialUsers);
  const [promos, setPromos] = useState<Discount[]>(initialPromos);
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(initialPurchaseOrders);
  
  // Active User / Session state
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(
    initialUsers[0] || {
      id: 'u-default',
      tenantId: tenant?.id || 'tenant-1',
      name: 'Alexander Maq (Pemilik)',
      email: 'ceo@maqpos.com',
      role: 'OWNER',
      isActive: true,
    }
  );

  const [isOnline, setIsOnline] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [currentOutletId, setCurrentOutletId] = useState<string>(outlets[0]?.id || 'outlet-1');
  const [showCustomerPortal, setShowCustomerPortal] = useState(false);
  const [defaultTableNumber, setDefaultTableNumber] = useState('');

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleStatus);
    window.addEventListener('offline', handleStatus);
    return () => {
      window.removeEventListener('online', handleStatus);
      window.removeEventListener('offline', handleStatus);
    };
  }, []);

  // Buka halaman pesanan pelanggan langsung dari link QR (?mode=customer&table=01)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'customer') {
      const t = params.get('table');
      if (t) setDefaultTableNumber(String(t).padStart(2, '0'));
      setShowCustomerPortal(true);
    }
  }, []);

  // Quick Role Simulator Switcher
  const handleSwitchRole = (newRole: string) => {
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        role: newRole,
      });
    }
    // Set active tab to valid default for role if restricted
    if (newRole === 'KITCHEN') {
      setActiveTab('kitchen');
    } else if (newRole === 'CASHIER' && (activeTab === 'users' || activeTab === 'menu' || activeTab === 'inventory')) {
      setActiveTab('pos');
    }
  };

  const currentOutlet = outlets.find(o => o.id === currentOutletId) || outlets[0] || {
    id: 'outlet-1',
    tenantId: tenant?.id || 'tenant-1',
    name: 'Outlet Utama',
    address: 'Jl. Utama No. 1',
    phone: '08123456789'
  };

  const handleOrderSubmit = async (newOrder: Order) => {
    setOrders(prev => [newOrder, ...prev]);
    try {
      await createOrder(newOrder);
    } catch (err) {
      console.warn('Order saved locally, sync error:', err);
    }
  };

  if (showCustomerPortal) {
    return (
      <CustomerPortal 
        menuItems={menuItems}
        categories={INDONESIAN_CATEGORIES}
        tables={tables}
        outlets={outlets}
        onOrderSubmit={handleOrderSubmit}
        restaurantName={currentOutlet.name}
        onBackToStaff={() => setShowCustomerPortal(false)}
      />
    );
  }

  // Halaman Kasir berjalan layar penuh tanpa sidebar, cukup tombol keluar kembali ke dashboard
  if (activeTab === 'pos') {
    return (
      <POS 
        onOrderSubmit={handleOrderSubmit} 
        onExit={() => setActiveTab('dashboard')}
        menuItems={menuItems}
        categories={INDONESIAN_CATEGORIES} 
        promos={promos}
        tables={tables}
        outletId={currentOutletId}
        existingOrders={orders}
        outletName={currentOutlet.name}
        outletAddress={currentOutlet.address}
        outletPhone={currentOutlet.phone}
        cashierName={currentUser?.name}
      />
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f8fafc] selection:bg-fuchsia-100 selection:text-fuchsia-900 font-sans">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        outlets={outlets}
        currentOutlet={currentOutlet}
        onSwitchOutlet={setCurrentOutletId}
        onLogout={() => router.push('/')}
        onOpenCustomerPortal={() => setShowCustomerPortal(true)}
        isOnline={isOnline}
        currentUser={currentUser}
        onSwitchRole={handleSwitchRole}
      />
      
      <main className={`flex-1 p-10 transition-all duration-300 ${isSidebarCollapsed ? 'ml-20' : 'ml-72'}`}>
        <header className="mb-12 flex justify-between items-end relative">
           <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-fuchsia-50 text-fuchsia-600 rounded-full text-[8px] font-black uppercase tracking-[0.2em] border border-fuchsia-100">Sistem Kasir Enterprise</span>
                <span className="px-2.5 py-0.5 bg-slate-900 text-white rounded-full text-[8px] font-black uppercase tracking-widest">Akses: {currentUser?.role || 'OWNER'}</span>
                <span className="text-[10px] text-slate-300 font-bold tracking-widest">v{config.version}</span>
              </div>
              <h1 className="text-5xl font-black text-slate-950 tracking-tighter capitalize">
                {TAB_TITLES[activeTab] || activeTab.replace('-', ' ')}
              </h1>
           </div>
           <div className="text-right hidden md:flex flex-col items-end gap-2">
              <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Outlet Aktif: <span className="text-fuchsia-600">{currentOutlet.name}</span></p>
              </div>
           </div>
        </header>

        <div className="relative z-10">
          {activeTab === 'dashboard' && <Dashboard orders={orders} />}
          {activeTab === 'kitchen' && <KitchenView orders={orders} setOrders={setOrders} />}
          {activeTab === 'tables' && <TableManager tables={tables} setTables={setTables} outletId={currentOutletId} />}
          {activeTab === 'orders' && <SalesManager orders={orders} />}
          {activeTab === 'menu' && <MenuManager items={menuItems} setItems={setMenuItems} />}
          {activeTab === 'inventory' && <InventoryManager inventory={inventory} setInventory={setInventory} outletId={currentOutletId} />}
          {activeTab === 'customers' && <CustomerManager customers={customers} feedbacks={[]} />}
          {activeTab === 'users' && <UserManager users={users} setUsers={setUsers} outlets={outlets} />}
          {activeTab === 'staff' && <StaffManager staff={staff} setStaff={setStaff} />}
          {activeTab === 'promos' && <PromoManager promos={promos} setPromos={setPromos} />}
          {activeTab === 'suppliers' && <SupplierManager suppliers={suppliers} purchaseOrders={purchaseOrders} setSuppliers={setSuppliers} setPurchaseOrders={setPurchaseOrders} />}
          {activeTab === 'subscription' && <SubscriptionManager tenant={tenant} />}
          {activeTab === 'docs' && <Documentation />}
          {activeTab === 'ai-hub' && <AIHub inventory={inventory} />}
        </div>
      </main>
    </div>
  );
}
