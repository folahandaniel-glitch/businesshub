'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';

const OPTIONS: { value: string; label: string }[] = [
  { value: 'relevance', label: 'Most relevant' },
  { value: 'newest', label: 'Newest first' },
  { value: 'price_asc', label: 'Price: low to high' },
  { value: 'price_desc', label: 'Price: high to low' },
  { value: 'popularity', label: 'Best selling' },
  { value: 'rating', label: 'Highest rated' },
  { value: 'discount', label: 'Biggest discount' }
];

export function SortBar({ total, label }: { total: number; label: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get('sort') ?? 'relevance';

  function onChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'relevance') params.delete('sort');
    else params.set('sort', value);
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
      <p className="text-sm text-slate">
        <span className="font-semibold text-ink">{total}</span> {label}
      </p>
      <label className="flex items-center gap-2 text-sm">
        <span className="text-slate">Sort by</span>
        <select
          value={current}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 rounded-card border border-line bg-white px-2.5 text-sm font-medium text-ink focus:border-brand"
        >
          {OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
