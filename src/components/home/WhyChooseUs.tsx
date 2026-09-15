import { PackageCheck, Wrench, ReceiptText, Users } from 'lucide-react';

const REASONS = [
  {
    icon: <PackageCheck size={22} />,
    title: 'Stock you can actually collect',
    body: 'What the site shows is what sits in the warehouse. Quantities update the moment an order is confirmed, so you are never sold a unit that has already gone.'
  },
  {
    icon: <Wrench size={22} />,
    title: 'Support after the sale',
    body: 'Setup help, driver installation, warranty claims and repairs are handled by our own technicians rather than passed to a third party.'
  },
  {
    icon: <ReceiptText size={22} />,
    title: 'Proper invoicing for businesses',
    body: 'Registered as RC: 3001886, we issue formal invoices and receipts, which matters when you are buying against a company or school budget.'
  },
  {
    icon: <Users size={22} />,
    title: 'Bulk and corporate supply',
    body: 'Fitting out an office, lab or cyber cafe. Send us the requirement and we will quote the full list, including cabling, power protection and installation.'
  }
];

export function WhyChooseUs() {
  return (
    <section className="shell py-10 md:py-14">
      <h2 className="rule-heading">Why buy from Business-Hub</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {REASONS.map((r) => (
          <div key={r.title} className="rounded-card border border-line bg-white p-6">
            <span className="inline-grid h-11 w-11 place-items-center rounded-card bg-brand-tint text-brand" aria-hidden>
              {r.icon}
            </span>
            <h3 className="mt-4 text-base font-bold">{r.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate">{r.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
