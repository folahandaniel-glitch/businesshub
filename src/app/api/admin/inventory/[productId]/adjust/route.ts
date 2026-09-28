import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdminPermission } from '@/lib/admin-permissions';
import { adjustStock } from '@/lib/admin-inventory';
import { prisma } from '@/lib/prisma';

const schema = z.object({
  action: z.enum(['STOCK_IN', 'DAMAGE', 'ADJUSTMENT']),
  quantity: z.number().int(),
  note: z.string().max(300).optional()
});

export async function POST(request: Request, { params }: { params: { productId: string } }) {
  const guard = await requireAdminPermission('INVENTORY_MANAGEMENT', 'edit');
  if ('response' in guard) return guard.response;

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Enter a valid quantity.' }, { status: 400 });
  }

  const result = await adjustStock(params.productId, { ...parsed.data, adminId: guard.admin.id });
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });

  await prisma.auditLog.create({
    data: {
      adminId: guard.admin.id,
      actorLabel: guard.admin.email,
      action: 'INVENTORY_ADJUSTED',
      entity: 'Inventory',
      entityId: params.productId,
      metadata: parsed.data
    }
  });

  return NextResponse.json({ ok: true });
}
