import { PackageSearch } from 'lucide-react';
import { ProductCard } from './ProductCard';
import type { ProductCardData } from '@/lib/queries';

export function ProductGrid({ products }: { products: ProductCardData[] }) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-card border border-dashed border-line bg-white py-16 text-center">
        <PackageSearch size={36} className="text-brand-line" strokeWidth={1.25} aria-hidden />
        <p className="font-semibold text-ink">No products match these filters</p>
        <p className="max-w-xs text-sm text-slate">Try widening your price range or clearing a filter to see more results.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
