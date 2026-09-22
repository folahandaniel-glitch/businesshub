import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdminPermission } from '@/lib/admin-permissions';
import { updateCategory, deleteCategory } from '@/lib/admin-categories';
import { prisma } from '@/lib/prisma';

const schema = z.object({
  name: z.string().min(2).max(120),
  description: z.string().max(500).optional(),
  parentId: z.string().optional().nullable(),
  isVisible: z.boolean().optional(),
  isPopular: z.boolean().optional()
});

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const guard = await requireAdminPermission('CATEGORY_MANAGEMENT', 'edit');
  if ('response' in guard) return guard.response;

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Check the form for missing or invalid fields.' }, { status: 400 });
  }

  const result = await updateCategory(params.id, parsed.data);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });

  await prisma.auditLog.create({
    data: {
      adminId: guard.admin.id,
      actorLabel: guard.admin.email,
      action: 'CATEGORY_UPDATED',
      entity: 'Category',
      entityId: params.id
    }
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const guard = await requireAdminPermission('CATEGORY_MANAGEMENT', 'delete');
  if ('response' in guard) return guard.response;

  const result = await deleteCategory(params.id);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });

  await prisma.auditLog.create({
    data: { adminId: guard.admin.id, actorLabel: guard.admin.email, action: 'CATEGORY_DELETED', entity: 'Category', entityId: params.id }
  });

  return NextResponse.json({ ok: true });
}
