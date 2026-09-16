'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { formatNaira } from '@/lib/utils';

export type FilterData = {
  brands: string[];
  priceBounds: { min: number; max: number } | null;
};

/**
 * Reads and writes filter state straight to the URL query string, so a
 * filtered view is always a shareable link and survives a page refresh.
 */
export function FilterSidebar({ data }: { data: FilterData }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeBrands = searchParams.getAll('brand');
  const condition = searchParams.get('condition') ?? '';
  const minPrice = searchParams.get('min') ?? '';
  const maxPrice = searchParams.get('max') ?? '';
  const onSale = searchParams.get('sale') === '1';

  function apply(mutate: (params: URLSearchParams) => void) {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
  }

  function toggleBrand(brand: string) {
    apply((params) => {
      const current = params.getAll('brand');
      params.delete('brand');
      const next = current.includes(brand) ? current.filter((b) => b !== brand) : [...current, brand];
      next.forEach((b) => params.append('brand', b));
    });
  }

  function setCondition(value: string) {
    apply((params) => {
      if (value) params.set('condition', value);
      else params.delete('condition');
    });
  }

  function setPrice(field: 'min' | 'max', value: string) {
    apply((params) => {
      if (value) params.set(field, value);
      else params.delete(field);
    });
  }

  function toggleSale() {
    apply((params) => {
      if (onSale) params.delete('sale');
      else params.set('sale', '1');
    });
  }

  function clearAll() {
    router.push(pathname);
  }

  const hasActiveFilters = activeBrands.length > 0 || condition || minPrice || maxPrice || onSale;

  const body = (
    <div className="space-y-6">
      {hasActiveFilters ? (
        <button type="button" onClick={clearAll} className="text-sm font-semibold text-scarlet hover:underline">
          Clear all filters
        </button>
      ) : null}

      <div>
        <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-slate-deep">
          <input
            type="checkbox"
            checked={onSale}
            onChange={toggleSale}
            className="h-4 w-4 rounded border-line text-brand focus:ring-brand"
          />
          On sale only
        </label>
      </div>

      {data.priceBounds ? (
        <div>
          <h3 className="mb-3 text-sm font-bold text-ink">Price range</h3>
          <div className="flex items-center gap-2">
            <input
              type="number"
              inputMode="numeric"
              placeholder={String(data.priceBounds.min)}
              defaultValue={minPrice}
              onBlur={(e) => setPrice('min', e.target.value)}
              className="h-9 w-full rounded-card border border-line px-2.5 text-sm focus:border-brand"
              aria-label="Minimum price"
            />
            <span className="text-slate">to</span>
            <input
              type="number"
              inputMode="numeric"
              placeholder={String(data.priceBounds.max)}
              defaultValue={maxPrice}
              onBlur={(e) => setPrice('max', e.target.value)}
              className="h-9 w-full rounded-card border border-line px-2.5 text-sm focus:border-brand"
              aria-label="Maximum price"
            />
          </div>
          <p className="mt-1.5 text-xs text-slate">
            {formatNaira(data.priceBounds.min)} to {formatNaira(data.priceBounds.max)} available
          </p>
        </div>
      ) : null}

      <div>
        <h3 className="mb-3 text-sm font-bold text-ink">Condition</h3>
        <div className="space-y-2">
          {[
            { value: '', label: 'All conditions' },
            { value: 'NEW', label: 'New' },
            { value: 'REFURBISHED', label: 'Refurbished' },
            { value: 'UK_USED', label: 'UK used' }
          ].map((opt) => (
            <label key={opt.value} className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-deep">
              <input
                type="radio"
                name="condition"
                checked={condition === opt.value}
                onChange={() => setCondition(opt.value)}
                className="h-4 w-4 border-line text-brand focus:ring-brand"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      {data.brands.length > 0 ? (
        <div>
          <h3 className="mb-3 text-sm font-bold text-ink">Brand</h3>
          <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
            {data.brands.map((brand) => (
              <label key={brand} className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-deep">
                <input
                  type="checkbox"
                  checked={activeBrands.includes(brand)}
                  onChange={() => toggleBrand(brand)}
                  className="h-4 w-4 rounded border-line text-brand focus:ring-brand"
                />
                {brand}
              </label>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="mb-4 inline-flex items-center gap-2 rounded-card border border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink lg:hidden"
      >
        <SlidersHorizontal size={16} aria-hidden />
        Filters
        {hasActiveFilters ? <span className="h-2 w-2 rounded-pill bg-scarlet" aria-hidden /> : null}
      </button>

      <aside className="hidden w-64 shrink-0 lg:block">
        <h2 className="rule-heading mb-5 text-lg">Filters</h2>
        {body}
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink/50" onClick={() => setMobileOpen(false)} aria-hidden />
          <div className="absolute inset-y-0 left-0 w-[20rem] max-w-[88%] overflow-y-auto bg-white p-5">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-ink">Filters</h2>
              <button type="button" onClick={() => setMobileOpen(false)} aria-label="Close filters" className="p-1 text-ink">
                <X size={22} />
              </button>
            </div>
            {body}
          </div>
        </div>
      ) : null}
    </>
  );
}
