import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdminPermission } from '@/lib/admin-permissions';
import { updateSocialLinks } from '@/lib/admin-settings';
import { prisma } from '@/lib/prisma';

const schema = z.object({
  links: z.array(z.object({ id: z.string(), url: z.string().max(500), isActive: z.boolean() }))
});

export async function PATCH(request: Request) {
  const guard = await requireAdminPermission('CONTENT_MANAGEMENT', 'edit');
  if ('response' in guard) return guard.response;

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Could not save social links.' }, { status: 400 });
  }

  await updateSocialLinks(parsed.data.links);
  await prisma.auditLog.create({
    data: { adminId: guard.admin.id, actorLabel: guard.admin.email, action: 'SOCIAL_LINKS_UPDATED', entity: 'SocialLink' }
  });

  return NextResponse.json({ ok: true });
}
