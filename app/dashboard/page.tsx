'use client';

import React, { useState, useEffect } from 'react';
import AppClient from '@/components/AppClient';
import { 
  fetchTenant, 
  fetchOutlets, 
  fetchMenuItems, 
  fetchOrders, 
  fetchTables, 
  fetchCustomers, 
  fetchInventory, 
  fetchStaff, 
  fetchSuppliers, 
  fetchPurchaseOrders,
  fetchPromos,
  fetchUsers,
} from '@/actions';
import { MenuItem, Order, Tenant, Outlet, Table, Customer, InventoryItem, Staff, Supplier, PurchaseOrder, Discount, UserAccount } from '@/types';

export default function DashboardPage() {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [promos, setPromos] = useState<Discount[]>([]);
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadAllData() {
      try {
        const [
          fetchedTenant,
          fetchedOutlets,
          fetchedMenu,
          fetchedOrders,
          fetchedTables,
          fetchedCustomers,
          fetchedInventory,
          fetchedStaff,
          fetchedSuppliers,
          fetchedPOs,
          fetchedPromos,
          fetchedUsers,
        ] = await Promise.all([
          fetchTenant(),
          fetchOutlets(),
          fetchMenuItems(),
          fetchOrders(),
          fetchTables(),
          fetchCustomers(),
          fetchInventory(),
          fetchStaff(),
          fetchSuppliers(),
          fetchPurchaseOrders(),
          fetchPromos(),
          fetchUsers(),
        ]);

        if (isMounted) {
          if (fetchedTenant) setTenant(fetchedTenant as any);
          if (fetchedOutlets) setOutlets(fetchedOutlets);
          if (fetchedMenu) setMenu(fetchedMenu as any);
          if (fetchedOrders) setOrders(fetchedOrders as any);
          if (fetchedTables) setTables(fetchedTables as any);
          if (fetchedCustomers) setCustomers(fetchedCustomers as any);
          if (fetchedInventory) setInventory(fetchedInventory as any);
          if (fetchedStaff) setStaff(fetchedStaff as any);
          if (fetchedSuppliers) setSuppliers(fetchedSuppliers as any);
          if (fetchedPOs) setPurchaseOrders(fetchedPOs as any);
          if (fetchedPromos) setPromos(fetchedPromos as any);
          if (fetchedUsers) setUsers(fetchedUsers as any);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data from database:', err);
        if (isMounted) setIsLoading(false);
      }
    }
    loadAllData();
    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6 font-sans">
        <div className="w-16 h-16 border-4 border-fuchsia-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-bold text-slate-600 tracking-wider uppercase animate-pulse">Memuat Data KulinaPOS...</p>
      </div>
    );
  }

  return (
    <AppClient 
      tenant={tenant}
      outlets={outlets}
      initialMenu={menu} 
      initialOrders={orders} 
      initialTables={tables}
      initialCustomers={customers}
      initialInventory={inventory}
      initialStaff={staff}
      initialSuppliers={suppliers}
      initialPurchaseOrders={purchaseOrders}
      initialPromos={promos}
      initialUsers={users}
    />
  );
}
