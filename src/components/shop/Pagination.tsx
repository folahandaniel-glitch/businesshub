'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Pagination({ page, totalPages }: { page: number; totalPages: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  function goTo(target: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (target <= 1) params.delete('page');
    else params.set('page', String(target));
    router.push(`${pathname}?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  );

  return (
    <nav className="mt-10 flex items-center justify-center gap-1.5" aria-label="Pagination">
      <button
        type="button"
        onClick={() => goTo(page - 1)}
        disabled={page <= 1}
        className="grid h-9 w-9 place-items-center rounded-card border border-line text-ink transition-colors hover:bg-brand-tint disabled:opacity-40"
        aria-label="Previous page"
      >
        <ChevronLeft size={17} />
      </button>

      {pages.map((p, i) => (
        <span key={p} className="flex items-center gap-1.5">
          {i > 0 && p - pages[i - 1] > 1 ? <span className="px-1 text-slate">...</span> : null}
          <button
            type="button"
            onClick={() => goTo(p)}
            className={cn(
              'h-9 min-w-[2.25rem] rounded-card border px-2.5 text-sm font-semibold transition-colors',
              p === page ? 'border-brand bg-brand text-white' : 'border-line text-ink hover:bg-brand-tint'
            )}
            aria-current={p === page ? 'page' : undefined}
          >
            {p}
          </button>
        </span>
      ))}

      <button
        type="button"
        onClick={() => goTo(page + 1)}
        disabled={page >= totalPages}
        className="grid h-9 w-9 place-items-center rounded-card border border-line text-ink transition-colors hover:bg-brand-tint disabled:opacity-40"
        aria-label="Next page"
      >
        <ChevronRight size={17} />
      </button>
    </nav>
  );
}
