/**
 * Shape the storefront consumes. Keeping a plain type here means every
 * listing (home, shop, category, related products) renders identically
 * regardless of which query produced the rows.
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

export const cardSelect = {
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

export type RawProduct = {
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

export function toCard(p: RawProduct): ProductCardData {
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
