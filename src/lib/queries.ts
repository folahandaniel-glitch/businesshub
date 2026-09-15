import { prisma } from './prisma';
import { ProductStatus } from '@prisma/client';

/**
 * Shape the storefront consumes. Keeping a plain type here means the
 * homepage renders identically whether data comes from the database
 * or from the fallback path on a fresh install.
 */
export type ProductCardData = {
  id: string;
  name: string;
  slug: string;
  brand: string;
  condition: string;
  price: number;
  previousPrice: number | null;
  imageUrl: string | null;
  stockQuantity: number;
  minStockLevel: number;
  ratingAverage: number;
  ratingCount: number;
  isBestSeller: boolean;
  isNewArrival: boolean;
};

const cardSelect = {
  id: true,
  name: true,
  slug: true,
  brand: true,
  condition: true,
  price: true,
  previousPrice: true,
  ratingAverage: true,
  ratingCount: true,
  isBestSeller: true,
  isNewArrival: true,
  images: { where: { isPrimary: true }, take: 1, select: { url: true } },
  inventory: { select: { stockQuantity: true, minStockLevel: true } }
} as const;

type RawProduct = {
  id: string;
  name: string;
  slug: string;
  brand: string;
  condition: string;
  price: unknown;
  previousPrice: unknown;
  ratingAverage: number;
  ratingCount: number;
  isBestSeller: boolean;
  isNewArrival: boolean;
  images: { url: string }[];
  inventory: { stockQuantity: number; minStockLevel: number } | null;
};

function toCard(p: RawProduct): ProductCardData {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    brand: p.brand,
    condition: p.condition,
    price: Number(p.price),
    previousPrice: p.previousPrice === null ? null : Number(p.previousPrice),
    imageUrl: p.images[0]?.url ?? null,
    stockQuantity: p.inventory?.stockQuantity ?? 0,
    minStockLevel: p.inventory?.minStockLevel ?? 5,
    ratingAverage: p.ratingAverage,
    ratingCount: p.ratingCount,
    isBestSeller: p.isBestSeller,
    isNewArrival: p.isNewArrival
  };
}

/** One round trip for everything the homepage needs. */
export async function getHomepageData() {
  try {
    const [featured, newArrivals, bestSellers, onSale, categories, testimonials, business] =
      await prisma.$transaction([
        prisma.product.findMany({
          where: { status: ProductStatus.PUBLISHED, isFeatured: true },
          select: cardSelect,
          take: 8,
          orderBy: { createdAt: 'desc' }
        }),
        prisma.product.findMany({
          where: { status: ProductStatus.PUBLISHED, isNewArrival: true },
          select: cardSelect,
          take: 8,
          orderBy: { createdAt: 'desc' }
        }),
        prisma.product.findMany({
          where: { status: ProductStatus.PUBLISHED, isBestSeller: true },
          select: cardSelect,
          take: 8,
          orderBy: { soldCount: 'desc' }
        }),
        prisma.product.findMany({
          where: { status: ProductStatus.PUBLISHED, isOnSale: true },
          select: cardSelect,
          take: 6,
          orderBy: { updatedAt: 'desc' }
        }),
        prisma.category.findMany({
          where: { isPopular: true, isVisible: true },
          select: { id: true, name: true, slug: true, imageUrl: true, _count: { select: { products: true } } },
          orderBy: { sortOrder: 'asc' },
          take: 10
        }),
        prisma.review.findMany({
          where: { isFeatured: true, status: 'APPROVED' },
          select: { id: true, authorName: true, rating: true, title: true, body: true },
          take: 3,
          orderBy: { createdAt: 'desc' }
        }),
        prisma.businessInformation.findUnique({ where: { id: 'singleton' } })
      ]);

    return {
      featured: featured.map((p: unknown) => toCard(p as RawProduct)),
      newArrivals: newArrivals.map((p: unknown) => toCard(p as RawProduct)),
      bestSellers: bestSellers.map((p: unknown) => toCard(p as RawProduct)),
      onSale: onSale.map((p: unknown) => toCard(p as RawProduct)),
      categories,
      testimonials,
      business
    };
  } catch {
    // Database not reachable yet. Render the shell rather than a crash page.
    return {
      featured: [],
      newArrivals: [],
      bestSellers: [],
      onSale: [],
      categories: [],
      testimonials: [],
      business: null
    };
  }
}

/** Contact and social values for the footer, controlled from the admin backend. */
export async function getSiteSettings() {
  try {
    const [contact, socials] = await prisma.$transaction([
      prisma.contactInformation.findUnique({ where: { id: 'singleton' } }),
      prisma.socialLink.findMany({
        where: { isActive: true, NOT: { url: '' } },
        orderBy: { sortOrder: 'asc' },
        select: { platform: true, url: true }
      })
    ]);
    return { contact, socials };
  } catch {
    return { contact: null, socials: [] };
  }
}
