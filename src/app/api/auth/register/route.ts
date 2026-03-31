import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, password } = await req.json();

    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 },
      );
    }

    if (!email && !phone) {
      return NextResponse.json(
        { error: 'Email or phone number is required' },
        { status: 400 },
      );
    }

    // Check for existing user
    if (email) {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
      }
    }

    if (phone) {
      const existing = await prisma.user.findUnique({ where: { phone } });
      if (existing) {
        return NextResponse.json({ error: 'Phone number already registered' }, { status: 409 });
      }
    }

    const passwordHash = await hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name: name || null,
        email: email || null,
        phone: phone || null,
        passwordHash,
      },
      select: { id: true, name: true, email: true, phone: true, role: true },
    });

    return NextResponse.json(user, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
