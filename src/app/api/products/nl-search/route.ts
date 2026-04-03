import { NextRequest, NextResponse } from 'next/server';
import { semanticSearchProducts } from '@/lib/semantic';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get('q') || '').trim();
    const limit = Math.min(24, Math.max(1, Number(searchParams.get('limit') || 12)));

    if (!q) {
      return NextResponse.json({ products: [], query: q, hints: ['Try "blue t-shirt under 3000"'] });
    }

    const products = await semanticSearchProducts(q, limit);

    return NextResponse.json({
      products,
      query: q,
      hints: [
        'Use color + item type, for example: "white t-shirt"',
        'Add budget: "under 2500"',
        'Try style words like "linen" or "casual"',
      ],
    });
  } catch (error) {
    console.error('NL search failed', error);
    return NextResponse.json(
      {
        products: [],
        query: '',
        hints: ['Search is temporarily unavailable. Please try again shortly.'],
      },
      { status: 200 },
    );
  }
}
