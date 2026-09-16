import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { getProductDetail } from '@/lib/shop-queries';
import { Gallery } from '@/components/product/Gallery';
import { SpecTable } from '@/components/product/SpecTable';
import { ReviewList } from '@/components/product/ReviewList';
import { PurchasePanel } from '@/components/product/PurchasePanel';
import { ProductSection } from '@/components/shop/ProductSection';
import { Badge } from '@/components/ui/Badge';
import { Rating } from '@/components/ui/Rating';
import { siteConfig } from '@/lib/site-config';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const data = await getProductDetail(params.slug);
  if (!data) return { title: 'Product' };
  return {
    title: data.product.name,
    description: data.product.shortDescription ?? data.product.description.slice(0, 155),
    openGraph: {
      title: data.product.name,
      description: data.product.shortDescription ?? undefined,
      images: data.product.imageUrl ? [data.product.imageUrl] : undefined
    }
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const data = await getProductDetail(params.slug);
  if (!data) notFound();

  const { product, reviews, related } = data;
  const conditionLabel =
    product.condition === 'NEW' ? 'New' : product.condition === 'REFURBISHED' ? 'Refurbished' : 'UK used';

  return (
    <div className="shell py-8 md:py-10">
      <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-slate" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">
          Home
        </Link>
        <ChevronRight size={14} aria-hidden />
        <Link href="/categories" className="hover:text-brand">
          Categories
        </Link>
        {product.parentCategorySlug ? (
          <>
            <ChevronRight size={14} aria-hidden />
            <Link href={`/categories/${product.parentCategorySlug}`} className="hover:text-brand">
              {product.parentCategoryName}
            </Link>
          </>
        ) : null}
        <ChevronRight size={14} aria-hidden />
        <Link href={`/categories/${product.categorySlug}`} className="hover:text-brand">
          {product.categoryName}
        </Link>
        <ChevronRight size={14} aria-hidden />
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1fr_1fr_20rem]">
        <Gallery images={product.images} name={product.name} />

        <div>
          <p className="text-sm font-semibold text-brand">{product.brand}</p>
          <h1 className="mt-1.5 text-2xl font-extrabold leading-snug text-ink md:text-3xl">{product.name}</h1>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <Rating value={product.ratingAverage} count={product.ratingCount} />
            <Badge tone="neutral">{conditionLabel}</Badge>
            {product.isNewArrival ? <Badge tone="brand">New arrival</Badge> : null}
            {product.isBestSeller ? <Badge tone="sale">Best seller</Badge> : null}
          </div>

          {product.shortDescription ? (
            <p className="mt-4 text-[0.9375rem] leading-relaxed text-slate-deep">{product.shortDescription}</p>
          ) : null}

          <div className="mt-6">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate">Specifications</h2>
            <SpecTable specs={product.specifications} />
          </div>

          <div className="mt-6">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate">Description</h2>
            <p className="whitespace-pre-line text-[0.9375rem] leading-relaxed text-slate-deep">{product.description}</p>
          </div>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <PurchasePanel
            productId={product.id}
            price={product.price}
            previousPrice={product.previousPrice}
            stockQuantity={product.stockQuantity}
            minStockLevel={product.minStockLevel}
            warrantyInfo={product.warrantyInfo}
            sku={product.sku}
          />
        </div>
      </div>

      <div className="mt-14 max-w-3xl">
        <h2 className="rule-heading">Customer reviews</h2>
        <div className="mt-5">
          <ReviewList reviews={reviews} average={product.ratingAverage} count={product.ratingCount} />
        </div>
      </div>

      <ProductSection
        title="Related products"
        products={related}
        viewAllHref={`/categories/${product.categorySlug}`}
        columns={4}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            sku: product.sku,
            brand: { '@type': 'Brand', name: product.brand },
            image: product.imageUrl ? [product.imageUrl] : undefined,
            description: product.shortDescription ?? undefined,
            offers: {
              '@type': 'Offer',
              url: `${siteConfig.url}/product/${product.slug}`,
              priceCurrency: 'NGN',
              price: product.price,
              availability:
                product.stockQuantity > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
              itemCondition:
                product.condition === 'NEW' ? 'https://schema.org/NewCondition' : 'https://schema.org/UsedCondition'
            },
            aggregateRating:
              product.ratingCount > 0
                ? {
                    '@type': 'AggregateRating',
                    ratingValue: product.ratingAverage,
                    reviewCount: product.ratingCount
                  }
                : undefined
          })
        }}
      />
    </div>
  );
}
