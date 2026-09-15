import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge Tailwind classes without specificity clashes. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Naira formatting used across the storefront and admin backend. */
export function formatNaira(value: number | string, showKobo = false) {
  const amount = typeof value === 'string' ? Number(value) : value;
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: showKobo ? 2 : 0,
    maximumFractionDigits: showKobo ? 2 : 0
  }).format(Number.isFinite(amount) ? amount : 0);
}

/** Discount percentage from previous price down to current price. */
export function discountPercent(price: number, previousPrice?: number | null) {
  if (!previousPrice || previousPrice <= price) return 0;
  return Math.round(((previousPrice - price) / previousPrice) * 100);
}

/** URL-safe slug from any product or category name. */
export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/** Stock label derived from quantity and the product minimum threshold. */
export function stockLabel(quantity: number, minStockLevel = 5) {
  if (quantity <= 0) return { text: 'Out of stock', tone: 'danger' as const };
  if (quantity <= minStockLevel) return { text: 'Low stock', tone: 'warning' as const };
  return { text: 'In stock', tone: 'success' as const };
}

/** Human-friendly date for orders, tasks and audit records. */
export function formatDate(date: Date | string, withTime = false) {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-NG', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {})
  }).format(d);
}

/** Sequential-looking order reference, safe to show customers. */
export function generateOrderNumber() {
  const stamp = Date.now().toString(36).toUpperCase();
  const noise = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `BHC-${stamp}${noise}`;
}
