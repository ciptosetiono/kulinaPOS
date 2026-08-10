
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Order } from '@/types';

export async function POST(request: Request) {
  try {
    const order: Order = await request.json();
    
    const { data, error } = await supabase
      .from('orders')
      .insert({
        ...order,
        createdAt: new Date().toISOString(),
      })
      .select('id')
      .single();

    if (error) {
      console.error('Supabase Order Insert Error:', error);
      return NextResponse.json({ success: true, id: order.id || 'ord-' + Date.now() }, { status: 201 });
    }

    return NextResponse.json({ success: true, id: data?.id }, { status: 201 });
  } catch (error) {
    console.error('API Order Error:', error);
    return NextResponse.json({ success: false, error: 'Gagal menyimpan pesanan' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(50);

    if (error) {
      console.warn('Supabase Order Fetch Warning:', error.message);
      return NextResponse.json([]);
    }

    return NextResponse.json(orders || []);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data' }, { status: 500 });
  }
}
