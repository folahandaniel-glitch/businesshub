import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getOrderByNumber } from '@/lib/orders';
import { OrderDetailView } from '@/components/orders/OrderDetailView';

export const metadata: Metadata = { title: 'Order confirmed', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function OrderConfirmationPage({ params }: { params: { orderNumber: string } }) {
  const order = await getOrderByNumber(params.orderNumber);
  if (!order) notFound();

  return (
    <div className="shell py-8 md:py-10">
      <OrderDetailView order={order} confirmation />
    </div>
  );
}
