import type { Metadata } from 'next';
import { PackageCheck, Wrench, ReceiptText, Users, MapPin } from 'lucide-react';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'About us',
  description: `About ${siteConfig.name}, a registered Nigerian computer and technology retailer based in Ibadan, Oyo State.`
};

export default function AboutPage() {
  return (
    <div className="shell py-10 md:py-14">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold text-brand">{siteConfig.registrationNumber}</p>
        <h1 className="mt-2 text-3xl font-extrabold text-ink md:text-4xl">About Business-Hub Computers</h1>
        <p className="mt-4 text-base leading-relaxed text-slate-deep">
          Business-Hub Computers is a registered Nigerian technology retailer based in Ibadan, Oyo State,
          supplying laptops, desktops, components, printers, networking and security equipment to businesses,
          schools and individuals across the country. We sell what we can support: every new unit carries a
          warranty, and our own technicians handle setup, installation and repairs rather than routing you to
          a third party.
        </p>
        <p className="mt-4 flex items-start gap-2.5 text-sm text-slate-deep">
          <MapPin size={18} className="mt-0.5 shrink-0 text-scarlet" aria-hidden />
          Oketedo, 9VRM+896, Iya Olobe Oketedo Street, Ibadan 200284, Oyo, Nigeria
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <AboutCard
          icon={<PackageCheck size={22} />}
          title="Stock you can actually collect"
          body="What the site shows is what sits in the warehouse. Quantities update the moment an order is confirmed."
        />
        <AboutCard
          icon={<Wrench size={22} />}
          title="Support after the sale"
          body="Setup help, driver installation, warranty claims and repairs are handled by our own technicians."
        />
        <AboutCard
          icon={<ReceiptText size={22} />}
          title="Proper invoicing for businesses"
          body="Registered as RC: 3001886, we issue formal invoices and receipts for company and school budgets."
        />
        <AboutCard
          icon={<Users size={22} />}
          title="Bulk and corporate supply"
          body="Fitting out an office, lab or cyber cafe. Send us the requirement and we will quote the full list."
        />
      </div>
    </div>
  );
}

function AboutCard({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-card border border-line bg-white p-6">
      <span className="inline-grid h-11 w-11 place-items-center rounded-card bg-brand-tint text-brand" aria-hidden>
        {icon}
      </span>
      <h2 className="mt-4 text-base font-bold text-ink">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-slate">{body}</p>
    </div>
  );
}
