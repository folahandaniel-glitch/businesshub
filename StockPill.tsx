import { Badge } from './Badge';
import { stockLabel } from '@/lib/utils';

export function StockPill({ quantity, minStockLevel = 5 }: { quantity: number; minStockLevel?: number }) {
  const { text, tone } = stockLabel(quantity, minStockLevel);
  return <Badge tone={tone}>{text}</Badge>;
}
