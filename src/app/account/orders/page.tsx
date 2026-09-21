import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { PackageSearch } from 'lucide-react';
import { getCurrentCustomer, getCustomerOrders } from '@/lib/orders';
import { StatusBadge } from '@/components/orders/StatusBadge';
import { ButtonLink } from '@/components/ui/Button';
import { formatDate, formatNaira } from '@/lib/utils';

export const metadata: Metadata = { title: 'Your orders' };
export const dynamic = 'force-dynamic';

export default async function OrdersPage() {
  const customer = await getCurrentCustomer();
  if (!customer) redirect('/login?next=/account/orders');

  const orders = await getCustomerOrders();

  return (
    <div className="shell py-8 md:py-10">
      <h1 className="rule-heading text-2xl md:text-3xl">Your orders</h1>

      {orders.length === 0 ? (
        <div className="mt-8 flex flex-col items-center gap-3 rounded-card border border-dashed border-line bg-white py-16 text-center">
          <PackageSearch size={36} className="text-brand-line" strokeWidth={1.25} aria-hidden />
          <p className="font-semibold text-ink">No orders yet</p>
          <p className="max-w-xs text-sm text-slate">Orders you place will show up here with their live status.</p>
          <ButtonLink href="/shop" className="mt-2">
            Start shopping
          </ButtonLink>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-card border border-line bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-mist text-xs uppercase tracking-wide text-slate">
              <tr>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-line last:border-0 hover:bg-mist">
                  <td className="px-4 py-3.5">
                    <Link href={`/account/orders/${o.orderNumber}`} className="font-semibold text-brand hover:underline">
                      {o.orderNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3.5 text-slate-deep">{formatDate(o.createdAt)}</td>
                  <td className="px-4 py-3.5 text-slate-deep">{o.itemCount}</td>
                  <td className="px-4 py-3.5 font-semibold text-ink">{formatNaira(o.grandTotal)}</td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={o.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
