import type { Metadata } from 'next';
import { Heart } from 'lucide-react';
import { ButtonLink } from '@/components/ui/Button';
import { ProductGrid } from '@/components/shop/ProductGrid';
import { getWishlist } from '@/lib/wishlist';
import { getSession } from '@/lib/session';

export const metadata: Metadata = { title: 'Your wishlist' };
export const dynamic = 'force-dynamic';

export default async function WishlistPage() {
  const session = await getSession();

  if (!session) {
    return (
      <div className="shell py-16">
        <div className="mx-auto flex max-w-md flex-col items-center rounded-card border border-line bg-white p-10 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-card bg-brand-tint text-brand" aria-hidden>
            <Heart size={26} />
          </span>
          <h1 className="mt-5 text-xl font-bold text-ink">Sign in to see your wishlist</h1>
          <p className="mt-2.5 text-sm leading-relaxed text-slate">
            Saved products are tied to your account so they follow you across visits.
          </p>
          <ButtonLink href="/login?next=/wishlist" className="mt-6">
            Sign in
          </ButtonLink>
        </div>
      </div>
    );
  }

  const products = await getWishlist();

  return (
    <div className="shell py-8 md:py-10">
      <h1 className="rule-heading text-2xl md:text-3xl">Your wishlist</h1>
      <p className="mt-3 text-sm text-slate">
        {products.length} {products.length === 1 ? 'item saved' : 'items saved'}
      </p>
      <div className="mt-6">
        <ProductGrid
          products={products}
          emptyTitle="Your wishlist is empty"
          emptyBody="Tap the heart on any product to save it here for later."
          allSaved
        />
      </div>
    </div>
  );
}
