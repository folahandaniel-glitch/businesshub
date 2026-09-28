import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdminPermission } from '@/lib/admin-permissions';
import { updateContactInfo } from '@/lib/admin-settings';
import { prisma } from '@/lib/prisma';

const schema = z.object({
  primaryPhone: z.string().max(40),
  secondaryPhone: z.string().max(40),
  whatsappNumber: z.string().max(40),
  email: z.string().max(160),
  supportEmail: z.string().max(160),
  address: z.string().max(300),
  branchAddress: z.string().max(300),
  openingHours: z.string().max(150),
  mapsLink: z.string().max(500)
});

export async function PATCH(request: Request) {
  const guard = await requireAdminPermission('CONTENT_MANAGEMENT', 'edit');
  if ('response' in guard) return guard.response;

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Check the form for missing or invalid fields.' }, { status: 400 });
  }

  await updateContactInfo(parsed.data);
  await prisma.auditLog.create({
    data: { adminId: guard.admin.id, actorLabel: guard.admin.email, action: 'CONTACT_INFO_UPDATED', entity: 'ContactInformation' }
  });

  return NextResponse.json({ ok: true });
}
