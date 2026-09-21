'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Zap, Share2, ShieldCheck, Truck, Check } from 'lucide-react';
import { Price } from '@/components/ui/Price';
import { StockPill } from '@/components/ui/StockPill';
import { Button } from '@/components/ui/Button';
import { WishlistButton } from '@/components/shop/WishlistButton';

export function PurchasePanel({
  productId,
  price,
  previousPrice,
  stockQuantity,
  minStockLevel,
  warrantyInfo,
  sku,
  initiallySaved = false
}: {
  productId: string;
  price: number;
  previousPrice: number | null;
  stockQuantity: number;
  minStockLevel: number;
  warrantyInfo: string | null;
  sku: string;
  initiallySaved?: boolean;
}) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState<'idle' | 'adding' | 'added' | 'buying' | 'error'>('idle');
  const [error, setError] = useState('');
  const soldOut = stockQuantity <= 0;

  async function addToCart(): Promise<boolean> {
    setStatus('adding');
    setError('');
    try {
      const res = await fetch('/api/cart/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity })
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? 'Could not add to cart.');
      }
      return true;
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Could not add to cart.');
      return false;
    }
  }

  async function onAddToCart() {
    const success = await addToCart();
    if (success) {
      setStatus('added');
      router.refresh();
      window.setTimeout(() => setStatus('idle'), 2000);
    }
  }

  async function onBuyNow() {
    setStatus('buying');
    const success = await addToCart();
    if (success) {
      router.push('/checkout');
    }
  }

  return (
    <div className="rounded-card border border-line bg-white p-6">
      <Price price={price} previousPrice={previousPrice} size="lg" />
      <p className="mt-1 text-xs text-slate">SKU: {sku}</p>

      <div className="mt-4">
        <StockPill quantity={stockQuantity} minStockLevel={minStockLevel} />
      </div>

      {!soldOut ? (
        <div className="mt-5 flex items-center gap-3">
          <span className="text-sm font-semibold text-ink">Quantity</span>
          <div className="flex items-center rounded-card border border-line">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="h-9 w-9 text-lg font-semibold text-ink hover:bg-mist"
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="w-10 text-center text-sm font-semibold" aria-live="polite">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(stockQuantity, q + 1))}
              className="h-9 w-9 text-lg font-semibold text-ink hover:bg-mist"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>
      ) : null}

      {status === 'error' ? (
        <p className="mt-3 text-sm font-medium text-scarlet" role="alert">
          {error}
        </p>
      ) : null}

      <div className="mt-5 flex flex-col gap-2.5">
        <Button
          variant="primary"
          size="lg"
          onClick={onAddToCart}
          disabled={soldOut || status === 'adding' || status === 'buying'}
          className="w-full"
        >
          {status === 'added' ? (
            <>
              <Check size={18} aria-hidden /> Added to cart
            </>
          ) : (
            <>
              <ShoppingCart size={18} aria-hidden />
              {soldOut ? 'Out of stock' : status === 'adding' ? 'Adding' : 'Add to cart'}
            </>
          )}
        </Button>
        <Button
          variant="accent"
          size="lg"
          onClick={onBuyNow}
          disabled={soldOut || status === 'adding' || status === 'buying'}
          className="w-full"
        >
          <Zap size={18} aria-hidden /> {status === 'buying' ? 'Preparing checkout' : 'Buy now'}
        </Button>
        <div className="flex gap-2.5">
          <WishlistButton productId={productId} initiallySaved={initiallySaved} showLabel className="flex-1" />
          <button
            type="button"
            onClick={() => {
              if (navigator.share) navigator.share({ title: document.title, url: window.location.href });
              else navigator.clipboard.writeText(window.location.href);
            }}
            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-card border border-line text-sm font-semibold text-ink hover:border-brand hover:text-brand"
          >
            <Share2 size={16} aria-hidden /> Share
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-3 border-t border-line pt-5 text-sm text-slate-deep">
        <p className="flex items-start gap-2.5">
          <ShieldCheck size={17} className="mt-0.5 shrink-0 text-brand" aria-hidden />
          {warrantyInfo ?? '12 months warranty on parts and labour'}
        </p>
        <p className="flex items-start gap-2.5">
          <Truck size={17} className="mt-0.5 shrink-0 text-brand" aria-hidden />
          Nationwide delivery, dispatched from our Nigerian warehouse
        </p>
      </div>
    </div>
  );
}
