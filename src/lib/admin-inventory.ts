import { prisma } from './prisma';
import { StockStatus, InventoryAction } from '@prisma/client';

export type InventoryRow = {
  productId: string;
  inventoryId: string;
  name: string;
  sku: string;
  brand: string;
  imageUrl: string | null;
  stockQuantity: number;
  minStockLevel: number;
  stockStatus: string;
  lastRestockedAt: Date | null;
};

export type InventoryFilters = { q?: string; stockStatus?: StockStatus; page?: number };

const PAGE_SIZE = 20;

export async function listInventory(filters: InventoryFilters) {
  const where = {
    ...(filters.stockStatus ? { inventory: { stockStatus: filters.stockStatus } } : {}),
    ...(filters.q?.trim()
      ? {
          OR: [
            { name: { contains: filters.q.trim(), mode: 'insensitive' as const } },
            { sku: { contains: filters.q.trim(), mode: 'insensitive' as const } }
          ]
        }
      : {})
  };

  const page = Math.max(1, filters.page ?? 1);

  const [rows, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { inventory: { stockQuantity: 'asc' } },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id: true,
        name: true,
        sku: true,
        brand: true,
        images: { where: { isPrimary: true }, take: 1, select: { url: true } },
        inventory: { select: { id: true, stockQuantity: true, minStockLevel: true, stockStatus: true, lastRestockedAt: true } }
      }
    }),
    prisma.product.count({ where })
  ]);

  const items: InventoryRow[] = rows
    .filter((p: (typeof rows)[number]) => p.inventory)
    .map((p: (typeof rows)[number]) => ({
      productId: p.id,
      inventoryId: p.inventory!.id,
      name: p.name,
      sku: p.sku,
      brand: p.brand,
      imageUrl: p.images[0]?.url ?? null,
      stockQuantity: p.inventory!.stockQuantity,
      minStockLevel: p.inventory!.minStockLevel,
      stockStatus: p.inventory!.stockStatus,
      lastRestockedAt: p.inventory!.lastRestockedAt
    }));

  return { items, total, page, totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}

export type InventoryHistoryEntry = {
  id: string;
  action: string;
  quantity: number;
  balanceAfter: number;
  note: string | null;
  reference: string | null;
  adminLabel: string | null;
  createdAt: Date;
};

export async function getInventoryHistory(productId: string): Promise<{
  productName: string;
  sku: string;
  stockQuantity: number;
  minStockLevel: number;
  entries: InventoryHistoryEntry[];
} | null> {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: {
      name: true,
      sku: true,
      inventory: {
        select: {
          stockQuantity: true,
          minStockLevel: true,
          transactions: {
            orderBy: { createdAt: 'desc' },
            take: 50,
            select: {
              id: true,
              action: true,
              quantity: true,
              balanceAfter: true,
              note: true,
              reference: true,
              createdAt: true,
              admin: { select: { fullName: true } }
            }
          }
        }
      }
    }
  });
  if (!product || !product.inventory) return null;

  return {
    productName: product.name,
    sku: product.sku,
    stockQuantity: product.inventory.stockQuantity,
    minStockLevel: product.inventory.minStockLevel,
    entries: product.inventory.transactions.map((t: (typeof product.inventory.transactions)[number]) => ({
      id: t.id,
      action: t.action,
      quantity: t.quantity,
      balanceAfter: t.balanceAfter,
      note: t.note,
      reference: t.reference,
      adminLabel: t.admin?.fullName ?? null,
      createdAt: t.createdAt
    }))
  };
}

function deriveStockStatus(quantity: number, minStockLevel: number): StockStatus {
  if (quantity <= 0) return StockStatus.OUT_OF_STOCK;
  if (quantity <= minStockLevel) return StockStatus.LOW_STOCK;
  return StockStatus.IN_STOCK;
}

export type AdjustResult = { ok: true } | { ok: false; error: string };

/**
 * A stock-in adds quantity and counts toward totalReceived. A damage/loss
 * adjustment removes quantity, floored at zero rather than going negative.
 * A manual adjustment applies a signed delta directly, for correcting a
 * miscount either way. Every adjustment writes a transaction row, so the
 * full history stays reconstructable regardless of which reason was used.
 */
export async function adjustStock(
  productId: string,
  input: { action: 'STOCK_IN' | 'DAMAGE' | 'ADJUSTMENT'; quantity: number; note?: string; adminId: string }
): Promise<AdjustResult> {
  if (input.quantity === 0) return { ok: false, error: 'Enter a non-zero quantity.' };
  if (input.action !== 'ADJUSTMENT' && input.quantity < 0) {
    return { ok: false, error: 'Enter a positive quantity for this reason.' };
  }

  const inventory = await prisma.inventory.findUnique({ where: { productId } });
  if (!inventory) return { ok: false, error: 'This product has no inventory record.' };

  const delta = input.action === 'DAMAGE' ? -Math.abs(input.quantity) : input.quantity;
  const newQuantity = Math.max(0, inventory.stockQuantity + delta);
  const stockStatus = deriveStockStatus(newQuantity, inventory.minStockLevel);

  await prisma.$transaction(async (tx) => {
    await tx.inventory.update({
      where: { productId },
      data: {
        stockQuantity: newQuantity,
        stockStatus,
        ...(input.action === 'STOCK_IN'
          ? { totalReceived: { increment: Math.abs(delta) }, lastRestockedAt: new Date() }
          : {})
      }
    });

    await tx.inventoryTransaction.create({
      data: {
        inventoryId: inventory.id,
        action: InventoryAction[input.action],
        quantity: delta,
        balanceAfter: newQuantity,
        note: input.note?.trim() || null,
        adminId: input.adminId
      }
    });
  });

  return { ok: true };
}
