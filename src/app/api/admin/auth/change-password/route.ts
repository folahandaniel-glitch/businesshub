import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getCurrentAdmin } from '@/lib/admin-permissions';
import { changeAdminPassword } from '@/lib/admin-auth';

const schema = z.object({
  currentPassword: z.string().min(1).max(100),
  newPassword: z.string().min(12).max(100)
});

export async function POST(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 });

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'New password must be at least 12 characters.' }, { status: 400 });
  }

  try {
    const result = await changeAdminPassword(admin.id, parsed.data);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Could not update your password. Try again shortly.' }, { status: 500 });
  }
}
