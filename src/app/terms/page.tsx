import type { Metadata } from 'next';
import { PolicyLayout, Section } from '@/components/legal/PolicyLayout';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = { title: 'Terms and conditions' };

export default function TermsPage() {
  return (
    <PolicyLayout title="Terms and conditions" updated="Effective from the date this site went live">
      <Section title="About us">
        This website is operated by {siteConfig.name}, {siteConfig.registrationNumber}, a business registered in
        Nigeria. By placing an order through this site, you agree to these terms.
      </Section>
      <Section title="Product listings and pricing">
        We take care to describe and price products accurately. Prices are shown in Naira and may change without
        notice before you complete checkout. If a listed price is materially incorrect due to an error, we will
        contact you before processing the order.
      </Section>
      <Section title="Orders and payment">
        An order is confirmed once payment has been received through one of our supported payment providers, or
        once payment on delivery has been arranged where that option is offered. We reserve the right to decline
        or cancel an order, for example where stock has become unavailable.
      </Section>
      <Section title="Warranty">
        New products carry the warranty period stated on the product page, covering manufacturing defects.
        Warranty claims are handled directly by our technical team. Physical damage, liquid damage and misuse are
        not covered.
      </Section>
      <Section title="Limitation of liability">
        We are not liable for indirect or consequential loss arising from the use of a product purchased through
        this site, beyond what is required by Nigerian consumer protection law.
      </Section>
    </PolicyLayout>
  );
}
