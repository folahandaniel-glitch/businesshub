import { Badge } from '@/components/ui/Badge';

const STATUS_TONE: Record<string, 'brand' | 'success' | 'warning' | 'danger' | 'neutral'> = {
  PENDING: 'warning',
  CONFIRMED: 'brand',
  PROCESSING: 'brand',
  READY_FOR_DELIVERY: 'brand',
  SHIPPED: 'brand',
  DELIVERED: 'success',
  CANCELLED: 'danger',
  REFUNDED: 'neutral'
};

const STATUS_LABEL: Record<string, string> = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  PROCESSING: 'Processing',
  READY_FOR_DELIVERY: 'Ready for delivery',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
  REFUNDED: 'Refunded'
};

export function StatusBadge({ status }: { status: string }) {
  return <Badge tone={STATUS_TONE[status] ?? 'neutral'}>{STATUS_LABEL[status] ?? status}</Badge>;
}
