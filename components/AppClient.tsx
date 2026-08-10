
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import POS from './POS';
import SubscriptionManager from './SubscriptionManager';
import AIHub from './AIHub';
import TableManager from './TableManager';
import MenuManager from './MenuManager';
import InventoryManager from './InventoryManager';
import CustomerManager from './CustomerManager';
import StaffManager from './StaffManager';
import PromoManager from './PromoManager';
import SupplierManager from './SupplierManager';
import SalesManager from './SalesManager';
import Documentation from './Documentation';
import CustomerPortal from './CustomerPortal';
import { Order, MenuItem, InventoryItem, Table, Customer, Staff, Discount, Supplier, PurchaseOrder } from '../types';
import { MOCK_OUTLETS, INITIAL_INVENTORY, INITIAL_TABLES, INITIAL_CUSTOMERS, INITIAL_MENU } from '../constants';
import { config } from '../lib/config';

interface AppClientProps {
  initialMenu: MenuItem[];
  initialOrders: Order[];
}

export default function AppClient({ initialMenu, initialOrders }: AppClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenu);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [tables, setTables] = useState<Table[]>(INITIAL_TABLES);
  const [customers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [staff, setStaff] = useState<Staff[]>([
    { id: 's1', name: 'Andi Kasir', role: 'CASHIER' },
    { id: 's2', name: 'Budi Chef', role: 'CHEF' },
    { id: 's3', name: 'Siska Server', role: 'SERVER' }
  ]);
  const [promos, setPromos] = useState<Discount[]>([]);
  const [suppliers] = useState<Supplier[]>([
    { id: 'sup1', name: 'Prima Daging', category: 'Daging/Protein', contact: 'Bpk. Agus (0812...)', status: 'ACTIVE' },
    { id: 'sup2', name: 'Sayur Segar Jaya', category: 'Sayuran', contact: 'Ibu Ani (0813...)', status: 'ACTIVE' }
  ]);
  
  const [isOnline, setIsOnline] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [currentOutletId, setCurrentOutletId] = useState(MOCK_OUTLETS[0].id);
  const [showCustomerPortal, setShowCustomerPortal] = useState(false);

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

  const handleOrderSubmit = async (newOrder: Order) => {
    setOrders(prev => [newOrder, ...prev]);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder),
      });
      if (!res.ok) throw new Error('Sync failed');
    } catch (err) {
      console.warn('Offline: Data stored in local buffer');
    }
  };

  if (showCustomerPortal) {
    return (
      <CustomerPortal 
        menuItems={menuItems}
        categories={['Main Course', 'Beverage', 'Appetizer']}
        tables={tables}
        onOrderSubmit={handleOrderSubmit}
        restaurantName="Kulina Prime Jakarta"
        onBackToStaff={() => setShowCustomerPortal(false)}
      />
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f8fafc] selection:bg-fuchsia-100 selection:text-fuchsia-900">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        outlets={MOCK_OUTLETS}
        currentOutlet={MOCK_OUTLETS.find(o => o.id === currentOutletId)!}
        onSwitchOutlet={setCurrentOutletId}
        onLogout={() => router.push('/')}
        onOpenCustomerPortal={() => setShowCustomerPortal(true)}
        isOnline={isOnline}
      />
      
      <main className={`flex-1 p-10 transition-all duration-500 ${isSidebarCollapsed ? 'ml-24' : 'ml-72'}`}>
        <header className="mb-12 flex justify-between items-end relative">
           <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-fuchsia-50 text-fuchsia-600 rounded-full text-[8px] font-black uppercase tracking-[0.2em] border border-fuchsia-100">Enterprise Node</span>
                <span className="text-[10px] text-slate-300 font-bold tracking-widest">v{config.version}</span>
              </div>
              <h1 className="text-5xl font-black text-slate-950 tracking-tighter capitalize">{activeTab.replace('-', ' ')}</h1>
           </div>
           <div className="text-right hidden md:flex flex-col items-end gap-2">
              <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Node: <span className="text-fuchsia-600">{MOCK_OUTLETS.find(o => o.id === currentOutletId)?.name}</span></p>
              </div>
           </div>
        </header>

        <div className="relative z-10">
          {activeTab === 'dashboard' && <Dashboard orders={orders} />}
          {activeTab === 'pos' && (
            <POS 
              onOrderSubmit={handleOrderSubmit} 
              onExit={() => setActiveTab('dashboard')}
              menuItems={menuItems}
              categories={['Main Course', 'Beverage', 'Appetizer']} 
              promos={promos}
              tables={tables}
              outletId={currentOutletId}
              existingOrders={orders}
            />
          )}
          {activeTab === 'tables' && <TableManager tables={tables} setTables={setTables} outletId={currentOutletId} />}
          {activeTab === 'orders' && <SalesManager orders={orders} />}
          {activeTab === 'menu' && <MenuManager items={menuItems} setItems={setMenuItems} />}
          {activeTab === 'inventory' && <InventoryManager inventory={inventory} setInventory={setInventory} />}
          {activeTab === 'customers' && <CustomerManager customers={customers} feedbacks={[]} />}
          {activeTab === 'staff' && <StaffManager staff={staff} setStaff={setStaff} />}
          {activeTab === 'promos' && <PromoManager promos={promos} setPromos={setPromos} />}
          {activeTab === 'suppliers' && <SupplierManager suppliers={suppliers} purchaseOrders={[]} />}
          {activeTab === 'subscription' && <SubscriptionManager />}
          {activeTab === 'docs' && <Documentation />}
          {activeTab === 'ai-hub' && <AIHub />}
        </div>
      </main>
    </div>
  );
}
