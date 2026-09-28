import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { email, password, companyName } = await request.json();

    if (!email || !password || !companyName) {
      return NextResponse.json({ error: 'Email, password, and company name are required' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Email is already in use' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create Tenant and User in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const tenant = await tx.tenant.create({
        data: {
          name: companyName,
          subscriptionPlan: 'STARTER',
          isTrial: true,
          trialStartDate: new Date(),
          trialEndDate: new Date(new Date().setDate(new Date().getDate() + 14)), // 14 days trial
        }
      });

      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          role: 'ADMIN',
          tenantId: tenant.id,
        }
      });

      return { user, tenant };
    });

    // Set session cookie
    const response = NextResponse.json({ success: true, user: { id: result.user.id, email: result.user.email, tenantId: result.user.tenantId } });
    
    response.cookies.set({
      name: 'zenpos_session',
      value: JSON.stringify({ userId: result.user.id, tenantId: result.user.tenantId }),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return response;
  } catch (error: any) {
    console.error('Register Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
