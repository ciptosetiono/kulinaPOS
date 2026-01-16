
import { MenuItem, InventoryItem, Discount, Table, TableStatus, Customer, Tenant, Outlet, UserRole, UserSession, Invoice } from './types';

export const MOCK_TENANT: Tenant = {
  id: 'tenant-1',
  name: 'Maq Hospitality Global',
  subscriptionPlan: 'PREMIUM',
  logoUrl: 'https://picsum.photos/seed/maqlogo/200/200',
  isTrial: true,
  trialStartDate: '2025-01-01',
  trialEndDate: '2025-04-01' // Exactly 3 months trial
};

export const MOCK_INVOICES: Invoice[] = [
  { id: 'INV-TRIAL-90D', date: '2025-01-01', amount: 0, status: 'PAID', plan: 'Premium Trial (90 Days)' },
];

export const MOCK_OUTLETS: Outlet[] = [
  { id: 'outlet-1', tenantId: 'tenant-1', name: 'Maq Prime Jakarta', address: 'SCBD District 8, Red Tower', phone: '+62 21-555-0101', latitude: -6.2241, longitude: 106.8095 },
  { id: 'outlet-2', tenantId: 'tenant-1', name: 'Maq Boutique Bali', address: 'Seminyak Square, Red Wing', phone: '+62 361-555-0102', latitude: -8.6826, longitude: 115.1631 },
];

export const MOCK_USER: UserSession = {
  id: 'user-1',
  name: 'Alexander Maq',
  email: 'ceo@maqpos.com',
  role: UserRole.OWNER,
  tenantId: 'tenant-1',
  allowedOutlets: ['outlet-1', 'outlet-2']
};

export const INITIAL_MENU: MenuItem[] = [
  { id: 'm1', tenantId: 'tenant-1', name: 'Maq Signature Wagyu', description: 'Grade A5 Wagyu with signature red pepper reduction.', price: 450000, category: 'Main Course', imageUrl: 'https://picsum.photos/seed/steak/400/400', inStock: true, isFavorite: true },
  { id: 'm2', tenantId: 'tenant-1', name: 'Crimson Truffle Pasta', description: 'Handmade fettuccine with beet-infused cream.', price: 185000, category: 'Main Course', imageUrl: 'https://picsum.photos/seed/pasta/400/400', inStock: true },
  { id: 'b1', tenantId: 'tenant-1', name: 'Velvet Red Cold Brew', description: 'Hibiscus-steeped 12hr coffee.', price: 45000, category: 'Beverage', imageUrl: 'https://picsum.photos/seed/coffee/400/400', inStock: true, isFavorite: true },
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  { id: 'i1', outletId: 'outlet-1', name: 'Wagyu A5', stock: 25.5, unit: 'kg', minThreshold: 5 },
  { id: 'i2', outletId: 'outlet-1', name: 'Truffle Oil', stock: 12, unit: 'liters', minThreshold: 3 },
];

export const INITIAL_TABLES: Table[] = [
  { id: 't1', outletId: 'outlet-1', number: '01', capacity: 2, status: TableStatus.AVAILABLE },
  { id: 't2', outletId: 'outlet-1', number: '02', capacity: 4, status: TableStatus.OCCUPIED },
  { id: 't3', outletId: 'outlet-1', number: '03', capacity: 4, status: TableStatus.AVAILABLE },
];

export const INITIAL_CUSTOMERS: Customer[] = [
  { id: 'c1', tenantId: 'tenant-1', name: 'John Doe', phone: '08123456789', email: 'john@maqpos.com', points: 1250, tier: 'PLATINUM', totalSpent: 15000000 },
];
