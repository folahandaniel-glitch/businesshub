import { cn } from '@/lib/utils';

export function StatCard({
  label,
  value,
  icon,
  tone = 'default'
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  tone?: 'default' | 'warning' | 'danger';
}) {
  const toneClass = {
    default: 'bg-brand-tint text-brand',
    warning: 'bg-amber-50 text-warning',
    danger: 'bg-scarlet-tint text-scarlet'
  }[tone];

  return (
    <div className="rounded-card border border-line bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate">{label}</p>
        <span className={cn('grid h-9 w-9 place-items-center rounded-card', toneClass)} aria-hidden>
          {icon}
        </span>
      </div>
      <p className="mt-3 font-display text-2xl font-bold text-ink">{value}</p>
    </div>
  );
}
