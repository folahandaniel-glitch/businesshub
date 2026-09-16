import { MessageSquareText } from 'lucide-react';
import { Rating } from '@/components/ui/Rating';
import { formatDate } from '@/lib/utils';
import type { ReviewData } from '@/lib/shop-queries';

export function ReviewList({ reviews, average, count }: { reviews: ReviewData[]; average: number; count: number }) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="font-display text-3xl font-bold text-ink">{average.toFixed(1)}</span>
        <div>
          <Rating value={average} size={16} />
          <p className="mt-0.5 text-xs text-slate">
            Based on {count} {count === 1 ? 'review' : 'reviews'}
          </p>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="mt-6 flex items-center gap-3 rounded-card border border-dashed border-line bg-white p-5 text-sm text-slate">
          <MessageSquareText size={20} className="shrink-0 text-brand-line" aria-hidden />
          No reviews have been published for this product yet.
        </div>
      ) : (
        <ul className="mt-6 space-y-5">
          {reviews.map((r) => (
            <li key={r.id} className="border-b border-line pb-5 last:border-0">
              <div className="flex items-center justify-between gap-3">
                <Rating value={r.rating} size={14} />
                <span className="text-xs text-slate">{formatDate(r.createdAt)}</span>
              </div>
              {r.title ? <p className="mt-2 text-sm font-bold text-ink">{r.title}</p> : null}
              <p className="mt-1 text-sm leading-relaxed text-slate-deep">{r.body}</p>
              <p className="mt-2 text-xs font-semibold text-slate">{r.authorName}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
