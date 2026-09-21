import { prisma } from './prisma';
import { getSession } from './session';
import type { ProductCardData } from './product-card';
import { toCard, cardSelect, type RawProduct } from './product-card';

export async function getWishlistCount(): Promise<number> {
  try {
    const session = await getSession();
    if (!session) return 0;
    return prisma.wishlistItem.count({ where: { customerId: session.customerId } });
  } catch {
    return 0;
  }
}

export async function getWishlist(): Promise<ProductCardData[]> {
  try {
    const session = await getSession();
    if (!session) return [];

    const items = await prisma.wishlistItem.findMany({
      where: { customerId: session.customerId },
      orderBy: { createdAt: 'desc' },
      select: { product: { select: cardSelect } }
    });

    return items.map((i: unknown) => toCard((i as { product: unknown }).product as RawProduct));
  } catch {
    return [];
  }
}

export async function isInWishlist(productId: string): Promise<boolean> {
  try {
    const session = await getSession();
    if (!session) return false;
    const item = await prisma.wishlistItem.findUnique({
      where: { customerId_productId: { customerId: session.customerId, productId } }
    });
    return Boolean(item);
  } catch {
    return false;
  }
}

/** Toggles wishlist membership for the signed-in customer. Throws if nobody is signed in. */
export async function toggleWishlist(productId: string): Promise<{ inWishlist: boolean }> {
  const session = await getSession();
  if (!session) throw new Error('Sign in to save items to your wishlist.');

  const existing = await prisma.wishlistItem.findUnique({
    where: { customerId_productId: { customerId: session.customerId, productId } }
  });

  if (existing) {
    await prisma.wishlistItem.delete({ where: { id: existing.id } });
    return { inWishlist: false };
  }

  await prisma.wishlistItem.create({ data: { customerId: session.customerId, productId } });
  return { inWishlist: true };
}
