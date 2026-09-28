import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdminPermission } from '@/lib/admin-permissions';
import { createProduct } from '@/lib/admin-products';
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
  minStockLevel: z.number().int().min(0),
  initialStock: z.number().int().min(0)
});

export async function POST(request: Request) {
  const guard = await requireAdminPermission('PRODUCT_MANAGEMENT', 'create');
  if ('response' in guard) return guard.response;

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Check the form for missing or invalid fields.' }, { status: 400 });
  }

  const { initialStock, ...input } = parsed.data;
  const result = await createProduct(input, initialStock);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });

  await prisma.auditLog.create({
    data: { adminId: guard.admin.id, actorLabel: guard.admin.email, action: 'PRODUCT_CREATED', entity: 'Product', entityId: result.id }
  });

  return NextResponse.json({ ok: true, id: result.id });
}
