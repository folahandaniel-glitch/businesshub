import Link from 'next/link';
import {
  Laptop, MonitorSmartphone, Monitor, Printer, Keyboard, HardDrive,
  Cpu, Wifi, BatteryCharging, Disc, Camera, Smartphone, Building2, RefreshCw, Wrench
} from 'lucide-react';

/** Icons are matched by slug so new categories degrade to a sensible default. */
const ICONS: Record<string, React.ReactNode> = {
  laptops: <Laptop size={26} />,
  'desktop-computers': <MonitorSmartphone size={26} />,
  monitors: <Monitor size={26} />,
  printers: <Printer size={26} />,
  'computer-accessories': <Keyboard size={26} />,
  'storage-devices': <HardDrive size={26} />,
  components: <Cpu size={26} />,
  'networking-equipment': <Wifi size={26} />,
  'power-solutions': <BatteryCharging size={26} />,
  software: <Disc size={26} />,
  'cctv-and-security-equipment': <Camera size={26} />,
  'phones-and-tablets': <Smartphone size={26} />,
  'office-equipment': <Building2 size={26} />,
  'refurbished-computers': <RefreshCw size={26} />,
  'computer-spare-parts': <Wrench size={26} />
};

export type CategoryTile = {
  id: string;
  name: string;
  slug: string;
  _count: { products: number };
};

export function CategoryStrip({ categories }: { categories: CategoryTile[] }) {
  if (categories.length === 0) return null;

  return (
    <section className="shell py-10 md:py-14">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="rule-heading">Shop by category</h2>
          <p className="mt-2 text-sm text-slate">Start where you already know what you need.</p>
        </div>
        <Link href="/categories" className="text-sm font-semibold text-brand hover:underline">
          All categories
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/categories/${c.slug}`}
            className="flex flex-col items-center gap-3 rounded-card border border-line bg-white px-4 py-6 text-center transition-colors duration-150 ease-swift hover:border-brand hover:bg-brand-tint"
          >
            <span className="text-brand" aria-hidden>
              {ICONS[c.slug] ?? <Cpu size={26} />}
            </span>
            <span className="text-sm font-semibold leading-snug text-ink">{c.name}</span>
            <span className="text-xs text-slate">
              {c._count.products} {c._count.products === 1 ? 'product' : 'products'}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
