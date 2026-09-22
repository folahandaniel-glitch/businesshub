import Link from 'next/link';
import { StatusBadge } from '@/components/orders/StatusBadge';
import { formatDate, formatNaira } from '@/lib/utils';
import type { DashboardData } from '@/lib/admin-dashboard';

export function RecentOrders({ orders }: { orders: DashboardData['recentOrders'] }) {
  return (
    <div className="rounded-card border border-line bg-white p-5">
      <h2 className="text-sm font-bold uppercase tracking-wide text-slate">Recent orders</h2>
      {orders.length === 0 ? (
        <p className="mt-4 text-sm text-slate">No orders placed yet.</p>
      ) : (
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <tbody>
              {orders.map((o) => (
                <tr key={o.orderNumber} className="border-b border-line last:border-0">
                  <td className="py-2.5 pr-3">
                    <Link href={`/admin/orders`} className="font-semibold text-brand hover:underline">
                      {o.orderNumber}
                    </Link>
                    <p className="text-xs text-slate">{o.customerLabel}</p>
                  </td>
                  <td className="py-2.5 pr-3 text-slate-deep">{formatDate(o.createdAt)}</td>
                  <td className="py-2.5 pr-3 font-semibold text-ink">{formatNaira(o.grandTotal)}</td>
                  <td className="py-2.5">
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

export function RecentCustomers({ customers }: { customers: DashboardData['recentCustomers'] }) {
  return (
    <div className="rounded-card border border-line bg-white p-5">
      <h2 className="text-sm font-bold uppercase tracking-wide text-slate">Recent customers</h2>
      {customers.length === 0 ? (
        <p className="mt-4 text-sm text-slate">No customers registered yet.</p>
      ) : (
        <ul className="mt-3 space-y-3">
          {customers.map((c) => (
            <li key={c.email} className="flex items-center justify-between text-sm">
              <div>
                <p className="font-semibold text-ink">{c.fullName}</p>
                <p className="text-xs text-slate">{c.email}</p>
              </div>
              <span className="text-xs text-slate">{formatDate(c.createdAt)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function TopProducts({ products }: { products: DashboardData['topProducts'] }) {
  return (
    <div className="rounded-card border border-line bg-white p-5">
      <h2 className="text-sm font-bold uppercase tracking-wide text-slate">Top selling products</h2>
      {products.length === 0 ? (
        <p className="mt-4 text-sm text-slate">No sales recorded yet.</p>
      ) : (
        <ul className="mt-3 space-y-3">
          {products.map((p, i) => (
            <li key={p.name} className="flex items-center gap-3 text-sm">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-pill bg-brand-tint text-xs font-bold text-brand">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-ink">{p.name}</p>
                <p className="text-xs text-slate">{formatNaira(p.price)}</p>
              </div>
              <span className="text-xs font-semibold text-slate-deep">{p.soldCount} sold</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
