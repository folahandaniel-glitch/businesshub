import type { Metadata } from 'next';
import { Heart } from 'lucide-react';
import { ComingSoon } from '@/components/ui/ComingSoon';

export const metadata: Metadata = { title: 'Your wishlist' };

export default function WishlistPage() {
  return (
    <ComingSoon
      icon={<Heart size={26} />}
      title="Wishlist is being built"
      body="Saving products to a wishlist needs an account first. Both are coming in the next stage."
      stage="Stage 4"
    />
  );
}
