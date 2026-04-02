import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { initiateSTKPush } from '@/lib/mpesa';

/** POST /api/checkout — initiate M-Pesa STK push for an order */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { orderId, phone } = await req.json();

  if (!orderId || !phone) {
    return NextResponse.json(
      { error: 'orderId and phone are required' },
      { status: 400 },
    );
  }

  // Validate phone format (Kenyan: 254XXXXXXXXX)
  const cleanPhone = phone.replace(/\D/g, '');
  if (!/^254\d{9}$/.test(cleanPhone)) {
    return NextResponse.json(
      { error: 'Phone must be in format 254XXXXXXXXX' },
      { status: 400 },
    );
  }

  const order = await prisma.order.findFirst({
    where: { id: orderId, userId: session.user.id },
  });

  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  if (order.status !== 'PENDING') {
    return NextResponse.json({ error: 'Order is not pending' }, { status: 400 });
  }

  try {
    const result = await initiateSTKPush({
      phone: cleanPhone,
      amount: order.total,
      orderId: order.id,
      description: `Cara Stores order ${order.id}`,
    });

    // Store the phone used for payment
    await prisma.order.update({
      where: { id: order.id },
      data: { phone: cleanPhone },
    });

    return NextResponse.json({
      message: 'STK push sent. Check your phone to complete payment.',
      checkoutRequestId: result.CheckoutRequestID,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Payment initiation failed';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
