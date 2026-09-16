import Link from 'next/link';
import type { Metadata } from 'next';
import { Cpu } from 'lucide-react';
import { getAllCategories } from '@/lib/shop-queries';

export const metadata: Metadata = {
  title: 'Shop by category',
  description: 'Every product category carried by BUSINESS-HUB COMPUTERS, from laptops to networking equipment.'
};

export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
  const categories = await getAllCategories();

  return (
    <div className="shell py-8 md:py-10">
      <h1 className="rule-heading text-2xl md:text-3xl">Shop by category</h1>
      <p className="mt-3 max-w-xl text-sm text-slate">
        Browse the full catalogue by category, or open a subcategory for a narrower list.
      </p>

      {categories.length === 0 ? (
        <div className="mt-8 rounded-card border border-dashed border-line bg-white p-8 text-center">
          <Cpu size={32} className="mx-auto text-brand-line" strokeWidth={1.25} aria-hidden />
          <p className="mt-3 font-semibold text-ink">No categories yet</p>
          <p className="mt-1 text-sm text-slate">Run the seed script, or add categories from the admin backend.</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <div key={c.id} className="rounded-card border border-line bg-white p-5">
              <Link href={`/categories/${c.slug}`} className="flex items-center justify-between gap-2">
                <h2 className="text-base font-bold text-ink hover:text-brand">{c.name}</h2>
                <span className="whitespace-nowrap text-xs font-semibold text-slate">
                  {c.productCount} {c.productCount === 1 ? 'item' : 'items'}
                </span>
              </Link>
              {c.description ? <p className="mt-2 text-sm text-slate">{c.description}</p> : null}

              {c.children.length > 0 ? (
                <ul className="mt-4 flex flex-wrap gap-2">
                  {c.children.map((child) => (
                    <li key={child.id}>
                      <Link
                        href={`/categories/${child.slug}`}
                        className="inline-flex items-center rounded-pill border border-line px-2.5 py-1 text-xs font-medium text-slate-deep transition-colors hover:border-brand hover:text-brand"
                      >
                        {child.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
