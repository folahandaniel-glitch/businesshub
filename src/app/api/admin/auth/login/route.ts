import { NextResponse } from 'next/server';
import { z } from 'zod';
import { loginAdmin } from '@/lib/admin-auth';

const schema = z.object({
  email: z.string().email().max(160),
  password: z.string().min(1).max(100)
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Enter your email and password.' }, { status: 400 });
  }

  try {
    const result = await loginAdmin(parsed.data);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 401 });
    return NextResponse.json({ ok: true, mustChangePassword: result.mustChangePassword });
  } catch {
    return NextResponse.json({ error: 'Could not sign you in. Try again shortly.' }, { status: 500 });
  }
}
