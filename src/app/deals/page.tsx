import type { Metadata } from 'next';
import { getShopResults, type ShopFilters, type SortKey } from '@/lib/shop-queries';
import { SortBar } from '@/components/shop/SortBar';
import { ProductGrid } from '@/components/shop/ProductGrid';
import { Pagination } from '@/components/shop/Pagination';

export const metadata: Metadata = {
  title: "Today's deals",
  description: 'Every product currently reduced in price at BUSINESS-HUB COMPUTERS.'
};

export const dynamic = 'force-dynamic';

const SORT_VALUES: SortKey[] = ['relevance', 'price_asc', 'price_desc', 'newest', 'popularity', 'rating', 'discount'];

export default async function DealsPage({
  searchParams
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const sortParam = searchParams.sort;
  const pageParam = searchParams.page;

  const filters: ShopFilters = {
    onSaleOnly: true,
    sort: SORT_VALUES.includes(sortParam as SortKey) ? (sortParam as SortKey) : 'discount',
    page: pageParam ? Number(pageParam) : 1
  };

  const results = await getShopResults(filters);

  return (
    <div className="shell py-8 md:py-10">
      <h1 className="rule-heading text-2xl md:text-3xl">Today&apos;s deals</h1>
      <p className="mt-3 max-w-xl text-sm text-slate">
        Reduced prices across the catalogue. Stock on these listings moves faster than usual.
      </p>

      <div className="mt-6">
        <SortBar total={results.total} label={results.total === 1 ? 'deal available' : 'deals available'} />
        <ProductGrid products={results.products} />
        <Pagination page={results.page} totalPages={results.totalPages} />
      </div>
    </div>
  );
}
