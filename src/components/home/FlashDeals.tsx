'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Timer } from 'lucide-react';
import { ProductCard } from '@/components/shop/ProductCard';
import type { ProductCardData } from '@/lib/queries';

/**
 * Countdown runs to a supplied end time. The clock is the one moving
 * element on the page, which is deliberate: it is the only thing here
 * whose value is time-sensitive.
 */
function useCountdown(endsAt: number) {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setRemaining(Math.max(0, endsAt - Date.now()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [endsAt]);

  if (remaining === null) return null;
  const totalSeconds = Math.floor(remaining / 1000);
  return {
    hours: String(Math.floor(totalSeconds / 3600)).padStart(2, '0'),
    minutes: String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0'),
    seconds: String(totalSeconds % 60).padStart(2, '0'),
    expired: totalSeconds <= 0
  };
}

export function FlashDeals({ products, endsAt }: { products: ProductCardData[]; endsAt: number }) {
  const clock = useCountdown(endsAt);
  if (products.length === 0) return null;

  return (
    <section className="bg-scarlet-tint py-10 md:py-14">
      <div className="shell">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="flex items-center gap-2 font-display text-xl font-bold text-ink md:text-2xl">
              <Timer size={22} className="text-scarlet" aria-hidden />
              Deals ending soon
            </h2>
            <p className="mt-2 text-sm text-slate-deep">Reduced prices while current stock lasts.</p>
          </div>

          {clock ? (
            <div className="flex items-center gap-2" role="timer" aria-live="off">
              <span className="text-xs font-semibold text-slate-deep">
                {clock.expired ? 'Offer closed' : 'Ends in'}
              </span>
              {!clock.expired ? (
                <div className="flex items-center gap-1">
                  <TimeBlock value={clock.hours} unit="hrs" />
                  <span className="font-bold text-scarlet">:</span>
                  <TimeBlock value={clock.minutes} unit="min" />
                  <span className="font-bold text-scarlet">:</span>
                  <TimeBlock value={clock.seconds} unit="sec" />
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        <Link
          href="/deals"
          className="mt-6 inline-flex text-sm font-semibold text-scarlet hover:underline"
        >
          See every current deal
        </Link>
      </div>
    </section>
  );
}

function TimeBlock({ value, unit }: { value: string; unit: string }) {
  return (
    <span className="flex w-12 flex-col items-center rounded-card bg-ink py-1.5 text-white">
      <span className="font-display text-base font-bold tabular-nums">{value}</span>
      <span className="text-[0.625rem] text-white/60">{unit}</span>
    </span>
  );
}
