import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdminPermission } from '@/lib/admin-permissions';
import { updateBusinessInfo } from '@/lib/admin-settings';
import { prisma } from '@/lib/prisma';

const schema = z.object({
  companyName: z.string().min(2).max(150),
  registrationNumber: z.string().max(60),
  tagline: z.string().max(150),
  description: z.string().max(600),
  aboutText: z.string().max(1500),
  businessHours: z.string().max(150)
});

export async function PATCH(request: Request) {
  const guard = await requireAdminPermission('CONTENT_MANAGEMENT', 'edit');
  if ('response' in guard) return guard.response;

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Check the form for missing or invalid fields.' }, { status: 400 });
  }

  await updateBusinessInfo(parsed.data);
  await prisma.auditLog.create({
    data: { adminId: guard.admin.id, actorLabel: guard.admin.email, action: 'BUSINESS_INFO_UPDATED', entity: 'BusinessInformation' }
  });

  return NextResponse.json({ ok: true });
}
