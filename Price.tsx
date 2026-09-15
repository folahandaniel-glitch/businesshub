import { cn, formatNaira, discountPercent } from '@/lib/utils';

export function Price({
  price,
  previousPrice,
  size = 'md',
  className
}: {
  price: number;
  previousPrice?: number | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const off = discountPercent(price, previousPrice);
  const sizing = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-3xl'
  }[size];

  return (
    <div className={cn('flex flex-wrap items-baseline gap-x-2 gap-y-1', className)}>
      <span className={cn('font-display font-bold text-ink', sizing)}>{formatNaira(price)}</span>
      {off > 0 && previousPrice ? (
        <>
          <span className="text-sm text-slate line-through">{formatNaira(previousPrice)}</span>
          <span className="text-sm font-semibold text-scarlet">{off}% off</span>
        </>
      ) : null}
    </div>
  );
}
