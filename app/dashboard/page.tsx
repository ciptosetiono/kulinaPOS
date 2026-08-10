
'use client';

import React, { useState, useEffect } from 'react';
import AppClient from '@/components/AppClient';
import { fetchMenuItems, fetchOrders } from '@/actions';
import { MOCK_TENANT, INITIAL_MENU } from '@/constants';
import { MenuItem, Order } from '@/types';

export default function DashboardPage() {
  const [menu, setMenu] = useState<MenuItem[]>(INITIAL_MENU);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    let isMounted = true;
    async function loadInitialData() {
      try {
        const fetchedMenu = await fetchMenuItems(MOCK_TENANT.id);
        const fetchedOrders = await fetchOrders('outlet-1');
        if (isMounted) {
          if (fetchedMenu) setMenu(fetchedMenu);
          if (fetchedOrders) setOrders(fetchedOrders);
        }
      } catch (err) {
        console.error('Failed to fetch initial dashboard data:', err);
      }
    }
    loadInitialData();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <AppClient 
      initialMenu={menu} 
      initialOrders={orders} 
    />
  );
}
