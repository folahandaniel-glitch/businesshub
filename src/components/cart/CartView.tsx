'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trash2, ShoppingBag, Minus, Plus } from 'lucide-react';
import { ProductThumb } from '@/components/ui/ProductThumb';
import { Button, ButtonLink } from '@/components/ui/Button';
import { formatNaira } from '@/lib/utils';
import type { CartSummary } from '@/lib/cart';

export function CartView({ initialCart }: { initialCart: CartSummary }) {
  const router = useRouter();
  const [cart, setCart] = useState(initialCart);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    setCart(initialCart);
  }, [initialCart]);

  async function updateQuantity(itemId: string, quantity: number) {
    setBusyId(itemId);
    try {
      const res = await fetch(`/api/cart/items/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity })
      });
      if (res.ok) {
        setCart(await res.json());
        router.refresh();
      }
    } finally {
      setBusyId(null);
    }
  }

  async function removeItem(itemId: string) {
    setBusyId(itemId);
    try {
      const res = await fetch(`/api/cart/items/${itemId}`, { method: 'DELETE' });
      if (res.ok) {
        setCart(await res.json());
        router.refresh();
      }
    } finally {
      setBusyId(null);
    }
  }

  if (cart.lines.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-card border border-dashed border-line bg-white py-16 text-center">
        <ShoppingBag size={36} className="text-brand-line" strokeWidth={1.25} aria-hidden />
        <p className="font-semibold text-ink">Your cart is empty</p>
        <p className="max-w-xs text-sm text-slate">Add products from the shop and they will appear here.</p>
        <ButtonLink href="/shop" className="mt-2">
          Continue shopping
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
      <ul className="space-y-4">
        {cart.lines.map((line) => (
          <li key={line.id} className="flex gap-4 rounded-card border border-line bg-white p-4">
            <Link href={`/product/${line.slug}`} className="relative h-20 w-20 shrink-0 overflow-hidden rounded-card border border-line">
              <ProductThumb src={line.imageUrl} alt={line.name} sizes="80px" />
            </Link>

            <div className="flex flex-1 flex-col">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-brand">{line.brand}</p>
                  <Link href={`/product/${line.slug}`} className="text-sm font-semibold text-ink hover:text-brand">
                    {line.name}
                  </Link>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(line.id)}
                  disabled={busyId === line.id}
                  aria-label={`Remove ${line.name} from cart`}
                  className="shrink-0 p-1 text-slate hover:text-scarlet"
                >
                  <Trash2 size={17} />
                </button>
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center rounded-card border border-line">
                  <button
                    type="button"
                    onClick={() => updateQuantity(line.id, line.quantity - 1)}
                    disabled={busyId === line.id}
                    className="grid h-8 w-8 place-items-center text-ink hover:bg-mist"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-9 text-center text-sm font-semibold" aria-live="polite">
                    {line.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(line.id, line.quantity + 1)}
                    disabled={busyId === line.id || line.maxReached}
                    className="grid h-8 w-8 place-items-center text-ink hover:bg-mist disabled:text-line"
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <p className="font-display font-bold text-ink">{formatNaira(line.lineTotal)}</p>
              </div>
              {line.maxReached ? <p className="mt-1.5 text-xs text-scarlet">Maximum available stock reached.</p> : null}
            </div>
          </li>
        ))}
      </ul>

      <div className="h-fit rounded-card border border-line bg-white p-6">
        <h2 className="text-base font-bold text-ink">Order summary</h2>
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between text-slate-deep">
            <span>Subtotal ({cart.itemCount} {cart.itemCount === 1 ? 'item' : 'items'})</span>
            <span className="font-semibold text-ink">{formatNaira(cart.subtotal)}</span>
          </div>
          <p className="text-xs text-slate">Delivery fee is calculated at checkout based on your state.</p>
        </div>
        <Button size="lg" className="mt-5 w-full" onClick={() => router.push('/checkout')}>
          Proceed to checkout
        </Button>
      </div>
    </div>
  );
}
