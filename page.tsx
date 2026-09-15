import { ButtonLink } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Price } from '@/components/ui/Price';
import { StockPill } from '@/components/ui/StockPill';

/**
 * Stage 1 holding page. It renders the shell and the design system
 * so the foundation can be checked in the browser before the real
 * homepage is built in stage 2.
 */
export default function HomePage() {
  return (
    <div className="shell py-12">
      <Badge tone="sale">Stage 1 complete</Badge>
      <h1 className="mt-4 max-w-2xl text-3xl font-extrabold md:text-5xl">
        Foundation, database and design system are in place
      </h1>
      <p className="mt-4 max-w-xl text-lg text-slate">
        Header, footer, brand tokens and the full schema are ready. The storefront homepage is next.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink href="/shop" size="lg">Shop now</ButtonLink>
        <ButtonLink href="/categories" variant="outline" size="lg">View products</ButtonLink>
        <ButtonLink href="/deals" variant="accent" size="lg">Today&apos;s deals</ButtonLink>
      </div>

      <section className="mt-12 rounded-card border border-line bg-white p-6 shadow-card">
        <h2 className="rule-heading">Design system check</h2>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Badge tone="brand">Featured</Badge>
          <Badge tone="sale">On sale</Badge>
          <Badge tone="neutral">Refurbished</Badge>
          <StockPill quantity={14} />
          <StockPill quantity={3} />
          <StockPill quantity={0} />
        </div>
        <div className="mt-5">
          <Price price={485000} previousPrice={560000} size="lg" />
        </div>
      </section>
    </div>
  );
}
