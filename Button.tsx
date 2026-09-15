import Link from 'next/link';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'accent' | 'outline' | 'ghost' | 'dark';
type Size = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 font-semibold tracking-tight ' +
  'transition-colors duration-150 ease-swift disabled:cursor-not-allowed disabled:opacity-55 ' +
  'rounded-card whitespace-nowrap';

const variants: Record<Variant, string> = {
  primary: 'bg-brand text-white hover:bg-brand-soft',
  accent: 'bg-scarlet text-white hover:bg-scarlet-soft',
  outline: 'border-2 border-brand text-brand bg-white hover:bg-brand-tint',
  ghost: 'text-ink hover:bg-brand-tint',
  dark: 'bg-ink text-white hover:bg-brand'
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-sm',
  md: 'h-11 px-5 text-[0.9375rem]',
  lg: 'h-12 px-7 text-base'
};

type Common = { variant?: Variant; size?: Size; className?: string; children: React.ReactNode };

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: Common & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  variant = 'primary',
  size = 'md',
  className,
  children
}: Common & { href: string }) {
  return (
    <Link href={href} className={cn(base, variants[variant], sizes[size], className)}>
      {children}
    </Link>
  );
}
