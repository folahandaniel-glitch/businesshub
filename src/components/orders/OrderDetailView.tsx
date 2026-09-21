import { CheckCircle2, MapPin, CreditCard } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { formatDate, formatNaira } from '@/lib/utils';
import type { OrderDetail } from '@/lib/orders';

const PAYMENT_LABEL: Record<string, string> = {
  BANK_TRANSFER: 'Bank transfer',
  PAY_ON_DELIVERY: 'Pay on delivery',
  PAYSTACK: 'Paystack',
  FLUTTERWAVE: 'Flutterwave'
};

export function OrderDetailView({ order, confirmation = false }: { order: OrderDetail; confirmation?: boolean }) {
  return (
    <div>
      {confirmation ? (
        <div className="mb-8 flex items-start gap-3 rounded-card border border-emerald-200 bg-emerald-50 p-5">
          <CheckCircle2 size={24} className="mt-0.5 shrink-0 text-success" aria-hidden />
          <div>
            <p className="font-bold text-ink">Order placed successfully</p>
            <p className="mt-1 text-sm text-slate-deep">
              Keep your order number for reference. We will update the status here as it progresses.
            </p>
          </div>
        </div>
      ) : null}

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate">Order number</p>
          <h1 className="text-xl font-extrabold text-ink">{order.orderNumber}</h1>
          <p className="mt-1 text-sm text-slate">Placed on {formatDate(order.createdAt, true)}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_20rem]">
        <div>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate">Items</h2>
          <div className="overflow-hidden rounded-card border border-line">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line bg-mist text-xs uppercase tracking-wide text-slate">
                <tr>
                  <th className="px-4 py-2.5">Product</th>
                  <th className="px-4 py-2.5">Qty</th>
                  <th className="px-4 py-2.5">Price</th>
                  <th className="px-4 py-2.5">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, i) => (
                  <tr key={i} className="border-b border-line last:border-0">
                    <td className="px-4 py-3">
                      <p className="font-medium text-ink">{item.productName}</p>
                      <p className="text-xs text-slate">SKU: {item.productSku}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-deep">{item.quantity}</td>
                    <td className="px-4 py-3 text-slate-deep">{formatNaira(item.unitPrice)}</td>
                    <td className="px-4 py-3 font-semibold text-ink">{formatNaira(item.lineTotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex items-start gap-2.5 rounded-card border border-line bg-white p-4 text-sm">
            <MapPin size={17} className="mt-0.5 shrink-0 text-scarlet" aria-hidden />
            <div>
              <p className="font-semibold text-ink">Delivery address</p>
              <p className="mt-0.5 text-slate-deep">
                {order.deliveryAddress}, {order.deliveryCity}, {order.deliveryState}
              </p>
              {order.deliveryNote ? <p className="mt-1 text-xs text-slate">Note: {order.deliveryNote}</p> : null}
            </div>
          </div>
        </div>

        <div className="h-fit rounded-card border border-line bg-white p-6">
          <h2 className="text-base font-bold text-ink">Payment summary</h2>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between text-slate-deep">
              <span>Subtotal</span>
              <span className="font-medium text-ink">{formatNaira(order.subtotal)}</span>
            </div>
            {order.discountTotal > 0 ? (
              <div className="flex justify-between text-slate-deep">
                <span>Discount</span>
                <span className="font-medium text-success">-{formatNaira(order.discountTotal)}</span>
              </div>
            ) : null}
            <div className="flex justify-between text-slate-deep">
              <span>Delivery fee</span>
              <span className="font-medium text-ink">{formatNaira(order.deliveryFee)}</span>
            </div>
            <div className="flex justify-between border-t border-line pt-2 text-base font-bold text-ink">
              <span>Total</span>
              <span>{formatNaira(order.grandTotal)}</span>
            </div>
          </div>

          {order.paymentMethod ? (
            <div className="mt-4 flex items-center gap-2 rounded-card bg-mist px-3 py-2.5 text-sm text-slate-deep">
              <CreditCard size={15} className="text-brand" aria-hidden />
              {PAYMENT_LABEL[order.paymentMethod] ?? order.paymentMethod}
            </div>
          ) : null}

          {order.paymentMethod === 'BANK_TRANSFER' ? (
            <p className="mt-3 text-xs leading-relaxed text-slate">
              Transfer the total to the account details sent to your email, then reply with your order number as
              the payment reference.
            </p>
          ) : null}
          {order.paymentMethod === 'PAY_ON_DELIVERY' ? (
            <p className="mt-3 text-xs leading-relaxed text-slate">
              Have the exact amount ready for our delivery agent.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
