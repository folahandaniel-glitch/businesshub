import type { Metadata } from 'next';
import { PolicyLayout, Section } from '@/components/legal/PolicyLayout';

export const metadata: Metadata = { title: 'Privacy policy' };

export default function PrivacyPage() {
  return (
    <PolicyLayout title="Privacy policy" updated="Effective from the date this site went live">
      <Section title="What we collect">
        When you create an account, place an order or contact us, we collect your name, email address, phone
        number, delivery address and order history. We do not collect payment card numbers directly; these are
        handled by our payment providers, Paystack and Flutterwave, under their own security standards.
      </Section>
      <Section title="How we use it">
        We use your information to process orders, deliver products, send order and account notifications, and
        respond to enquiries. We do not sell your personal information to third parties.
      </Section>
      <Section title="Cookies">
        We use cookies only to keep you signed in and to remember items in your cart. We do not use cookies for
        third-party advertising.
      </Section>
      <Section title="Your rights">
        You can request a copy of the personal information we hold about you, ask us to correct it, or ask us to
        delete your account, by contacting us through the details on our Contact page.
      </Section>
      <Section title="Contact">
        Questions about this policy can be sent through our Contact page or to the email address listed there.
      </Section>
    </PolicyLayout>
  );
}
