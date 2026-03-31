import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

type TxClient = Omit<typeof prisma, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>;

/** POST /api/orders — create an order from the user's cart */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { shippingOption, paymentMethod, phone } = await req.json();

  if (!shippingOption || !paymentMethod) {
    return NextResponse.json(
      { error: 'Shipping and payment details required' },
      { status: 400 },
    );
  }

  // Fetch cart items
  const cartItems = await prisma.cartItem.findMany({
    where: { userId: session.user.id },
    include: { product: true },
  });

  if (cartItems.length === 0) {
    return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
  }

  const total = cartItems.reduce(
    (sum: number, item: typeof cartItems[number]) => sum + item.product.price * item.quantity,
    0,
  );

  // Create the order with items in a transaction
  const order = await prisma.$transaction(async (tx: TxClient) => {
    const newOrder = await tx.order.create({
      data: {
        userId: session.user.id,
        total,
        shippingOption,
        paymentMethod,
        phone: phone || null,
        items: {
          create: cartItems.map((ci: typeof cartItems[number]) => ({
            productId: ci.productId,
            quantity: ci.quantity,
            size: ci.size,
            price: ci.product.price,
          })),
        },
      },
      include: { items: { include: { product: true } } },
    });

    // Clear the cart
    await tx.cartItem.deleteMany({ where: { userId: session.user.id } });

    return newOrder;
  });

  return NextResponse.json({ order }, { status: 201 });
}

/** GET /api/orders — list user's orders */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ orders });
}
