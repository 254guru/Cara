import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getDefaultProductUnit } from '@/lib/productUnits';

/** GET /api/cart — fetch the current user's cart */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const items = await prisma.cartItem.findMany({
    where: { userId: session.user.id },
    include: { product: true },
    orderBy: { createdAt: 'asc' },
  });

  return NextResponse.json({ items });
}

/** POST /api/cart — add or update a cart item */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { productId, quantity = 1, size } = await req.json();

  if (!productId) {
    return NextResponse.json({ error: 'productId is required' }, { status: 400 });
  }

  const numericProductId = parseInt(productId, 10);
  const product = await prisma.product.findUnique({
    where: { id: numericProductId },
    select: {
      title: true,
      category: true,
      description: true,
    },
  });

  const resolvedSize = size || getDefaultProductUnit(product || {});

  // Upsert: if same product+size exists, update quantity
  const item = await prisma.cartItem.upsert({
    where: {
      userId_productId_size: {
        userId: session.user.id,
        productId: numericProductId,
        size: resolvedSize,
      },
    },
    update: { quantity },
    create: {
      userId: session.user.id,
      productId: numericProductId,
      quantity,
      size: resolvedSize,
    },
    include: { product: true },
  });

  return NextResponse.json({ item });
}

/** DELETE /api/cart — remove an item or clear cart */
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const itemId = searchParams.get('id');
  const clearAll = searchParams.get('clear') === 'true';

  if (clearAll) {
    await prisma.cartItem.deleteMany({ where: { userId: session.user.id } });
    return NextResponse.json({ message: 'Cart cleared' });
  }

  if (!itemId) {
    return NextResponse.json({ error: 'Item id is required' }, { status: 400 });
  }

  await prisma.cartItem.deleteMany({
    where: { id: itemId, userId: session.user.id },
  });

  return NextResponse.json({ message: 'Item removed' });
}
