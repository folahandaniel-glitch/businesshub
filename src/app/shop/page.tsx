import type { Metadata } from 'next';
import { getShopResults, type ShopFilters, type SortKey } from '@/lib/shop-queries';
import { FilterSidebar } from '@/components/shop/FilterSidebar';
import { SortBar } from '@/components/shop/SortBar';
import { ProductGrid } from '@/components/shop/ProductGrid';
import { Pagination } from '@/components/shop/Pagination';

export const metadata: Metadata = {
  title: 'Shop all products',
  description: 'Browse laptops, desktops, monitors, printers, storage, networking and security equipment.'
};

export const dynamic = 'force-dynamic';

const SORT_VALUES: SortKey[] = ['relevance', 'price_asc', 'price_desc', 'newest', 'popularity', 'rating', 'discount'];

function parseFilters(searchParams: Record<string, string | string[] | undefined>): ShopFilters {
  const get = (key: string) => (Array.isArray(searchParams[key]) ? searchParams[key]?.[0] : searchParams[key]);
  const getAll = (key: string) => {
    const v = searchParams[key];
    if (!v) return [];
    return Array.isArray(v) ? v : [v];
  };

  const sortParam = get('sort');
  const conditionParam = get('condition');

  return {
    q: get('q'),
    categorySlug: get('category'),
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

export default async function ShopPage({
  searchParams
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const filters = parseFilters(searchParams);
  const results = await getShopResults(filters);

  const heading = filters.q ? `Results for "${filters.q}"` : results.categoryName ?? 'All products';

  return (
    <div className="shell py-8 md:py-10">
      <h1 className="rule-heading text-2xl md:text-3xl">{heading}</h1>

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
