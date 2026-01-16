
import React from 'react';
import AppClient from '@/components/AppClient';
import { fetchMenuItems, fetchOrders } from '@/actions';
import { MOCK_TENANT } from '@/constants';

export default async function DashboardPage() {
  // Next.js Server Side Data Fetching
  // In real scenario, outletId would come from user session
  const initialData = {
    menu: await fetchMenuItems(MOCK_TENANT.id),
    orders: await fetchOrders('outlet-1'),
  };

  return (
    <AppClient 
      initialMenu={initialData.menu} 
      initialOrders={initialData.orders} 
    />
  );
}
