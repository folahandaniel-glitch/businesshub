'use client';

import Link from 'next/link';
import { useState } from 'react';
import { SlidersHorizontal, History } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { ProductThumb } from '@/components/ui/ProductThumb';
import { formatDate } from '@/lib/utils';
import { AdjustStockModal } from './AdjustStockModal';
import type { InventoryRow } from '@/lib/admin-inventory';

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

export function InventoryTable({ items }: { items: InventoryRow[] }) {
  const [adjusting, setAdjusting] = useState<InventoryRow | null>(null);

  if (items.length === 0) {
    return <p className="rounded-card border border-dashed border-line bg-white py-16 text-center text-sm text-slate">No products match this view.</p>;
  }

  return (
    <>
      <div className="overflow-hidden rounded-card border border-line bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-mist text-xs uppercase tracking-wide text-slate">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Threshold</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Last restocked</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.productId} className="border-b border-line last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-card border border-line bg-white">
                      <ProductThumb src={item.imageUrl} alt={item.name} sizes="44px" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-ink">{item.name}</p>
                      <p className="text-xs text-slate">{item.sku} &middot; {item.brand}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 font-semibold text-ink">{item.stockQuantity}</td>
                <td className="px-4 py-3 text-slate-deep">{item.minStockLevel}</td>
                <td className="px-4 py-3">
                  <Badge tone={STOCK_TONE[item.stockStatus] ?? 'neutral'}>{STOCK_LABEL[item.stockStatus] ?? item.stockStatus}</Badge>
                </td>
                <td className="px-4 py-3 text-slate-deep">{item.lastRestockedAt ? formatDate(item.lastRestockedAt) : 'Never'}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setAdjusting(item)}
                      className="grid h-8 w-8 place-items-center rounded-card border border-line text-slate hover:border-brand hover:text-brand"
                      aria-label={`Adjust stock for ${item.name}`}
                    >
                      <SlidersHorizontal size={14} />
                    </button>
                    <Link
                      href={`/admin/inventory/${item.productId}`}
                      className="grid h-8 w-8 place-items-center rounded-card border border-line text-slate hover:border-brand hover:text-brand"
                      aria-label={`View history for ${item.name}`}
                    >
                      <History size={14} />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {adjusting ? (
        <AdjustStockModal
          productId={adjusting.productId}
          productName={adjusting.name}
          currentStock={adjusting.stockQuantity}
          onClose={() => setAdjusting(null)}
        />
      ) : null}
    </>
  );
}
