import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdminPermission } from '@/lib/admin-permissions';
import { updateProduct, deleteProduct } from '@/lib/admin-products';
import { prisma } from '@/lib/prisma';
import { ProductCondition, ProductStatus } from '@prisma/client';

const imageSchema = z.object({ url: z.string().max(2000), altText: z.string().max(200).optional(), isPrimary: z.boolean() });

const schema = z.object({
  name: z.string().min(3).max(200),
  sku: z.string().min(1).max(60),
  brand: z.string().min(1).max(100),
  modelNumber: z.string().max(100).optional(),
  categoryId: z.string().min(1),
  shortDescription: z.string().max(300).optional(),
  description: z.string().min(1).max(5000),
  specifications: z.record(z.string()),
  warrantyInfo: z.string().max(300).optional(),
  price: z.number().positive(),
  previousPrice: z.number().positive().nullable().optional(),
  condition: z.nativeEnum(ProductCondition),
  status: z.nativeEnum(ProductStatus),
  isFeatured: z.boolean(),
  isBestSeller: z.boolean(),
  isNewArrival: z.boolean(),
  tags: z.array(z.string().max(40)).max(20),
  images: z.array(imageSchema).max(10),
  minStockLevel: z.number().int().min(0)
});

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const guard = await requireAdminPermission('PRODUCT_MANAGEMENT', 'edit');
  if ('response' in guard) return guard.response;

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Check the form for missing or invalid fields.' }, { status: 400 });
  }

  const result = await updateProduct(params.id, parsed.data);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });

  await prisma.auditLog.create({
    data: { adminId: guard.admin.id, actorLabel: guard.admin.email, action: 'PRODUCT_UPDATED', entity: 'Product', entityId: params.id }
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const guard = await requireAdminPermission('PRODUCT_MANAGEMENT', 'delete');
  if ('response' in guard) return guard.response;

  const result = await deleteProduct(params.id);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });

  await prisma.auditLog.create({
    data: { adminId: guard.admin.id, actorLabel: guard.admin.email, action: 'PRODUCT_DELETED', entity: 'Product', entityId: params.id }
  });

  return NextResponse.json({ ok: true });
}
