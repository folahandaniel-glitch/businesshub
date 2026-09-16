import type { Metadata } from 'next';
import { ShoppingCart } from 'lucide-react';
import { ComingSoon } from '@/components/ui/ComingSoon';

export const metadata: Metadata = { title: 'Your cart' };

export default function CartPage() {
  return (
    <ComingSoon
      icon={<ShoppingCart size={26} />}
      title="Cart is being built"
      body="A saved cart with real checkout, delivery pricing and payment is coming in the next stage. Browse the shop and note down anything you want, no items will be lost between now and then."
      stage="Stage 4"
    />
  );
}
