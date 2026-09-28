import { NextResponse } from 'next/server';
import { requireAdminPermission } from '@/lib/admin-permissions';
import { restoreProduct } from '@/lib/admin-products';
import { prisma } from '@/lib/prisma';

export async function POST(_request: Request, { params }: { params: { id: string } }) {
  const guard = await requireAdminPermission('PRODUCT_MANAGEMENT', 'edit');
  if ('response' in guard) return guard.response;

  const result = await restoreProduct(params.id);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });

  await prisma.auditLog.create({
    data: { adminId: guard.admin.id, actorLabel: guard.admin.email, action: 'PRODUCT_RESTORED', entity: 'Product', entityId: params.id }
  });

  return NextResponse.json({ ok: true });
}
