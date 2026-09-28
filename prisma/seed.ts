import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Create or upsert Tenant
  const tenant = await prisma.tenant.upsert({
    where: { id: 'tenant-1' },
    update: {},
    create: {
      id: 'tenant-1',
      name: 'Maq Hospitality Global',
      subscriptionPlan: 'PREMIUM',
      logoUrl: 'https://picsum.photos/seed/maqlogo/200/200',
      isTrial: true,
      trialStartDate: new Date('2025-01-01'),
      trialEndDate: new Date('2025-04-01'),
    },
  });

  // 2. Create Users for all 4 Roles
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const seedUsers = [
    {
      id: 'user-1',
      tenantId: tenant.id,
      email: 'ceo@maqpos.com',
      password: hashedPassword,
      name: 'Alexander Maq (Owner)',
      role: 'OWNER',
    },
    {
      id: 'user-2',
      tenantId: tenant.id,
      email: 'manager@maqpos.com',
      password: hashedPassword,
      name: 'Budi Manager',
      role: 'MANAGER',
    },
    {
      id: 'user-3',
      tenantId: tenant.id,
      email: 'cashier@maqpos.com',
      password: hashedPassword,
      name: 'Citra Kasir',
      role: 'CASHIER',
    },
    {
      id: 'user-4',
      tenantId: tenant.id,
      email: 'kitchen@maqpos.com',
      password: hashedPassword,
      name: 'Deni Dapur',
      role: 'KITCHEN',
    },
  ];

  for (const u of seedUsers) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: { role: u.role },
      create: u,
    });
  }

  // 3. Create Outlets
  const outlet1 = await prisma.outlet.upsert({
    where: { id: 'outlet-1' },
    update: {},
    create: {
      id: 'outlet-1',
      tenantId: tenant.id,
      name: 'Maq Prime Jakarta',
      address: 'SCBD District 8, Red Tower',
      phone: '+62 21-555-0101',
      latitude: -6.2241,
      longitude: 106.8095,
    },
  });

  const outlet2 = await prisma.outlet.upsert({
    where: { id: 'outlet-2' },
    update: {},
    create: {
      id: 'outlet-2',
      tenantId: tenant.id,
      name: 'Maq Boutique Bali',
      address: 'Seminyak Square, Red Wing',
      phone: '+62 361-555-0102',
      latitude: -8.6826,
      longitude: 115.1631,
    },
  });

  // 4. Menu Items
  const menuItems = [
    {
      id: 'm1',
      tenantId: tenant.id,
      name: 'Maq Signature Wagyu',
      description: 'Grade A5 Wagyu with signature red pepper reduction.',
      price: 450000,
      category: 'Main Course',
      imageUrl: 'https://picsum.photos/seed/steak/400/400',
      inStock: true,
      isFavorite: true,
    },
    {
      id: 'm2',
      tenantId: tenant.id,
      name: 'Crimson Truffle Pasta',
      description: 'Handmade fettuccine with beet-infused cream.',
      price: 185000,
      category: 'Main Course',
      imageUrl: 'https://picsum.photos/seed/pasta/400/400',
      inStock: true,
      isFavorite: false,
    },
    {
      id: 'b1',
      tenantId: tenant.id,
      name: 'Velvet Red Cold Brew',
      description: 'Hibiscus-steeped 12hr coffee.',
      price: 45000,
      category: 'Beverage',
      imageUrl: 'https://picsum.photos/seed/coffee/400/400',
      inStock: true,
      isFavorite: true,
    },
  ];

  for (const item of menuItems) {
    await prisma.menuItem.upsert({
      where: { id: item.id },
      update: {},
      create: item,
    });
  }

  // 5. Inventory Items
  const inventoryItems = [
    {
      id: 'i1',
      outletId: outlet1.id,
      name: 'Wagyu A5',
      stock: 25.5,
      unit: 'kg',
      minThreshold: 5,
    },
    {
      id: 'i2',
      outletId: outlet1.id,
      name: 'Truffle Oil',
      stock: 12,
      unit: 'liters',
      minThreshold: 3,
    },
  ];

  for (const item of inventoryItems) {
    await prisma.inventoryItem.upsert({
      where: { id: item.id },
      update: {},
      create: item,
    });
  }

  // 6. Tables
  const tables = [
    { id: 't1', outletId: outlet1.id, number: 1, capacity: 2, status: 'AVAILABLE' },
    { id: 't2', outletId: outlet1.id, number: 2, capacity: 4, status: 'OCCUPIED' },
    { id: 't3', outletId: outlet1.id, number: 3, capacity: 4, status: 'AVAILABLE' },
  ];

  for (const tbl of tables) {
    await prisma.table.upsert({
      where: { id: tbl.id },
      update: {},
      create: tbl,
    });
  }

  // 7. Customers
  await prisma.customer.upsert({
    where: { id: 'c1' },
    update: {},
    create: {
      id: 'c1',
      tenantId: tenant.id,
      name: 'John Doe',
      phone: '08123456789',
      email: 'john@maqpos.com',
      points: 1250,
      tier: 'PLATINUM',
      totalSpent: 15000000,
    },
  });

  // 8. Staff
  const staffMembers = [
    { id: 's1', tenantId: tenant.id, name: 'Andi Kasir', role: 'CASHIER' },
    { id: 's2', tenantId: tenant.id, name: 'Budi Chef', role: 'CHEF' },
    { id: 's3', tenantId: tenant.id, name: 'Siska Server', role: 'SERVER' },
  ];

  for (const s of staffMembers) {
    await prisma.staff.upsert({
      where: { id: s.id },
      update: {},
      create: s,
    });
  }

  // 9. Suppliers
  const suppliers = [
    { id: 'sup1', tenantId: tenant.id, name: 'Prima Daging', category: 'Daging/Protein', contact: 'Bpk. Agus (0812...)', status: 'ACTIVE' },
    { id: 'sup2', tenantId: tenant.id, name: 'Sayur Segar Jaya', category: 'Sayuran', contact: 'Ibu Ani (0813...)', status: 'ACTIVE' },
  ];

  for (const sup of suppliers) {
    await prisma.supplier.upsert({
      where: { id: sup.id },
      update: {},
      create: sup,
    });
  }

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
