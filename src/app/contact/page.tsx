import type { Metadata } from 'next';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { ContactForm } from '@/components/contact/ContactForm';
import { getSiteSettings } from '@/lib/queries';

export const metadata: Metadata = {
  title: 'Contact us',
  description: 'Reach Business-Hub Computers by phone, email or in person in Ibadan, Oyo State.'
};

export const dynamic = 'force-dynamic';

export default async function ContactPage() {
  const { contact } = await getSiteSettings();

  return (
    <div className="shell py-10 md:py-14">
      <h1 className="rule-heading text-2xl md:text-3xl">Contact us</h1>
      <p className="mt-3 max-w-xl text-sm text-slate">
        Questions about a product, an order, or a bulk quote for your office or school. Send a message and our
        team will get back to you.
      </p>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-5">
          {contact?.primaryPhone ? (
            <ContactRow icon={<Phone size={18} />} label="Call us" value={contact.primaryPhone} href={`tel:${contact.primaryPhone}`} />
          ) : null}
          {contact?.email ? (
            <ContactRow icon={<Mail size={18} />} label="Email" value={contact.email} href={`mailto:${contact.email}`} />
          ) : null}
          {contact?.address ? (
            <ContactRow
              icon={<MapPin size={18} />}
              label="Visit us"
              value={contact.address}
              href={contact.mapsLink || undefined}
            />
          ) : null}
          {contact?.openingHours ? (
            <ContactRow icon={<Clock size={18} />} label="Opening hours" value={contact.openingHours} />
          ) : null}
        </div>

        <div className="rounded-card border border-line bg-white p-6">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}

function ContactRow({
  icon,
  label,
  value,
  href
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="flex items-start gap-3.5 rounded-card border border-line bg-white p-4">
      <span className="mt-0.5 shrink-0 text-scarlet" aria-hidden>
        {icon}
      </span>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate">{label}</p>
        <p className="mt-0.5 text-sm font-medium text-ink">{value}</p>
      </div>
    </div>
  );
  return href ? (
    <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="block transition-opacity hover:opacity-80">
      {content}
    </a>
  ) : (
    content
  );
}
