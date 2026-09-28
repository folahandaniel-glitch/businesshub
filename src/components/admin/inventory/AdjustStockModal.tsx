'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const REASONS = [
  { value: 'STOCK_IN', label: 'Stock in (new delivery)', hint: 'Adds to stock and to total received' },
  { value: 'DAMAGE', label: 'Damage or loss', hint: 'Removes from stock' },
  { value: 'ADJUSTMENT', label: 'Manual adjustment', hint: 'Corrects a miscount - can be positive or negative' }
] as const;

export function AdjustStockModal({
  productId,
  productName,
  currentStock,
  onClose
}: {
  productId: string;
  productName: string;
  currentStock: number;
  onClose: () => void;
}) {
  const router = useRouter();
  const [action, setAction] = useState<(typeof REASONS)[number]['value']>('STOCK_IN');
  const [quantity, setQuantity] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/admin/inventory/${productId}/adjust`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, quantity: Number(quantity), note: note || undefined })
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? 'Could not adjust stock.');

      router.refresh();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not adjust stock.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink/50" onClick={onClose} aria-hidden />
      <form onSubmit={onSubmit} className="relative w-full max-w-sm rounded-card border border-line bg-white p-6 shadow-lift">
        <div className="mb-1 flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink">Adjust stock</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="p-1 text-slate hover:text-ink">
            <X size={20} />
          </button>
        </div>
        <p className="mb-4 text-sm text-slate">
          {productName} &middot; currently {currentStock} in stock
        </p>

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-ink">Reason</label>
            <div className="space-y-2">
              {REASONS.map((r) => (
                <label key={r.value} className="flex cursor-pointer items-start gap-2.5 rounded-card border border-line p-2.5 has-[:checked]:border-brand has-[:checked]:bg-brand-tint">
                  <input
                    type="radio"
                    name="reason"
                    checked={action === r.value}
                    onChange={() => setAction(r.value)}
                    className="mt-0.5 h-4 w-4 text-brand"
                  />
                  <span>
                    <span className="block text-sm font-semibold text-ink">{r.label}</span>
                    <span className="block text-xs text-slate">{r.hint}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="adjust-qty" className="mb-1.5 block text-sm font-semibold text-ink">
              Quantity
            </label>
            <input
              id="adjust-qty"
              type="number"
              required
              step="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder={action === 'ADJUSTMENT' ? 'e.g. -2 or 5' : 'e.g. 10'}
              className="h-11 w-full rounded-card border border-line px-3.5 text-[0.9375rem] focus:border-brand"
            />
          </div>

          <div>
            <label htmlFor="adjust-note" className="mb-1.5 block text-sm font-semibold text-ink">
              Note (optional)
            </label>
            <input
              id="adjust-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="h-11 w-full rounded-card border border-line px-3.5 text-[0.9375rem] focus:border-brand"
            />
          </div>
        </div>

        {error ? (
          <p className="mt-4 text-sm font-medium text-scarlet" role="alert">
            {error}
          </p>
        ) : null}

        <div className="mt-6 flex justify-end gap-2.5">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving' : 'Apply adjustment'}
          </Button>
        </div>
      </form>
    </div>
  );
}
