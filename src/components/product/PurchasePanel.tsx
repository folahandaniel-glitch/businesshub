'use client';

import { useState } from 'react';
import { Heart, ShoppingCart, Zap, Share2, ShieldCheck, Truck, Check } from 'lucide-react';
import { Price } from '@/components/ui/Price';
import { StockPill } from '@/components/ui/StockPill';
import { Button } from '@/components/ui/Button';

export function PurchasePanel({
  productId,
  price,
  previousPrice,
  stockQuantity,
  minStockLevel,
  warrantyInfo,
  sku
}: {
  productId: string;
  price: number;
  previousPrice: number | null;
  stockQuantity: number;
  minStockLevel: number;
  warrantyInfo: string | null;
  sku: string;
}) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const soldOut = stockQuantity <= 0;

  function addToCart() {
    // Cart persistence lands in the next stage. This confirms the intended
    // action without pretending a real cart exists yet.
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
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

      <div className="mt-5 flex flex-col gap-2.5">
        <Button variant="primary" size="lg" onClick={addToCart} disabled={soldOut} className="w-full">
          {added ? (
            <>
              <Check size={18} aria-hidden /> Added to cart
            </>
          ) : (
            <>
              <ShoppingCart size={18} aria-hidden /> {soldOut ? 'Out of stock' : 'Add to cart'}
            </>
          )}
        </Button>
        <Button variant="accent" size="lg" disabled={soldOut} className="w-full">
          <Zap size={18} aria-hidden /> Buy now
        </Button>
        <div className="flex gap-2.5">
          <button
            type="button"
            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-card border border-line text-sm font-semibold text-ink hover:border-scarlet hover:text-scarlet"
          >
            <Heart size={16} aria-hidden /> Wishlist
          </button>
          <button
            type="button"
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
