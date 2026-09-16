import type { Metadata } from 'next';
import { PolicyLayout, Section } from '@/components/legal/PolicyLayout';

export const metadata: Metadata = { title: 'Shipping information' };

export default function ShippingPage() {
  return (
    <PolicyLayout title="Shipping information" updated="Effective from the date this site went live">
      <Section title="Coverage">
        We deliver nationwide across Nigeria from our warehouse in Ibadan, Oyo State. Delivery within Ibadan is
        typically faster than deliveries to other states.
      </Section>
      <Section title="Delivery time">
        Orders are typically dispatched within one to two business days of payment confirmation. Delivery time
        after dispatch depends on your location and the courier used, and is shown at checkout before you pay.
      </Section>
      <Section title="Delivery fees">
        Delivery fees are calculated at checkout based on your state and the size or weight of your order, and
        are shown in full before payment.
      </Section>
      <Section title="Order tracking">
        Once your order has shipped, you can track its status from your account under Orders, or by contacting us
        with your order number.
      </Section>
      <Section title="Large and corporate orders">
        For bulk orders such as office, school or lab fit-outs, contact us directly to arrange delivery and, where
        needed, installation.
      </Section>
    </PolicyLayout>
  );
}
