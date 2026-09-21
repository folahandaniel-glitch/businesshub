'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

export function WishlistButton({
  productId,
  initiallySaved = false,
  className,
  showLabel = false
}: {
  productId: string;
  initiallySaved?: boolean;
  className?: string;
  showLabel?: boolean;
}) {
  const router = useRouter();
  const [saved, setSaved] = useState(initiallySaved);
  const [loading, setLoading] = useState(false);

  async function onClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (loading) return;

    setLoading(true);
    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      });
      if (res.status === 401) {
        router.push('/login?next=/wishlist');
        return;
      }
      if (!res.ok) throw new Error();
      const data = await res.json();
      setSaved(data.inWishlist);
      router.refresh();
    } catch {
      // Leave the heart in its previous state rather than guessing at success.
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
      aria-pressed={saved}
      className={cn(
        showLabel
          ? 'flex h-11 flex-1 items-center justify-center gap-2 rounded-card border text-sm font-semibold'
          : 'grid h-9 w-9 place-items-center rounded-pill border',
        saved ? 'border-scarlet text-scarlet' : 'border-line text-slate hover:border-scarlet hover:text-scarlet',
        className
      )}
    >
      <Heart size={showLabel ? 16 : 17} fill={saved ? 'currentColor' : 'none'} aria-hidden />
      {showLabel ? (saved ? 'Saved' : 'Wishlist') : null}
    </button>
  );
}
