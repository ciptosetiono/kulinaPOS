
import { db } from './lib/db';
import { Order, MenuItem, Table } from './types';

export const fetchMenuItems = async (tenantId: string) => {
  return await db.menuItem.findMany();
};

export const fetchOrders = async (outletId: string) => {
  return await db.order.findMany({
    where: { outletId }
  });
};

export const createOrder = async (orderData: Partial<Order>) => {
  return await db.order.create({
    data: orderData
  });
};

export const updateOrder = async (orderId: string, data: Partial<Order>) => {
  return await db.order.update(orderId, data);
};

export const fetchTables = async (outletId: string) => {
  return await db.table.findMany({
    where: { outletId }
  });
};

export const syncTables = async (tables: Table[]) => {
  return await db.table.updateAll(tables);
};

export const fetchCustomers = async (tenantId: string) => {
  return await db.customer.findMany();
};
