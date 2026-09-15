import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from './ProductCard';
import type { ProductCardData } from '@/lib/queries';

/**
 * Reusable titled product grid. Renders nothing when the list is empty,
 * so a fresh catalogue never leaves hollow sections on the homepage.
 */
export function ProductSection({
  title,
  description,
  products,
  viewAllHref,
  columns = 4
}: {
  title: string;
  description?: string;
  products: ProductCardData[];
  viewAllHref: string;
  columns?: 3 | 4;
}) {
  if (products.length === 0) return null;

  return (
    <section className="shell py-10 md:py-14">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="rule-heading">{title}</h2>
          {description ? <p className="mt-2 max-w-xl text-sm text-slate">{description}</p> : null}
        </div>
        <Link
          href={viewAllHref}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline"
        >
          See all
          <ArrowRight size={15} aria-hidden />
        </Link>
      </div>

      <div
        className={
          columns === 3
            ? 'grid grid-cols-2 gap-4 md:grid-cols-3'
            : 'grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4'
        }
      >
        {products.slice(0, columns === 3 ? 6 : 8).map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
