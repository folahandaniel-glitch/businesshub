import { prisma } from './prisma';
import { ProductStatus, ProductCondition, Prisma } from '@prisma/client';
import { toCard, cardSelect, type RawProduct } from './product-card';
import type { ProductCardData } from './queries';

export const PAGE_SIZE = 12;

export type SortKey = 'relevance' | 'price_asc' | 'price_desc' | 'newest' | 'popularity' | 'rating' | 'discount';

export type ShopFilters = {
  q?: string;
  categorySlug?: string;
  brands?: string[];
  minPrice?: number;
  maxPrice?: number;
  condition?: ProductCondition;
  onSaleOnly?: boolean;
  featuredOnly?: boolean;
  sort?: SortKey;
  page?: number;
};

const SORT_MAP: Record<SortKey, Prisma.ProductOrderByWithRelationInput> = {
  relevance: { createdAt: 'desc' },
  price_asc: { price: 'asc' },
  price_desc: { price: 'desc' },
  newest: { createdAt: 'desc' },
  popularity: { soldCount: 'desc' },
  rating: { ratingAverage: 'desc' },
  discount: { updatedAt: 'desc' }
};

/** A category slug also pulls in its direct subcategories, one level deep. */
async function resolveCategoryIds(slug?: string) {
  if (!slug) return undefined;
  const category = await prisma.category.findUnique({
    where: { slug },
    include: { children: { select: { id: true } } }
  });
  if (!category) return [];
  return [category.id, ...category.children.map((c: { id: string }) => c.id)];
}

function buildWhere(filters: ShopFilters, categoryIds?: string[]): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = { status: ProductStatus.PUBLISHED };

  if (categoryIds) where.categoryId = { in: categoryIds };
  if (filters.brands?.length) where.brand = { in: filters.brands };
  if (filters.condition) where.condition = filters.condition;
  if (filters.onSaleOnly) where.isOnSale = true;
  if (filters.featuredOnly) where.isFeatured = true;
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    where.price = {
      ...(filters.minPrice !== undefined ? { gte: filters.minPrice } : {}),
      ...(filters.maxPrice !== undefined ? { lte: filters.maxPrice } : {})
    };
  }
  if (filters.q?.trim()) {
    const q = filters.q.trim();
    where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { brand: { contains: q, mode: 'insensitive' } },
      { modelNumber: { contains: q, mode: 'insensitive' } },
      { sku: { contains: q, mode: 'insensitive' } },
      { tags: { has: q.toLowerCase() } }
    ];
  }

  return where;
}

/**
 * Main shop query: search, filter, sort and paginate in one pass, plus the
 * brand list and price bounds needed to render the filter sidebar for
 * whatever slice of the catalogue is currently in view.
 */
export async function getShopResults(filters: ShopFilters) {
  try {
    const categoryIds = await resolveCategoryIds(filters.categorySlug);
    if (categoryIds && categoryIds.length === 0) {
      return { products: [], total: 0, page: 1, totalPages: 1, brands: [], priceBounds: null, categoryName: null };
    }

    const where = buildWhere(filters, categoryIds);
    const page = Math.max(1, filters.page ?? 1);
    const orderBy = SORT_MAP[filters.sort ?? 'relevance'];

    const [rows, total, brandRows, bounds, category] = await prisma.$transaction([
      prisma.product.findMany({
        where,
        select: cardSelect,
        orderBy,
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE
      }),
      prisma.product.count({ where }),
      prisma.product.findMany({
        where: { status: ProductStatus.PUBLISHED, ...(categoryIds ? { categoryId: { in: categoryIds } } : {}) },
        select: { brand: true },
        distinct: ['brand']
      }),
      prisma.product.aggregate({
        where: { status: ProductStatus.PUBLISHED, ...(categoryIds ? { categoryId: { in: categoryIds } } : {}) },
        _min: { price: true },
        _max: { price: true }
      }),
      filters.categorySlug
        ? prisma.category.findUnique({ where: { slug: filters.categorySlug }, select: { name: true } })
        : Promise.resolve(null)
    ]);

    return {
      products: rows.map((p: unknown) => toCard(p as RawProduct)),
      total,
      page,
      totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
      brands: brandRows.map((b: { brand: string }) => b.brand).sort(),
      priceBounds:
        bounds._min.price !== null
          ? { min: Number(bounds._min.price), max: Number(bounds._max.price) }
          : null,
      categoryName: category?.name ?? null
    };
  } catch {
    return { products: [], total: 0, page: 1, totalPages: 1, brands: [], priceBounds: null, categoryName: null };
  }
}

export type CategoryTileData = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  productCount: number;
  children: { id: string; name: string; slug: string; productCount: number }[];
};

/** Every visible category, top-level entries carrying their direct children. */
export async function getAllCategories(): Promise<CategoryTileData[]> {
  try {
    const categories = await prisma.category.findMany({
      where: { isVisible: true, parentId: null },
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        imageUrl: true,
        _count: { select: { products: true } },
        children: {
          where: { isVisible: true },
          orderBy: { sortOrder: 'asc' },
          select: { id: true, name: true, slug: true, _count: { select: { products: true } } }
        }
      }
    });

    return categories.map((c: (typeof categories)[number]) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      imageUrl: c.imageUrl,
      productCount: c._count.products,
      children: c.children.map((child: (typeof c.children)[number]) => ({
        id: child.id,
        name: child.name,
        slug: child.slug,
        productCount: child._count.products
      }))
    }));
  } catch {
    return [];
  }
}

export type ProductDetailData = ProductCardData & {
  shortDescription: string | null;
  description: string;
  specifications: Record<string, string> | null;
  warrantyInfo: string | null;
  sku: string;
  modelNumber: string | null;
  images: { url: string; altText: string | null }[];
  categoryName: string;
  categorySlug: string;
  parentCategoryName: string | null;
  parentCategorySlug: string | null;
};

export type ReviewData = {
  id: string;
  authorName: string;
  rating: number;
  title: string | null;
  body: string;
  createdAt: Date;
};

/** Full product page payload: the product itself, its approved reviews and related items. */
export async function getProductDetail(slug: string): Promise<{
  product: ProductDetailData;
  reviews: ReviewData[];
  related: ProductCardData[];
} | null> {
  try {
    const product = await prisma.product.findUnique({
      where: { slug, status: ProductStatus.PUBLISHED },
      include: {
        images: { orderBy: { sortOrder: 'asc' }, select: { url: true, altText: true } },
        inventory: { select: { stockQuantity: true, minStockLevel: true } },
        category: { select: { id: true, name: true, slug: true, parent: { select: { name: true, slug: true } } } }
      }
    });
    if (!product) return null;

    const [reviews, relatedRows] = await prisma.$transaction([
      prisma.review.findMany({
        where: { productId: product.id, status: 'APPROVED' },
        orderBy: { createdAt: 'desc' },
        take: 20,
        select: { id: true, authorName: true, rating: true, title: true, body: true, createdAt: true }
      }),
      prisma.product.findMany({
        where: { status: ProductStatus.PUBLISHED, categoryId: product.categoryId, NOT: { id: product.id } },
        select: cardSelect,
        take: 4,
        orderBy: { soldCount: 'desc' }
      })
    ]);

    return {
      product: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        brand: product.brand,
        condition: product.condition,
        price: Number(product.price),
        previousPrice: product.previousPrice === null ? null : Number(product.previousPrice),
        imageUrl: product.images[0]?.url ?? null,
        stockQuantity: product.inventory?.stockQuantity ?? 0,
        minStockLevel: product.inventory?.minStockLevel ?? 5,
        ratingAverage: product.ratingAverage,
        ratingCount: product.ratingCount,
        isBestSeller: product.isBestSeller,
        isNewArrival: product.isNewArrival,
        shortDescription: product.shortDescription,
        description: product.description,
        specifications: (product.specifications as Record<string, string> | null) ?? null,
        warrantyInfo: product.warrantyInfo,
        sku: product.sku,
        modelNumber: product.modelNumber,
        images: product.images,
        categoryName: product.category.name,
        categorySlug: product.category.slug,
        parentCategoryName: product.category.parent?.name ?? null,
        parentCategorySlug: product.category.parent?.slug ?? null
      },
      reviews,
      related: relatedRows.map((p: unknown) => toCard(p as RawProduct))
    };
  } catch {
    return null;
  }
}
