'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AddToCartButton({
  productId,
  soldOut,
  className,
  fullWidth = false
}: {
  productId: string;
  soldOut: boolean;
  className?: string;
  fullWidth?: boolean;
}) {
  const router = useRouter();
  const [state, setState] = useState<'idle' | 'loading' | 'added' | 'error'>('idle');

  async function onClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (soldOut || state === 'loading') return;

    setState('loading');
    try {
      const res = await fetch('/api/cart/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: 1 })
      });
      if (!res.ok) throw new Error();
      setState('added');
      router.refresh();
      window.setTimeout(() => setState('idle'), 1800);
    } catch {
      setState('error');
      window.setTimeout(() => setState('idle'), 2000);
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={soldOut || state === 'loading'}
      aria-label="Add to cart"
      className={cn(
        'relative z-10 inline-flex h-9 items-center justify-center gap-1.5 rounded-card bg-brand px-3 text-sm font-semibold text-white transition-colors hover:bg-brand-soft disabled:bg-line disabled:text-slate',
        fullWidth && 'w-full',
        className
      )}
    >
      {state === 'added' ? (
        <>
          <Check size={15} aria-hidden /> Added
        </>
      ) : state === 'error' ? (
        'Try again'
      ) : (
        <>
          <ShoppingCart size={15} aria-hidden /> {state === 'loading' ? 'Adding' : 'Add'}
        </>
      )}
    </button>
  );
}
