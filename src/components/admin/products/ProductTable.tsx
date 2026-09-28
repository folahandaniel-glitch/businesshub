'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, Archive, RotateCcw, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { ProductThumb } from '@/components/ui/ProductThumb';
import { formatNaira } from '@/lib/utils';
import type { AdminProductRow } from '@/lib/admin-products';

const STATUS_TONE: Record<string, 'brand' | 'success' | 'neutral'> = {
  DRAFT: 'neutral',
  PUBLISHED: 'success',
  ARCHIVED: 'neutral'
};

const STOCK_TONE: Record<string, 'success' | 'warning' | 'danger'> = {
  IN_STOCK: 'success',
  LOW_STOCK: 'warning',
  OUT_OF_STOCK: 'danger'
};

const STOCK_LABEL: Record<string, string> = {
  IN_STOCK: 'In stock',
  LOW_STOCK: 'Low stock',
  OUT_OF_STOCK: 'Out of stock'
};

export function ProductTable({ products }: { products: AdminProductRow[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<Record<string, string>>({});

  async function onArchive(id: string) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/products/${id}/archive`, { method: 'POST' });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error);
      router.refresh();
    } catch (err) {
      setError((prev) => ({ ...prev, [id]: err instanceof Error ? err.message : 'Could not archive.' }));
    } finally {
      setBusyId(null);
    }
  }

  async function onRestore(id: string) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/products/${id}/restore`, { method: 'POST' });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error);
      router.refresh();
    } catch (err) {
      setError((prev) => ({ ...prev, [id]: err instanceof Error ? err.message : 'Could not restore.' }));
    } finally {
      setBusyId(null);
    }
  }

  async function onDelete(id: string, name: string) {
    if (!window.confirm(`Permanently delete "${name}"? This cannot be undone.`)) return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error);
      router.refresh();
    } catch (err) {
      setError((prev) => ({ ...prev, [id]: err instanceof Error ? err.message : 'Could not delete.' }));
    } finally {
      setBusyId(null);
    }
  }

  if (products.length === 0) {
    return <p className="rounded-card border border-dashed border-line bg-white py-16 text-center text-sm text-slate">No products match this view.</p>;
  }

  return (
    <div className="overflow-hidden rounded-card border border-line bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-line bg-mist text-xs uppercase tracking-wide text-slate">
          <tr>
            <th className="px-4 py-3">Product</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">Stock</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-b border-line last:border-0">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-card border border-line bg-white">
                    <ProductThumb src={p.imageUrl} alt={p.name} sizes="44px" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-ink">{p.name}</p>
                    <p className="text-xs text-slate">{p.sku} &middot; {p.brand}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-slate-deep">{p.categoryName}</td>
              <td className="px-4 py-3">
                <p className="font-semibold text-ink">{formatNaira(p.price)}</p>
                {p.previousPrice ? <p className="text-xs text-slate line-through">{formatNaira(p.previousPrice)}</p> : null}
              </td>
              <td className="px-4 py-3">
                <Badge tone={STOCK_TONE[p.stockStatus] ?? 'neutral'}>{STOCK_LABEL[p.stockStatus] ?? p.stockStatus}</Badge>
                <p className="mt-1 text-xs text-slate">{p.stockQuantity} units</p>
              </td>
              <td className="px-4 py-3">
                <Badge tone={STATUS_TONE[p.status] ?? 'neutral'}>{p.status}</Badge>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <Link
                    href={`/admin/products/${p.id}/edit`}
                    className="grid h-8 w-8 place-items-center rounded-card border border-line text-slate hover:border-brand hover:text-brand"
                    aria-label={`Edit ${p.name}`}
                  >
                    <Pencil size={14} />
                  </Link>
                  {p.status === 'ARCHIVED' ? (
                    <button
                      type="button"
                      onClick={() => onRestore(p.id)}
                      disabled={busyId === p.id}
                      className="grid h-8 w-8 place-items-center rounded-card border border-line text-slate hover:border-success hover:text-success"
                      aria-label={`Restore ${p.name}`}
                    >
                      <RotateCcw size={14} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onArchive(p.id)}
                      disabled={busyId === p.id}
                      className="grid h-8 w-8 place-items-center rounded-card border border-line text-slate hover:border-warning hover:text-warning"
                      aria-label={`Archive ${p.name}`}
                    >
                      <Archive size={14} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onDelete(p.id, p.name)}
                    disabled={busyId === p.id}
                    className="grid h-8 w-8 place-items-center rounded-card border border-line text-slate hover:border-scarlet hover:text-scarlet"
                    aria-label={`Delete ${p.name}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                {error[p.id] ? <p className="mt-1 text-xs text-scarlet">{error[p.id]}</p> : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
