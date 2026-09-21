import { NextResponse } from 'next/server';
import { z } from 'zod';
import { registerCustomer } from '@/lib/customer-auth';

const schema = z.object({
  fullName: z.string().min(2).max(120),
  email: z.string().email().max(160),
  phone: z.string().min(7).max(30),
  password: z.string().min(8).max(100)
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Check the form for missing or invalid fields.' }, { status: 400 });
  }

  try {
    const result = await registerCustomer(parsed.data);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
    return NextResponse.json({ ok: true });
  } catch {
    // Covers a misconfigured AUTH_SECRET or any other unexpected failure
    // while opening the session - never surface Next's generic error page
    // for what the customer sees as "create account didn't work."
    return NextResponse.json({ error: 'Could not create your account. Try again shortly.' }, { status: 500 });
  }
}
