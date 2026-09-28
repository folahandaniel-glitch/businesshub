import { prisma } from './prisma';
import { slugify } from './utils';
import { ProductStatus, ProductCondition, StockStatus, InventoryAction } from '@prisma/client';

export type AdminProductRow = {
  id: string;
  name: string;
  sku: string;
  brand: string;
  categoryName: string;
  price: number;
  previousPrice: number | null;
  status: string;
  stockQuantity: number;
  stockStatus: string;
  imageUrl: string | null;
};

export type AdminProductFilters = {
  q?: string;
  categoryId?: string;
  status?: ProductStatus;
  page?: number;
};

const PAGE_SIZE = 20;

export async function listProductsForAdmin(filters: AdminProductFilters) {
  const where = {
    ...(filters.categoryId ? { categoryId: filters.categoryId } : {}),
    ...(filters.status ? { status: filters.status } : {}),
    ...(filters.q?.trim()
      ? {
          OR: [
            { name: { contains: filters.q.trim(), mode: 'insensitive' as const } },
            { sku: { contains: filters.q.trim(), mode: 'insensitive' as const } },
            { brand: { contains: filters.q.trim(), mode: 'insensitive' as const } }
          ]
        }
      : {})
  };

  const page = Math.max(1, filters.page ?? 1);

  const [rows, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id: true,
        name: true,
        sku: true,
        brand: true,
        price: true,
        previousPrice: true,
        status: true,
        category: { select: { name: true } },
        inventory: { select: { stockQuantity: true, stockStatus: true } },
        images: { where: { isPrimary: true }, take: 1, select: { url: true } }
      }
    }),
    prisma.product.count({ where })
  ]);

  const products: AdminProductRow[] = rows.map((p: (typeof rows)[number]) => ({
    id: p.id,
    name: p.name,
    sku: p.sku,
    brand: p.brand,
    categoryName: p.category.name,
    price: Number(p.price),
    previousPrice: p.previousPrice === null ? null : Number(p.previousPrice),
    status: p.status,
    stockQuantity: p.inventory?.stockQuantity ?? 0,
    stockStatus: p.inventory?.stockStatus ?? 'OUT_OF_STOCK',
    imageUrl: p.images[0]?.url ?? null
  }));

  return { products, total, page, totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}

export type ProductImageInput = { url: string; altText?: string; isPrimary: boolean };

export type ProductFormInput = {
  name: string;
  sku: string;
  brand: string;
  modelNumber?: string;
  categoryId: string;
  shortDescription?: string;
  description: string;
  specifications: Record<string, string>;
  warrantyInfo?: string;
  price: number;
  previousPrice?: number | null;
  condition: ProductCondition;
  status: ProductStatus;
  isFeatured: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  tags: string[];
  images: ProductImageInput[];
  minStockLevel: number;
};

export type ProductForEdit = ProductFormInput & { id: string; stockQuantity: number };

function deriveOnSale(price: number, previousPrice?: number | null) {
  return Boolean(previousPrice && previousPrice > price);
}

function deriveStockStatus(quantity: number, minStockLevel: number): StockStatus {
  if (quantity <= 0) return StockStatus.OUT_OF_STOCK;
  if (quantity <= minStockLevel) return StockStatus.LOW_STOCK;
  return StockStatus.IN_STOCK;
}

export type ProductResult = { ok: true; id: string } | { ok: false; error: string };

/** Creating a product also opens its Inventory row and records the opening stock as a real transaction. */
export async function createProduct(input: ProductFormInput, initialStock: number): Promise<ProductResult> {
  const name = input.name.trim();
  if (name.length < 3) return { ok: false, error: 'Product name is too short.' };
  if (!input.sku.trim()) return { ok: false, error: 'SKU is required.' };
  if (input.price <= 0) return { ok: false, error: 'Price must be greater than zero.' };

  const slug = slugify(name);
  const [slugClash, skuClash] = await Promise.all([
    prisma.product.findUnique({ where: { slug } }),
    prisma.product.findUnique({ where: { sku: input.sku.trim() } })
  ]);
  if (slugClash) return { ok: false, error: 'A product with this name already exists.' };
  if (skuClash) return { ok: false, error: 'This SKU is already in use.' };

  const stock = Math.max(0, initialStock);
  const stockStatus = deriveStockStatus(stock, input.minStockLevel);

  const product = await prisma.product.create({
    data: {
      name,
      slug,
      sku: input.sku.trim(),
      brand: input.brand.trim(),
      modelNumber: input.modelNumber?.trim() || null,
      categoryId: input.categoryId,
      shortDescription: input.shortDescription?.trim() || null,
      description: input.description.trim(),
      specifications: input.specifications,
      warrantyInfo: input.warrantyInfo?.trim() || null,
      price: input.price,
      previousPrice: input.previousPrice || null,
      condition: input.condition,
      status: input.status,
      isFeatured: input.isFeatured,
      isBestSeller: input.isBestSeller,
      isNewArrival: input.isNewArrival,
      isOnSale: deriveOnSale(input.price, input.previousPrice),
      tags: input.tags,
      images: {
        create: input.images
          .filter((img) => img.url.trim())
          .map((img, i) => ({ url: img.url.trim(), altText: img.altText?.trim() || null, isPrimary: img.isPrimary, sortOrder: i }))
      },
      inventory: {
        create: { stockQuantity: stock, minStockLevel: input.minStockLevel, totalReceived: stock, stockStatus, lastRestockedAt: stock > 0 ? new Date() : null }
      }
    },
    select: { id: true, inventory: { select: { id: true } } }
  });

  if (stock > 0 && product.inventory) {
    await prisma.inventoryTransaction.create({
      data: {
        inventoryId: product.inventory.id,
        action: InventoryAction.STOCK_IN,
        quantity: stock,
        balanceAfter: stock,
        note: 'Opening stock at product creation'
      }
    });
  }

  return { ok: true, id: product.id };
}

export async function getProductForEdit(id: string): Promise<ProductForEdit | null> {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      images: { orderBy: { sortOrder: 'asc' } },
      inventory: { select: { stockQuantity: true, minStockLevel: true } }
    }
  });
  if (!product) return null;

  return {
    id: product.id,
    name: product.name,
    sku: product.sku,
    brand: product.brand,
    modelNumber: product.modelNumber ?? undefined,
    categoryId: product.categoryId,
    shortDescription: product.shortDescription ?? undefined,
    description: product.description,
    specifications: (product.specifications as Record<string, string> | null) ?? {},
    warrantyInfo: product.warrantyInfo ?? undefined,
    price: Number(product.price),
    previousPrice: product.previousPrice === null ? null : Number(product.previousPrice),
    condition: product.condition,
    status: product.status,
    isFeatured: product.isFeatured,
    isBestSeller: product.isBestSeller,
    isNewArrival: product.isNewArrival,
    tags: product.tags,
    images: product.images.map((img: (typeof product.images)[number]) => ({
      url: img.url,
      altText: img.altText ?? undefined,
      isPrimary: img.isPrimary
    })),
    minStockLevel: product.inventory?.minStockLevel ?? 5,
    stockQuantity: product.inventory?.stockQuantity ?? 0
  };
}

/**
 * Updates everything about a product except its stock quantity - that
 * only ever changes through the Inventory module's stock adjustment
 * action, which keeps a transaction history. This form can still change
 * the low-stock threshold, since that is a product setting, not a
 * movement of stock.
 */
export async function updateProduct(id: string, input: ProductFormInput): Promise<ProductResult> {
  const name = input.name.trim();
  if (name.length < 3) return { ok: false, error: 'Product name is too short.' };

  const current = await prisma.product.findUnique({ where: { id } });
  if (!current) return { ok: false, error: 'Product not found.' };

  const slug = name === current.name ? current.slug : slugify(name);
  if (slug !== current.slug) {
    const clash = await prisma.product.findUnique({ where: { slug } });
    if (clash) return { ok: false, error: 'A product with this name already exists.' };
  }
  if (input.sku.trim() !== current.sku) {
    const skuClash = await prisma.product.findUnique({ where: { sku: input.sku.trim() } });
    if (skuClash) return { ok: false, error: 'This SKU is already in use.' };
  }

  await prisma.$transaction(async (tx) => {
    await tx.product.update({
      where: { id },
      data: {
        name,
        slug,
        sku: input.sku.trim(),
        brand: input.brand.trim(),
        modelNumber: input.modelNumber?.trim() || null,
        categoryId: input.categoryId,
        shortDescription: input.shortDescription?.trim() || null,
        description: input.description.trim(),
        specifications: input.specifications,
        warrantyInfo: input.warrantyInfo?.trim() || null,
        price: input.price,
        previousPrice: input.previousPrice || null,
        condition: input.condition,
        status: input.status,
        isFeatured: input.isFeatured,
        isBestSeller: input.isBestSeller,
        isNewArrival: input.isNewArrival,
        isOnSale: deriveOnSale(input.price, input.previousPrice),
        tags: input.tags
      }
    });

    await tx.productImage.deleteMany({ where: { productId: id } });
    const validImages = input.images.filter((img) => img.url.trim());
    if (validImages.length > 0) {
      await tx.productImage.createMany({
        data: validImages.map((img, i) => ({
          productId: id,
          url: img.url.trim(),
          altText: img.altText?.trim() || null,
          isPrimary: img.isPrimary,
          sortOrder: i
        }))
      });
    }

    const inventory = await tx.inventory.findUnique({ where: { productId: id } });
    if (inventory) {
      await tx.inventory.update({
        where: { productId: id },
        data: {
          minStockLevel: input.minStockLevel,
          stockStatus: deriveStockStatus(inventory.stockQuantity, input.minStockLevel)
        }
      });
    }
  });

  return { ok: true, id };
}

export async function archiveProduct(id: string): Promise<ProductResult> {
  const product = await prisma.product.update({
    where: { id },
    data: { status: ProductStatus.ARCHIVED, archivedAt: new Date() },
    select: { id: true }
  }).catch(() => null);
  if (!product) return { ok: false, error: 'Product not found.' };
  return { ok: true, id: product.id };
}

export async function restoreProduct(id: string): Promise<ProductResult> {
  const product = await prisma.product.update({
    where: { id },
    data: { status: ProductStatus.PUBLISHED, archivedAt: null },
    select: { id: true }
  }).catch(() => null);
  if (!product) return { ok: false, error: 'Product not found.' };
  return { ok: true, id: product.id };
}

export type DeleteResult = { ok: true } | { ok: false; error: string };

export async function deleteProduct(id: string): Promise<DeleteResult> {
  try {
    await prisma.product.delete({ where: { id } });
    return { ok: true };
  } catch {
    return { ok: false, error: 'Could not delete this product.' };
  }
}
