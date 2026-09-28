import type { Metadata } from 'next';
import { ShieldCheck, Tag, BadgeCheck, HeartHandshake, MapPin, Phone, Mail } from 'lucide-react';
import { getSiteSettings } from '@/lib/queries';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'About us',
  description: `About ${siteConfig.name}, a registered Nigerian computer and technology retailer based in Ibadan, Oyo State.`
};

export const dynamic = 'force-dynamic';

const PILLARS = [
  { icon: <BadgeCheck size={22} />, title: 'Quality Products', body: 'Every product is supplied with attention to quality before it reaches you.' },
  { icon: <Tag size={22} />, title: 'Competitive Prices', body: 'Fair, transparent pricing whether you need one laptop or a full office setup.' },
  { icon: <ShieldCheck size={22} />, title: 'Warranty', body: 'Applicable products carry a warranty as stated on your receipt.' },
  { icon: <HeartHandshake size={22} />, title: 'Trusted Service', body: 'Dependable technology solutions and support you can rely on.' }
];

export default async function AboutPage() {
  const { business, contact } = await getSiteSettings();

  return (
    <div className="shell py-10 md:py-14">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold text-brand">{business?.registrationNumber || siteConfig.registrationNumber}</p>
        <h1 className="mt-2 text-3xl font-extrabold text-ink md:text-4xl">
          Why Choose {business?.companyName || siteConfig.name}?
        </h1>
        {business?.tagline ? <p className="mt-2 text-lg font-semibold text-scarlet">{business.tagline}</p> : null}

        <p className="mt-4 text-base leading-relaxed text-slate-deep">
          {business?.aboutText ||
            'Business-Hub Computers is a registered Nigerian technology retailer based in Ibadan, Oyo State, supplying laptops, desktops, components, printers, networking and security equipment to businesses, schools and individuals across the country.'}
        </p>

        <div className="mt-5 space-y-2 text-sm text-slate-deep">
          {contact?.address ? (
            <p className="flex items-start gap-2.5">
              <MapPin size={18} className="mt-0.5 shrink-0 text-scarlet" aria-hidden />
              Located in Ibadan, Oyo State &middot; {contact.address}
            </p>
          ) : null}
          {contact?.branchAddress ? (
            <p className="flex items-start gap-2.5">
              <MapPin size={18} className="mt-0.5 shrink-0 text-brand" aria-hidden />
              Branch: {contact.branchAddress}
            </p>
          ) : null}
          {contact?.primaryPhone ? (
            <p className="flex items-center gap-2.5">
              <Phone size={16} className="shrink-0 text-scarlet" aria-hidden />
              <a href={`tel:${contact.primaryPhone}`} className="hover:text-brand">
                {contact.primaryPhone}
              </a>
            </p>
          ) : null}
          {contact?.email ? (
            <p className="flex items-center gap-2.5">
              <Mail size={16} className="shrink-0 text-scarlet" aria-hidden />
              <a href={`mailto:${contact.email}`} className="hover:text-brand">
                {contact.email}
              </a>
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PILLARS.map((p) => (
          <div key={p.title} className="rounded-card border border-line bg-white p-6">
            <span className="inline-grid h-11 w-11 place-items-center rounded-card bg-brand-tint text-brand" aria-hidden>
              {p.icon}
            </span>
            <h2 className="mt-4 text-base font-bold text-ink">{p.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate">{p.body}</p>
          </div>
        ))}
      </div>

      {business?.tagline ? (
        <p className="mt-10 text-center text-sm font-semibold text-slate">
          {business.companyName || siteConfig.name} &mdash; {business.tagline}
        </p>
      ) : null}
    </div>
  );
}
