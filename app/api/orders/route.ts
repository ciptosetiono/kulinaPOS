
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { Order } from '@/types';

export async function POST(request: Request) {
  try {
    const order: Order = await request.json();
    const db = await getDb();
    
    const result = await db.collection('orders').insertOne({
      ...order,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error('API Order Error:', error);
    return NextResponse.json({ success: false, error: 'Gagal menyimpan pesanan' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const db = await getDb();
    const orders = await db.collection('orders')
      .find({})
      .sort({ timestamp: -1 })
      .limit(50)
      .toArray();

    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data' }, { status: 500 });
  }
}
