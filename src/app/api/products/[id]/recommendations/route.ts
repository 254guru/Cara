import { NextRequest, NextResponse } from 'next/server';
import { completeTheLook } from '@/lib/semantic';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const productId = Number(id);

  if (!Number.isInteger(productId) || productId <= 0) {
    return NextResponse.json({ error: 'Invalid product id' }, { status: 400 });
  }

  const recommendations = await completeTheLook(productId, 4);
  return NextResponse.json({ recommendations });
}
