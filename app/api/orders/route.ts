
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Order } from '@/types';

export async function POST(request: Request) {
  try {
    const orderData = await request.json();
    
    // Fallback outletId if not provided (for local dev without full tenant setup)
    const outletId = orderData.outletId || 'default-outlet-id';

    // We check if outlet exists if we are strictly relying on relations,
    // But for a quick migration, assuming outletId is provided.
    // If we need to create a dummy outlet for it to work:
    let outlet = await prisma.outlet.findUnique({ where: { id: outletId } });
    if (!outlet && outletId === 'default-outlet-id') {
       const tenant = await prisma.tenant.findFirst();
       if (tenant) {
         outlet = await prisma.outlet.create({
           data: { id: outletId, name: 'Default Outlet', address: '', phone: '', tenantId: tenant.id }
         });
       }
    }

    const savedOrder = await prisma.order.create({
      data: {
        id: orderData.id,
        items: orderData.items,
        totalAmount: orderData.totalAmount,
        status: orderData.status,
        paymentMethod: orderData.paymentMethod,
        tableId: orderData.tableId,
        customerName: orderData.customerName,
        notes: orderData.notes,
        outletId: outletId, // Need a valid outletId
      }
    });

    return NextResponse.json({ success: true, id: savedOrder.id }, { status: 201 });
  } catch (error) {
    console.error('API Order Error:', error);
    return NextResponse.json({ success: false, error: 'Gagal menyimpan pesanan' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { timestamp: 'desc' },
      take: 50
    });

    return NextResponse.json(orders || []);
  } catch (error) {
    console.error('Fetch Orders Error:', error);
    return NextResponse.json({ error: 'Gagal mengambil data' }, { status: 500 });
  }
}
