
export enum OrderStatus {
  PENDING = 'PENDING',
  PREPARING = 'PREPARING',
  SERVED = 'SERVED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum TableStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
  RESERVED = 'RESERVED'
}

export enum PaymentMethod {
  CASH = 'CASH',
  CARD = 'CARD',
  E_WALLET = 'E_WALLET'
}

export enum Category {
  MAIN_COURSE = 'Makanan Utama',
  BEVERAGE = 'Minuman',
  APPETIZER = 'Camilan',
  DESSERT = 'Dessert',
  SIDES = 'Tambahan'
}

export enum UserRole {
  OWNER = 'OWNER',
  MANAGER = 'MANAGER',
  CASHIER = 'CASHIER',
  KITCHEN = 'KITCHEN'
}

export interface UserAccount {
  id: string;
  tenantId: string;
  email: string;
  name: string;
  role: UserRole | string;
  outletId?: string;
  isActive: boolean;
  createdAt?: string;
}

export interface Tenant {
  id: string;
  name: string;
  subscriptionPlan: 'STARTER' | 'PREMIUM' | 'ENTERPRISE';
  logoUrl?: string;
  isTrial: boolean;
  trialStartDate?: string;
  trialEndDate?: string;
}

export interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'PAID' | 'PENDING' | 'OVERDUE';
  plan: string;
}

export interface Outlet {
  id: string;
  tenantId: string;
  name: string;
  address: string;
  phone: string;
  latitude?: number;
  longitude?: number;
}

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: UserRole | string;
  tenantId: string;
  allowedOutlets: string[]; 
}

export interface Discount {
  id: string;
  outletId: string;
  name: string;
  type: 'PERCENTAGE' | 'FIXED';
  value: number;
  isActive: boolean;
}

export interface ProductOption {
  name: string;
  price: number;
}

export interface ProductOptionGroup {
  groupName: string;
  type: 'SINGLE' | 'MULTIPLE';
  options: ProductOption[];
}

export interface SelectedOption {
  groupName: string;
  optionName: string;
  price: number;
}

export interface MenuItem {
  id: string;
  tenantId: string; 
  name: string;
  description: string;
  price: number;
  category: string | Category;
  imageUrl: string;
  inStock: boolean;
  calories?: number;
  isFavorite?: boolean;
  optionGroups?: ProductOptionGroup[];
}

export interface OrderItem {
  menuItemId: string;
  quantity: number;
  notes?: string;
  priceAtOrder: number;
  selectedOptions?: SelectedOption[];
}

export interface Order {
  id: string;
  outletId: string;
  tableNumber: string | 'Takeaway';
  items: OrderItem[];
  status: OrderStatus;
  timestamp: number;
  total: number;
  tax: number;
  discountTotal: number;
  grandTotal: number;
  paymentMethod?: PaymentMethod;
  amountPaid?: number;
  changeDue?: number;
  customerName?: string;
  appliedPromoId?: string;
}

export interface InventoryItem {
  id: string;
  outletId: string;
  name: string;
  stock: number;
  unit: string;
  minThreshold: number;
}

export interface Table {
  id: string;
  outletId: string;
  number: string;
  capacity: number;
  status: TableStatus;
}

export interface Customer {
  id: string;
  tenantId: string;
  name: string;
  phone: string;
  email: string;
  points: number;
  tier: 'PLATINUM' | 'GOLD' | 'SILVER';
  totalSpent: number;
}

export interface Feedback {
  id: string;
  customerId: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Staff {
  id: string;
  name: string;
  role: string;
}

export interface Shift {
  id: string;
  staffId: string;
  startTime: number;
  endTime?: number;
  date: string;
}

export interface Supplier {
  id: string;
  name: string;
  category: string;
  contact: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  items: string;
  totalAmount: number;
  status: 'RECEIVED' | 'PENDING' | 'CANCELLED';
  date: string;
}
