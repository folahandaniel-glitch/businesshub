import type { Metadata } from 'next';
import { CartView } from '@/components/cart/CartView';
import { getCart } from '@/lib/cart';

export const metadata: Metadata = { title: 'Your cart' };
export const dynamic = 'force-dynamic';

export default async function CartPage() {
  const cart = await getCart();

  return (
    <div className="shell py-8 md:py-10">
      <h1 className="rule-heading text-2xl md:text-3xl">Your cart</h1>
      <div className="mt-6">
        <CartView initialCart={cart} />
      </div>
    </div>
  );
}
