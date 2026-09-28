"use server";

import { prisma } from './lib/prisma';
import { cookies } from 'next/headers';

// Helper to get current user's tenantId from session cookie or default to first tenant
async function getTenantId(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('zenpos_session');
    if (sessionCookie) {
      const session = JSON.parse(sessionCookie.value);
      if (session.tenantId) return session.tenantId;
    }
  } catch {}
  
  const defaultTenant = await prisma.tenant.findFirst();
  return defaultTenant?.id || null;
}

// ---- Tenant ----
export async function fetchTenant() {
  const tenantId = await getTenantId();
  if (!tenantId) return null;
  const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
  if (!tenant) return null;
  return {
    ...tenant,
    trialStartDate: tenant.trialStartDate?.toISOString().split('T')[0],
    trialEndDate: tenant.trialEndDate?.toISOString().split('T')[0],
  };
}

// ---- Outlets ----
export async function fetchOutlets() {
  const tenantId = await getTenantId();
  if (!tenantId) return [];
  const outlets = await prisma.outlet.findMany({ where: { tenantId } });
  return outlets.map(o => ({
    id: o.id,
    tenantId: o.tenantId,
    name: o.name,
    address: o.address,
    phone: o.phone,
    latitude: o.latitude ?? undefined,
    longitude: o.longitude ?? undefined,
  }));
}

// ---- Menu Items ----
export async function fetchMenuItems() {
  const tenantId = await getTenantId();
  if (!tenantId) return [];
  const items = await prisma.menuItem.findMany({ where: { tenantId }, orderBy: { createdAt: 'desc' } });
  return items.map(item => ({
    id: item.id,
    tenantId: item.tenantId,
    name: item.name,
    description: item.description,
    price: item.price,
    category: item.category,
    imageUrl: item.imageUrl,
    inStock: item.inStock,
    calories: item.calories ?? undefined,
    isFavorite: item.isFavorite,
    optionGroups: item.optionGroups ? item.optionGroups as any : undefined,
  }));
}

export async function createMenuItem(data: {
  name: string; description: string; price: number; category: string; imageUrl: string; tenantId?: string; optionGroups?: any[];
}) {
  const tenantId = data.tenantId || (await getTenantId());
  if (!tenantId) throw new Error('Tenant ID required');
  return await prisma.menuItem.create({
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      category: data.category,
      imageUrl: data.imageUrl,
      optionGroups: data.optionGroups && data.optionGroups.length > 0 ? data.optionGroups : undefined,
      tenantId,
    }
  });
}

export async function updateMenuItem(id: string, data: Record<string, any>) {
  return await prisma.menuItem.update({ where: { id }, data });
}

export async function deleteMenuItem(id: string) {
  return await prisma.menuItem.delete({ where: { id } });
}

// ---- Orders ----
export async function fetchOrders(outletId?: string) {
  const tenantId = await getTenantId();
  let where: any = {};
  if (outletId) {
    where.outletId = outletId;
  } else if (tenantId) {
    where.outlet = { tenantId };
  }

  const orders = await prisma.order.findMany({
    where,
    orderBy: { timestamp: 'desc' },
    take: 100,
  });

  return orders.map(o => {
    let parsedItems = [];
    try {
      parsedItems = typeof o.items === 'string' ? JSON.parse(o.items) : (o.items || []);
    } catch {
      parsedItems = [];
    }
    return {
      id: o.id,
      outletId: o.outletId,
      tableNumber: o.tableId || 'Takeaway',
      items: parsedItems,
      status: o.status,
      timestamp: new Date(o.timestamp).getTime(),
      total: o.totalAmount,
      tax: Math.round(o.totalAmount * 0.1),
      discountTotal: 0,
      grandTotal: Math.round(o.totalAmount * 1.1),
      paymentMethod: o.paymentMethod,
      customerName: o.customerName || undefined,
    };
  });
}

export async function createOrder(data: Record<string, any>) {
  const itemsJson = typeof data.items === 'object' ? data.items : [];
  const totalAmount = data.grandTotal || data.total || 0;
  
  return await prisma.order.create({
    data: {
      id: data.id || undefined,
      outletId: data.outletId,
      items: itemsJson,
      totalAmount,
      status: data.status || 'PENDING',
      paymentMethod: data.paymentMethod || 'CASH',
      tableId: data.tableNumber && data.tableNumber !== 'Takeaway' ? String(data.tableNumber) : null,
      customerName: data.customerName || null,
      notes: data.notes || null,
    }
  });
}

export async function updateOrder(id: string, data: Record<string, any>) {
  return await prisma.order.update({ where: { id }, data });
}

// ---- Tables ----
export async function fetchTables(outletId?: string) {
  let where: any = {};
  if (outletId) {
    where.outletId = outletId;
  } else {
    const tenantId = await getTenantId();
    if (!tenantId) return [];
    where.outlet = { tenantId };
  }

  const tables = await prisma.table.findMany({ where, orderBy: { number: 'asc' } });
  return tables.map(t => ({
    id: t.id,
    outletId: t.outletId,
    number: String(t.number).padStart(2, '0'),
    capacity: t.capacity,
    status: t.status as any,
  }));
}

export async function createTable(data: { outletId: string; number: number | string; capacity: number; status?: string }) {
  const num = typeof data.number === 'string' ? parseInt(data.number, 10) || 1 : data.number;
  return await prisma.table.create({
    data: {
      outletId: data.outletId,
      number: num,
      capacity: data.capacity,
      status: data.status || 'AVAILABLE',
    }
  });
}

export async function updateTable(id: string, data: Record<string, any>) {
  const updateData = { ...data };
  if (updateData.number && typeof updateData.number === 'string') {
    updateData.number = parseInt(updateData.number, 10) || 1;
  }
  return await prisma.table.update({ where: { id }, data: updateData });
}

export async function deleteTable(id: string) {
  return await prisma.table.delete({ where: { id } });
}

// ---- Customers ----
export async function fetchCustomers() {
  const tenantId = await getTenantId();
  if (!tenantId) return [];
  const customers = await prisma.customer.findMany({ where: { tenantId }, orderBy: { createdAt: 'desc' } });
  return customers.map(c => ({
    id: c.id,
    tenantId: c.tenantId,
    name: c.name,
    phone: c.phone,
    email: c.email || '',
    points: c.points,
    tier: c.tier as any,
    totalSpent: c.totalSpent,
  }));
}

// ---- Inventory ----
export async function fetchInventory(outletId?: string) {
  let where: any = {};
  if (outletId) {
    where.outletId = outletId;
  } else {
    const tenantId = await getTenantId();
    if (!tenantId) return [];
    const outlets = await prisma.outlet.findMany({
      where: { tenantId },
      select: { id: true }
    });
    where.outletId = { in: outlets.map(o => o.id) };
  }

  const items = await prisma.inventoryItem.findMany({ where, orderBy: { name: 'asc' } });
  return items.map(i => ({
    id: i.id,
    outletId: i.outletId,
    name: i.name,
    stock: i.stock,
    unit: i.unit,
    minThreshold: i.minThreshold,
  }));
}

export async function createInventoryItem(data: { outletId: string; name: string; stock: number; unit: string; minThreshold: number }) {
  return await prisma.inventoryItem.create({ data });
}

export async function updateInventoryItem(id: string, data: Record<string, any>) {
  return await prisma.inventoryItem.update({ where: { id }, data });
}

export async function deleteInventoryItem(id: string) {
  return await prisma.inventoryItem.delete({ where: { id } });
}

// ---- Staff ----
export async function fetchStaff() {
  const tenantId = await getTenantId();
  if (!tenantId) return [];
  const staffMembers = await prisma.staff.findMany({ where: { tenantId }, orderBy: { name: 'asc' } });
  return staffMembers.map(s => ({
    id: s.id,
    name: s.name,
    role: s.role,
  }));
}

export async function createStaff(data: { tenantId?: string; name: string; role: string }) {
  const tenantId = data.tenantId || (await getTenantId());
  if (!tenantId) throw new Error('Tenant ID required');
  return await prisma.staff.create({
    data: {
      tenantId,
      name: data.name,
      role: data.role,
    }
  });
}

export async function updateStaff(id: string, data: Record<string, any>) {
  return await prisma.staff.update({ where: { id }, data });
}

export async function deleteStaff(id: string) {
  return await prisma.staff.delete({ where: { id } });
}

// ---- Suppliers ----
export async function fetchSuppliers() {
  const tenantId = await getTenantId();
  if (!tenantId) return [];
  const suppliers = await prisma.supplier.findMany({ where: { tenantId }, orderBy: { name: 'asc' } });
  return suppliers.map(s => ({
    id: s.id,
    name: s.name,
    category: s.category,
    contact: s.contact,
    status: s.status as any,
  }));
}

export async function createSupplier(data: { tenantId?: string; name: string; category: string; contact: string; status?: string }) {
  const tenantId = data.tenantId || (await getTenantId());
  if (!tenantId) throw new Error('Tenant ID required');
  return await prisma.supplier.create({
    data: {
      tenantId,
      name: data.name,
      category: data.category,
      contact: data.contact,
      status: data.status || 'ACTIVE',
    }
  });
}

export async function updateSupplier(id: string, data: Record<string, any>) {
  return await prisma.supplier.update({ where: { id }, data });
}

export async function deleteSupplier(id: string) {
  return await prisma.supplier.delete({ where: { id } });
}

// ---- Purchase Orders (PO) ----
export async function fetchPurchaseOrders() {
  const tenantId = await getTenantId();
  if (!tenantId) return [];
  const pos = await prisma.purchaseOrder.findMany({ where: { tenantId }, orderBy: { createdAt: 'desc' } });
  return pos.map(p => ({
    id: p.id,
    supplierId: p.supplierId,
    items: p.items,
    totalAmount: p.totalAmount,
    status: p.status as any,
    date: p.date,
  }));
}

export async function createPurchaseOrder(data: { supplierId: string; items: string; totalAmount: number; status?: string; date?: string }) {
  const tenantId = await getTenantId();
  if (!tenantId) throw new Error('Tenant ID required');
  return await prisma.purchaseOrder.create({
    data: {
      tenantId,
      supplierId: data.supplierId,
      items: data.items,
      totalAmount: data.totalAmount,
      status: data.status || 'PENDING',
      date: data.date || new Date().toISOString().split('T')[0],
    }
  });
}

export async function updatePurchaseOrder(id: string, data: Record<string, any>) {
  return await prisma.purchaseOrder.update({ where: { id }, data });
}

export async function deletePurchaseOrder(id: string) {
  return await prisma.purchaseOrder.delete({ where: { id } });
}

// ---- Promos ----
export async function fetchPromos(outletId?: string) {
  let where: any = {};
  if (outletId) {
    where.outletId = outletId;
  }
  const promos = await prisma.promo.findMany({ where, orderBy: { createdAt: 'desc' } });
  return promos.map(p => ({
    id: p.id,
    outletId: p.outletId,
    name: p.name,
    type: p.type as any,
    value: p.value,
    isActive: p.isActive,
  }));
}

export async function createPromo(data: { outletId: string; name: string; type: string; value: number; isActive?: boolean }) {
  return await prisma.promo.create({ data });
}

export async function updatePromo(id: string, data: Record<string, any>) {
  return await prisma.promo.update({ where: { id }, data });
}

export async function deletePromo(id: string) {
  return await prisma.promo.delete({ where: { id } });
}

// ---- Users (RBAC) ----
export async function fetchUsers() {
  const tenantId = await getTenantId();
  if (!tenantId) return [];
  const users = await prisma.user.findMany({
    where: { tenantId },
    orderBy: { createdAt: 'desc' },
  });
  return users.map(u => ({
    id: u.id,
    tenantId: u.tenantId,
    email: u.email,
    name: u.name || u.email.split('@')[0],
    role: u.role,
    outletId: u.outletId || undefined,
    isActive: u.isActive,
    createdAt: u.createdAt.toISOString(),
  }));
}

export async function createUser(data: {
  name: string;
  email: string;
  password?: string;
  role: string;
  outletId?: string;
}) {
  const tenantId = await getTenantId();
  if (!tenantId) throw new Error('Tenant ID required');

  const bcrypt = (await import('bcryptjs')).default;
  const hashedPassword = await bcrypt.hash(data.password || 'password123', 10);

  return await prisma.user.create({
    data: {
      tenantId,
      email: data.email,
      password: hashedPassword,
      name: data.name,
      role: data.role || 'CASHIER',
      outletId: data.outletId || null,
      isActive: true,
    }
  });
}

export async function updateUser(id: string, data: {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
  outletId?: string;
  isActive?: boolean;
}) {
  const updateData: any = { ...data };
  if (data.password) {
    const bcrypt = (await import('bcryptjs')).default;
    updateData.password = await bcrypt.hash(data.password, 10);
  }
  return await prisma.user.update({
    where: { id },
    data: updateData,
  });
}

export async function deleteUser(id: string) {
  return await prisma.user.delete({ where: { id } });
}

export async function toggleUserActive(id: string, currentStatus: boolean) {
  return await prisma.user.update({
    where: { id },
    data: { isActive: !currentStatus },
  });
}

