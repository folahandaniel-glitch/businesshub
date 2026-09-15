import Link from 'next/link';
import { ArrowRight, Cpu, HardDrive, Printer, Wifi, ShieldCheck, Headphones, Truck } from 'lucide-react';
import { ButtonLink } from '@/components/ui/Button';
import { ProductThumb } from '@/components/ui/ProductThumb';
import { Price } from '@/components/ui/Price';
import { Badge } from '@/components/ui/Badge';
import type { ProductCardData } from '@/lib/queries';

/**
 * The hero leads with what the business actually sells rather than a
 * decorative banner: a strong trade claim, the four buying routes
 * customers arrive with, and one live deal pulled from the catalogue.
 */
export function Hero({ spotlight }: { spotlight?: ProductCardData }) {
  return (
    <section className="bg-ink text-white">
      <div className="shell grid gap-10 py-12 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:py-16">
        <div>
          <p className="inline-flex items-center gap-2 rounded-pill bg-white/10 px-3 py-1 text-xs font-semibold">
            <span className="h-1.5 w-1.5 rounded-pill bg-scarlet" aria-hidden />
            RC: 3001886 registered technology retailer
          </p>

          <h1 className="mt-5 max-w-2xl text-3xl font-extrabold leading-[1.1] text-white md:text-5xl">
            Business machines, components and office technology, ready to ship today
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/75 md:text-lg">
            Laptops, desktops, printers, storage, networking and security equipment for offices, schools and
            individuals across Nigeria. Every new unit carries a warranty, and our team will help you match the
            specification to the job before you buy.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/shop" variant="accent" size="lg">
              Shop now
            </ButtonLink>
            <ButtonLink
              href="/categories"
              size="lg"
              className="border-2 border-white/30 bg-transparent text-white hover:border-white hover:bg-white/10"
            >
              View products
            </ButtonLink>
          </div>

          <div className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <QuickRoute icon={<Cpu size={18} />} label="Laptops" href="/categories/laptops" />
            <QuickRoute icon={<HardDrive size={18} />} label="Storage" href="/categories/storage-devices" />
            <QuickRoute icon={<Printer size={18} />} label="Printers" href="/categories/printers" />
            <QuickRoute icon={<Wifi size={18} />} label="Networking" href="/categories/networking-equipment" />
          </div>
        </div>

        {spotlight ? (
          <div className="rounded-card bg-white p-5 text-slate-deep shadow-lift">
            <div className="flex items-center justify-between">
              <Badge tone="sale">Deal of the week</Badge>
              <span className="text-xs font-semibold text-slate">{spotlight.brand}</span>
            </div>
            <div className="relative mt-4 aspect-[4/3] overflow-hidden rounded-card border border-line">
              <ProductThumb src={spotlight.imageUrl} alt={spotlight.name} sizes="(max-width: 1024px) 90vw, 420px" />
            </div>
            <h2 className="mt-4 text-lg font-bold leading-snug text-ink">{spotlight.name}</h2>
            <Price price={spotlight.price} previousPrice={spotlight.previousPrice} size="lg" className="mt-3" />
            <Link
              href={`/product/${spotlight.slug}`}
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline"
            >
              View this deal
              <ArrowRight size={15} aria-hidden />
            </Link>
          </div>
        ) : null}
      </div>

      <div className="border-t border-white/10">
        <div className="shell grid gap-4 py-5 sm:grid-cols-3">
          <Assurance icon={<Truck size={17} />} title="Nationwide delivery" body="Dispatched from our Nigerian warehouse" />
          <Assurance icon={<ShieldCheck size={17} />} title="Warranty backed" body="Cover on every new unit we sell" />
          <Assurance icon={<Headphones size={17} />} title="Technical advice" body="Talk to a specialist before you buy" />
        </div>
      </div>
    </section>
  );
}

function QuickRoute({ icon, label, href }: { icon: React.ReactNode; label: string; href: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2.5 rounded-card border border-white/15 bg-white/5 px-3.5 py-3 text-sm font-semibold text-white transition-colors duration-150 hover:border-scarlet hover:bg-white/10"
    >
      <span className="text-scarlet" aria-hidden>
        {icon}
      </span>
      {label}
    </Link>
  );
}

function Assurance({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-scarlet" aria-hidden>
        {icon}
      </span>
      <div>
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="text-xs text-white/60">{body}</p>
      </div>
    </div>
  );
}
