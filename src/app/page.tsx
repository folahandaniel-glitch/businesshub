import Link from 'next/link';
import { Hero } from '@/components/home/Hero';
import { CategoryStrip } from '@/components/home/CategoryStrip';
import { ProductSection } from '@/components/shop/ProductSection';
import { FlashDeals } from '@/components/home/FlashDeals';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';
import { Testimonials } from '@/components/home/Testimonials';
import { Newsletter } from '@/components/home/Newsletter';
import { getHomepageData } from '@/lib/queries';
import { siteConfig } from '@/lib/site-config';

/*
 * Rendered per request. The homepage reads live stock and prices, and this
 * also keeps the Vercel build from needing a database connection at build time.
 */
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const data = await getHomepageData();
  const spotlight = data.onSale[0] ?? data.featured[0];

  // Deals window closes at the end of the current day, West Africa Time.
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const catalogueEmpty =
    data.featured.length === 0 &&
    data.newArrivals.length === 0 &&
    data.bestSellers.length === 0 &&
    data.categories.length === 0;

  return (
    <>
      <Hero spotlight={spotlight} />

      {catalogueEmpty ? <EmptyCatalogue /> : null}

      <CategoryStrip categories={data.categories} />

      <ProductSection
        title="Featured this month"
        description="Hand-picked machines our team is recommending right now."
        products={data.featured}
        viewAllHref="/shop?featured=true"
      />

      <FlashDeals products={data.onSale} endsAt={endOfDay.getTime()} />

      <ProductSection
        title="New arrivals"
        description="The most recent stock to reach the warehouse."
        products={data.newArrivals}
        viewAllHref="/shop?sort=newest"
      />

      <ProductSection
        title="Best sellers"
        description="What customers order most often, month after month."
        products={data.bestSellers}
        viewAllHref="/shop?sort=popularity"
      />

      <WhyChooseUs />
      <Testimonials items={data.testimonials} />
      <Newsletter />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: siteConfig.name,
            url: siteConfig.url,
            logo: `${siteConfig.url}/logo.jpeg`,
            description: data.business?.description ?? siteConfig.tagline,
            identifier: siteConfig.registrationNumber
          })
        }}
      />
    </>
  );
}

/** Shown only before the catalogue is seeded, with the exact command to run. */
function EmptyCatalogue() {
  return (
    <div className="shell py-14">
      <div className="rounded-card border border-line bg-white p-8">
        <h2 className="rule-heading">The catalogue is empty</h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate">
          No products have been loaded yet. Run the seed to populate categories, site settings and demo stock, or
          add your first product from the admin backend.
        </p>
        <div className="mt-4 rounded-card bg-mist px-4 py-3 font-mono text-sm text-ink">npm run db:seed</div>
        <Link href="/admin" className="mt-5 inline-flex text-sm font-semibold text-brand hover:underline">
          Open the admin backend
        </Link>
      </div>
    </div>
  );
}
