import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { scrapeFashionCatalog } from '@/lib/catalog';
import { chatCompletion } from '@/lib/ai';
import { semanticSearchProducts } from '@/lib/semantic';

type SearchProduct = {
  id: number;
  brand: string;
  title: string;
  price: number;
  image: string;
  rating: number;
  fullRating: boolean;
  description?: string;
};

function rankProducts(message: string, products: SearchProduct[]): SearchProduct[] {
  const terms = message
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 2);

  return products
    .map((product) => {
      const haystack = `${product.title} ${product.brand} ${product.description || ''}`.toLowerCase();
      const score = terms.reduce((acc, term) => (haystack.includes(term) ? acc + 2 : acc), 0);
      return { product, score };
    })
    .sort((a, b) => b.score - a.score)
    .map((x) => x.product);
}

async function loadProducts(): Promise<SearchProduct[]> {
  try {
    const rows = await prisma.product.findMany({
      where: { inStock: true },
      select: {
        id: true,
        brand: true,
        title: true,
        price: true,
        image: true,
        rating: true,
        fullRating: true,
        description: true,
      },
      take: 100,
      orderBy: { createdAt: 'desc' },
    });
    return rows;
  } catch {
    const scraped = await scrapeFashionCatalog(80);
    return scraped.map((item, idx) => ({
      id: idx + 1,
      brand: item.brand,
      title: item.title,
      price: item.price,
      image: item.image,
      rating: item.rating,
      fullRating: item.fullRating,
      description: item.description,
    }));
  }
}

function serializeCatalog(products: SearchProduct[]): string {
  return products
    .slice(0, 8)
    .map((p) => `${p.id}: ${p.title} (${p.brand}) - KES ${p.price.toLocaleString('en-KE')}`)
    .join('\n');
}

function serializeHistory(history: Array<{ role: string; content: string }>): string {
  return history.map((m) => `${m.role}: ${m.content}`).join('\n');
}

function fallbackReply(message: string, picks: SearchProduct[]): string {
  if (!picks.length) {
    return 'I could not find a strong match yet. Try adding a color, item type, or budget like "under 3000".';
  }

  const lines = picks.slice(0, 3).map((p) => `- ${p.title} by ${p.brand} (KES ${p.price.toLocaleString('en-KE')})`);
  const budgetHint = /under|below|less than|max/i.test(message)
    ? 'I prioritized options close to your budget.'
    : 'If you want, share a budget and I can narrow this further.';

  return `Here are strong matches for your request:\n${lines.join('\n')}\n${budgetHint}`;
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ sessionId: null, messages: [] });
  }

  const { searchParams } = new URL(req.url);
  const requestedSessionId = searchParams.get('sessionId');

  const chatSession = requestedSessionId
    ? await prisma.chatSession.findFirst({
      where: { id: requestedSessionId, userId: session.user.id },
      include: { messages: { orderBy: { createdAt: 'asc' }, take: 20 } },
    })
    : await prisma.chatSession.findFirst({
      where: { userId: session.user.id },
      orderBy: { updatedAt: 'desc' },
      include: { messages: { orderBy: { createdAt: 'asc' }, take: 20 } },
    });

  if (!chatSession) {
    return NextResponse.json({ sessionId: null, messages: [] });
  }

  const messages = chatSession.messages.map((m) => ({
    role: m.role === 'USER' ? 'user' : 'assistant',
    content: m.content,
  }));

  return NextResponse.json({ sessionId: chatSession.id, messages });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const body = (await req.json()) as { message?: string; sessionId?: string };
  const message = (body.message || '').trim();

  if (!message) {
    return NextResponse.json({ error: 'Message is required' }, { status: 400 });
  }

  const semantic = await semanticSearchProducts(message, 8);
  const products = semantic.length > 0 ? semantic : await loadProducts();
  const ranked = rankProducts(message, products);
  const suggestedProducts = ranked.slice(0, 4);

  let activeSessionId: string | null = null;
  let history: Array<{ role: string; content: string }> = [];

  if (session?.user?.id) {
    const found = body.sessionId
      ? await prisma.chatSession.findFirst({
        where: { id: body.sessionId, userId: session.user.id },
      })
      : await prisma.chatSession.findFirst({
        where: { userId: session.user.id },
        orderBy: { updatedAt: 'desc' },
      });

    const chatSession = found || await prisma.chatSession.create({
      data: {
        userId: session.user.id,
        title: message.slice(0, 60),
      },
    });

    activeSessionId = chatSession.id;

    const priorMessages = await prisma.chatMessage.findMany({
      where: { sessionId: chatSession.id },
      orderBy: { createdAt: 'asc' },
      take: 12,
    });

    history = priorMessages.map((m) => ({
      role: m.role === 'USER' ? 'user' : 'assistant',
      content: m.content,
    }));

    await prisma.chatMessage.create({
      data: {
        sessionId: chatSession.id,
        role: 'USER',
        content: message,
      },
    });
  }

  const aiReply = await chatCompletion(
    message,
    serializeCatalog(suggestedProducts),
    serializeHistory(history),
  );

  const reply = aiReply || fallbackReply(message, suggestedProducts);

  if (activeSessionId) {
    await prisma.chatMessage.create({
      data: {
        sessionId: activeSessionId,
        role: 'ASSISTANT',
        content: reply,
      },
    });

    await prisma.chatSession.update({
      where: { id: activeSessionId },
      data: { updatedAt: new Date() },
    });
  }

  return NextResponse.json({ reply, suggestedProducts, sessionId: activeSessionId });
}
