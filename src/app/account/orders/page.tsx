import type { Metadata } from 'next';
import { PackageSearch } from 'lucide-react';
import { ComingSoon } from '@/components/ui/ComingSoon';

export const metadata: Metadata = { title: 'Your orders' };

export default function OrdersPage() {
  return (
    <ComingSoon
      icon={<PackageSearch size={26} />}
      title="Order tracking is being built"
      body="Once accounts and checkout are live, every order you place will show here with its live status."
      stage="Stage 4"
    />
  );
}
