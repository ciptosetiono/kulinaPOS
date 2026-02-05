
import { INITIAL_MENU, MOCK_OUTLETS, INITIAL_CUSTOMERS, INITIAL_TABLES } from '../constants';
import { config } from './config';

// Prefix keys with storage namespace from config
const prefix = config.storagePrefix;

const KEYS = {
  MENU: `${prefix}menu`,
  ORDERS: `${prefix}orders`,
  OUTLETS: `${prefix}outlets`,
  TABLES: `${prefix}tables`,
  CUSTOMERS: `${prefix}customers`,
  INVENTORY: `${prefix}inventory`
};

class LocalPersistentDB {
  private isBrowser = typeof window !== 'undefined';

  private getStorage<T>(key: string, defaultValue: T): T {
    if (!this.isBrowser) return defaultValue;
    
    try {
      const data = localStorage.getItem(key);
      if (!data) {
        this.setStorage(key, defaultValue);
        return defaultValue;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error(`Failed to parse storage for key: ${key}`, e);
      return defaultValue;
    }
  }

  private setStorage(key: string, data: any) {
    if (this.isBrowser) {
      try {
        localStorage.setItem(key, JSON.stringify(data));
      } catch (e) {
        console.error(`Failed to set storage for key: ${key}`, e);
      }
    }
  }

  menuItem = {
    findMany: async () => this.getStorage(KEYS.MENU, INITIAL_MENU),
    create: async (data: any) => {
      const items = this.getStorage(KEYS.MENU, INITIAL_MENU);
      const newItem = { ...data, id: 'db-' + Date.now() };
      this.setStorage(KEYS.MENU, [...items, newItem]);
      return newItem;
    },
    update: async (id: string, data: any) => {
      const items = this.getStorage(KEYS.MENU, INITIAL_MENU);
      const updated = items.map((i: any) => i.id === id ? { ...i, ...data } : i);
      this.setStorage(KEYS.MENU, updated);
      return data;
    },
    delete: async (id: string) => {
      const items = this.getStorage(KEYS.MENU, INITIAL_MENU);
      this.setStorage(KEYS.MENU, items.filter((i: any) => i.id !== id));
    }
  };

  order = {
    findMany: async (args?: any) => {
      const allOrders = this.getStorage(KEYS.ORDERS, []);
      if (args?.where?.outletId) {
        return allOrders.filter((o: any) => o.outletId === args.where.outletId || o.outletId === 'customer-portal');
      }
      return allOrders;
    },
    create: async (args: any) => {
      const orders = this.getStorage(KEYS.ORDERS, []);
      const newOrder = { ...args.data, id: args.data.id || 'ord-' + Date.now() };
      this.setStorage(KEYS.ORDERS, [newOrder, ...orders]);
      return newOrder;
    },
    update: async (id: string, data: any) => {
      const orders = this.getStorage(KEYS.ORDERS, []);
      const updated = orders.map((o: any) => o.id === id ? { ...o, ...data } : o);
      this.setStorage(KEYS.ORDERS, updated);
      return data;
    }
  };

  outlet = {
    findMany: async () => this.getStorage(KEYS.OUTLETS, MOCK_OUTLETS),
  };

  table = {
    findMany: async (args: any) => {
      const tables = this.getStorage(KEYS.TABLES, INITIAL_TABLES);
      return tables.filter((t: any) => t.outletId === args.where.outletId);
    },
    updateAll: async (newTables: any[]) => {
      this.setStorage(KEYS.TABLES, newTables);
    }
  };

  customer = {
    findMany: async () => this.getStorage(KEYS.CUSTOMERS, INITIAL_CUSTOMERS),
  };
}

export const db = new LocalPersistentDB();
