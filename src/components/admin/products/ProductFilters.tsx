'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Search } from 'lucide-react';
import type { CategoryOption } from '@/lib/admin-categories';

export function ProductFilters({ categoryOptions }: { categoryOptions: CategoryOption[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="mb-5 flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-[16rem]">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate" aria-hidden />
        <input
          defaultValue={searchParams.get('q') ?? ''}
          onKeyDown={(e) => {
            if (e.key === 'Enter') setParam('q', (e.target as HTMLInputElement).value);
          }}
          onBlur={(e) => setParam('q', e.target.value)}
          placeholder="Search by name, SKU or brand"
          className="h-10 w-full rounded-card border border-line pl-9 pr-3 text-sm focus:border-brand"
        />
      </div>

      <select
        defaultValue={searchParams.get('category') ?? ''}
        onChange={(e) => setParam('category', e.target.value)}
        className="h-10 rounded-card border border-line px-3 text-sm focus:border-brand"
      >
        <option value="">All categories</option>
        {categoryOptions.map((o) => (
          <option key={o.id} value={o.id}>
            {o.label}
          </option>
        ))}
      </select>

      <select
        defaultValue={searchParams.get('status') ?? ''}
        onChange={(e) => setParam('status', e.target.value)}
        className="h-10 rounded-card border border-line px-3 text-sm focus:border-brand"
      >
        <option value="">All statuses</option>
        <option value="PUBLISHED">Published</option>
        <option value="DRAFT">Draft</option>
        <option value="ARCHIVED">Archived</option>
      </select>
    </div>
  );
}
