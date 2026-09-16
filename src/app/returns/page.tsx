import type { Metadata } from 'next';
import { PolicyLayout, Section } from '@/components/legal/PolicyLayout';

export const metadata: Metadata = { title: 'Returns and warranty claims' };

export default function ReturnsPage() {
  return (
    <PolicyLayout title="Returns and warranty claims" updated="Effective from the date this site went live">
      <Section title="Change of mind">
        Unopened, unused products in their original packaging can be returned within 7 days of delivery for a
        refund or exchange. The item must be complete with all accessories and documentation.
      </Section>
      <Section title="Faulty or damaged items">
        If a product arrives faulty or damaged, contact us within 48 hours of delivery with your order number and
        photos of the issue. We will arrange a repair, replacement or refund depending on the situation.
      </Section>
      <Section title="Warranty claims">
        For issues that develop after the return window but within the warranty period stated on the product
        page, contact us to arrange an assessment. Our technicians handle warranty repairs directly.
      </Section>
      <Section title="What is not covered">
        Physical damage, liquid damage, unauthorised repair attempts, and normal wear on consumable parts such as
        batteries and ink are not covered by returns or warranty.
      </Section>
      <Section title="How to start a return">
        Contact us through the Contact page with your order number and a description of the issue, and we will
        guide you through the next step.
      </Section>
    </PolicyLayout>
  );
}
