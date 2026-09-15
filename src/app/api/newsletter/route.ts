import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const schema = z.object({ email: z.string().email().max(160) });

export async function POST(request: Request) {
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 });
    }

    const email = parsed.data.email.trim().toLowerCase();

    await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: { isActive: true },
      create: { email }
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Subscription failed. Try again shortly.' }, { status: 500 });
  }
}
