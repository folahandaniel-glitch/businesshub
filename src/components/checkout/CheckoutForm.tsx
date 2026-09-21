'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Landmark, Truck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatNaira } from '@/lib/utils';
import { estimateDeliveryFee } from '@/lib/delivery';
import type { CartSummary } from '@/lib/cart';

type CustomerInfo = { fullName: string; email: string; phone: string } | null;

const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 'Cross River',
  'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT Abuja', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano',
  'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo',
  'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
];

export function CheckoutForm({ cart, customer }: { cart: CartSummary; customer: CustomerInfo }) {
  const router = useRouter();
  const [state, setState] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'BANK_TRANSFER' | 'PAY_ON_DELIVERY'>('BANK_TRANSFER');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const deliveryFee = useMemo(() => (state ? estimateDeliveryFee(state) : null), [state]);
  const total = cart.subtotal + (deliveryFee ?? 0);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = Object.fromEntries(new FormData(e.currentTarget).entries());

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, paymentMethod })
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? 'Could not place your order.');

      router.push(`/order-confirmation/${body.orderNumber}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not place your order.');
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-8 lg:grid-cols-[1fr_20rem]">
      <div className="space-y-6">
        {!customer ? (
          <section className="rounded-card border border-line bg-white p-6">
            <h2 className="text-base font-bold text-ink">Your details</h2>
            <p className="mt-1 text-sm text-slate">
              Checking out as a guest.{' '}
              <Link href="/login?next=/checkout" className="font-semibold text-brand hover:underline">
                Sign in
              </Link>{' '}
              instead if you have an account.
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Full name" name="guestName" required autoComplete="name" />
              <Field label="Phone number" name="guestPhone" type="tel" required autoComplete="tel" />
            </div>
            <div className="mt-4">
              <Field label="Email address" name="guestEmail" type="email" required autoComplete="email" />
            </div>
          </section>
        ) : (
          <section className="rounded-card border border-line bg-white p-6">
            <h2 className="text-base font-bold text-ink">Your details</h2>
            <p className="mt-1 text-sm text-slate-deep">
              Signed in as <span className="font-semibold text-ink">{customer.fullName}</span> ({customer.email})
            </p>
          </section>
        )}

        <section className="rounded-card border border-line bg-white p-6">
          <h2 className="text-base font-bold text-ink">Delivery address</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="deliveryState" className="mb-1.5 block text-sm font-semibold text-ink">
                State
              </label>
              <select
                id="deliveryState"
                name="deliveryState"
                required
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="h-11 w-full rounded-card border border-line px-3.5 text-[0.9375rem] text-ink focus:border-brand"
              >
                <option value="">Select state</option>
                {NIGERIAN_STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <Field label="City" name="deliveryCity" required autoComplete="address-level2" />
          </div>
          <div className="mt-4">
            <Field label="Street address" name="deliveryAddress" required autoComplete="street-address" />
          </div>
          <div className="mt-4">
            <label htmlFor="deliveryNote" className="mb-1.5 block text-sm font-semibold text-ink">
              Delivery note (optional)
            </label>
            <textarea
              id="deliveryNote"
              name="deliveryNote"
              rows={2}
              placeholder="Landmark, gate colour, best time to deliver"
              className="w-full rounded-card border border-line px-3.5 py-2.5 text-[0.9375rem] text-ink focus:border-brand"
            />
          </div>
        </section>

        <section className="rounded-card border border-line bg-white p-6">
          <h2 className="text-base font-bold text-ink">Payment method</h2>
          <div className="mt-4 space-y-3">
            <PaymentOption
              icon={<Landmark size={18} />}
              label="Bank transfer"
              body="Account details are sent to your email after you place the order."
              selected={paymentMethod === 'BANK_TRANSFER'}
              onSelect={() => setPaymentMethod('BANK_TRANSFER')}
            />
            <PaymentOption
              icon={<Truck size={18} />}
              label="Pay on delivery"
              body="Pay in cash or by transfer when your order arrives."
              selected={paymentMethod === 'PAY_ON_DELIVERY'}
              onSelect={() => setPaymentMethod('PAY_ON_DELIVERY')}
            />
          </div>
        </section>
      </div>

      <div className="h-fit rounded-card border border-line bg-white p-6">
        <h2 className="text-base font-bold text-ink">Order summary</h2>
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between text-slate-deep">
            <span>Subtotal ({cart.itemCount} {cart.itemCount === 1 ? 'item' : 'items'})</span>
            <span className="font-semibold text-ink">{formatNaira(cart.subtotal)}</span>
          </div>
          <div className="flex justify-between text-slate-deep">
            <span>Delivery fee</span>
            <span className="font-semibold text-ink">{deliveryFee !== null ? formatNaira(deliveryFee) : 'Select a state'}</span>
          </div>
          <div className="flex justify-between border-t border-line pt-2 text-base font-bold text-ink">
            <span>Total</span>
            <span>{formatNaira(total)}</span>
          </div>
        </div>

        {error ? (
          <p className="mt-4 text-sm font-medium text-scarlet" role="alert">
            {error}
          </p>
        ) : null}

        <Button type="submit" size="lg" disabled={loading} className="mt-5 w-full">
          {loading ? 'Placing order' : 'Place order'}
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = 'text',
  required = false,
  autoComplete
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-semibold text-ink">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className="h-11 w-full rounded-card border border-line px-3.5 text-[0.9375rem] text-ink focus:border-brand"
      />
    </div>
  );
}

function PaymentOption({
  icon,
  label,
  body,
  selected,
  onSelect
}: {
  icon: React.ReactNode;
  label: string;
  body: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full items-start gap-3 rounded-card border p-4 text-left transition-colors ${
        selected ? 'border-brand bg-brand-tint' : 'border-line hover:border-brand-line'
      }`}
    >
      <span className={selected ? 'text-brand' : 'text-slate'} aria-hidden>
        {icon}
      </span>
      <span>
        <span className="block text-sm font-semibold text-ink">{label}</span>
        <span className="mt-0.5 block text-xs text-slate">{body}</span>
      </span>
    </button>
  );
}
