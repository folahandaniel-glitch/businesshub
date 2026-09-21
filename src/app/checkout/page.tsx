import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';
import { getCart } from '@/lib/cart';
import { getCurrentCustomer } from '@/lib/orders';

export const metadata: Metadata = { title: 'Checkout' };
export const dynamic = 'force-dynamic';

export default async function CheckoutPage() {
  const cart = await getCart();
  if (cart.lines.length === 0) redirect('/cart');

  const customer = await getCurrentCustomer();

  return (
    <div className="shell py-8 md:py-10">
      <h1 className="rule-heading text-2xl md:text-3xl">Checkout</h1>
      <div className="mt-6">
        <CheckoutForm cart={cart} customer={customer ? { fullName: customer.fullName, email: customer.email, phone: customer.phone } : null} />
      </div>
    </div>
  );
}
