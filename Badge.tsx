import { cn } from '@/lib/utils';

type Tone = 'brand' | 'sale' | 'success' | 'warning' | 'danger' | 'neutral';

const tones: Record<Tone, string> = {
  brand: 'bg-brand-tint text-brand border-brand-line',
  sale: 'bg-scarlet text-white border-scarlet',
  success: 'bg-emerald-50 text-success border-emerald-200',
  warning: 'bg-amber-50 text-warning border-amber-200',
  danger: 'bg-scarlet-tint text-scarlet border-red-200',
  neutral: 'bg-mist text-slate border-line'
};

export function Badge({
  tone = 'neutral',
  className,
  children
}: {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-pill border px-2.5 py-0.5 text-2xs font-semibold',
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
