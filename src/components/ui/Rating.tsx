import { Star } from 'lucide-react';

export function Rating({ value, count, size = 13 }: { value: number; count?: number; size?: number }) {
  const rounded = Math.round(value);
  return (
    <div className="flex items-center gap-1" aria-label={`Rated ${value.toFixed(1)} out of 5`}>
      <div className="flex" aria-hidden>
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={size}
            className={i <= rounded ? 'fill-amber-400 text-amber-400' : 'fill-line text-line'}
          />
        ))}
      </div>
      {typeof count === 'number' ? (
        <span className="text-xs text-slate">{count > 0 ? `(${count})` : 'No reviews yet'}</span>
      ) : null}
    </div>
  );
}
