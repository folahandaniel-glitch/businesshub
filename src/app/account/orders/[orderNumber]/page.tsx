import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getCurrentCustomer, getOrderByNumber } from '@/lib/orders';
import { OrderDetailView } from '@/components/orders/OrderDetailView';

export const metadata: Metadata = { title: 'Order details' };
export const dynamic = 'force-dynamic';

export default async function OrderDetailPage({ params }: { params: { orderNumber: string } }) {
  const customer = await getCurrentCustomer();
  if (!customer) redirect(`/login?next=/account/orders/${params.orderNumber}`);

  const order = await getOrderByNumber(params.orderNumber);
  if (!order) notFound();

  return (
    <div className="shell py-8 md:py-10">
      <OrderDetailView order={order} />
    </div>
  );
}
