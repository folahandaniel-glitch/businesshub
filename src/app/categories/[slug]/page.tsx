import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getShopResults, type ShopFilters, type SortKey } from '@/lib/shop-queries';
import { prisma } from '@/lib/prisma';
import { FilterSidebar } from '@/components/shop/FilterSidebar';
import { SortBar } from '@/components/shop/SortBar';
import { ProductGrid } from '@/components/shop/ProductGrid';
import { Pagination } from '@/components/shop/Pagination';

export const dynamic = 'force-dynamic';

const SORT_VALUES: SortKey[] = ['relevance', 'price_asc', 'price_desc', 'newest', 'popularity', 'rating', 'discount'];

async function getCategoryMeta(slug: string) {
  try {
    return await prisma.category.findUnique({
      where: { slug, isVisible: true },
      select: { name: true, description: true, metaTitle: true, metaDescription: true }
    });
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const category = await getCategoryMeta(params.slug);
  if (!category) return { title: 'Category' };
  return {
    title: category.metaTitle ?? category.name,
    description: category.metaDescription ?? category.description ?? undefined
  };
}

function parseFilters(searchParams: Record<string, string | string[] | undefined>, categorySlug: string): ShopFilters {
  const get = (key: string) => (Array.isArray(searchParams[key]) ? searchParams[key]?.[0] : searchParams[key]);
  const getAll = (key: string) => {
    const v = searchParams[key];
    if (!v) return [];
    return Array.isArray(v) ? v : [v];
  };
  const sortParam = get('sort');
  const conditionParam = get('condition');

  return {
    categorySlug,
    brands: getAll('brand'),
    minPrice: get('min') ? Number(get('min')) : undefined,
    maxPrice: get('max') ? Number(get('max')) : undefined,
    condition:
      conditionParam === 'NEW' || conditionParam === 'REFURBISHED' || conditionParam === 'UK_USED'
        ? conditionParam
        : undefined,
    onSaleOnly: get('sale') === '1',
    sort: SORT_VALUES.includes(sortParam as SortKey) ? (sortParam as SortKey) : 'relevance',
    page: get('page') ? Number(get('page')) : 1
  };
}

export default async function CategoryPage({
  params,
  searchParams
}: {
  params: { slug: string };
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const category = await getCategoryMeta(params.slug);
  if (!category) notFound();

  const filters = parseFilters(searchParams, params.slug);
  const results = await getShopResults(filters);

  return (
    <div className="shell py-8 md:py-10">
      <h1 className="rule-heading text-2xl md:text-3xl">{category.name}</h1>
      {category.description ? <p className="mt-3 max-w-xl text-sm text-slate">{category.description}</p> : null}

      <div className="mt-6 flex flex-col gap-8 lg:flex-row">
        <FilterSidebar data={{ brands: results.brands, priceBounds: results.priceBounds }} />

        <div className="flex-1">
          <SortBar total={results.total} label={results.total === 1 ? 'product found' : 'products found'} />
          <ProductGrid products={results.products} />
          <Pagination page={results.page} totalPages={results.totalPages} />
        </div>
      </div>
    </div>
  );
}
