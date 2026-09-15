import Link from 'next/link';
import { Heart, ShoppingCart } from 'lucide-react';
import { ProductThumb } from '@/components/ui/ProductThumb';
import { Badge } from '@/components/ui/Badge';
import { Rating } from '@/components/ui/Rating';
import { Price } from '@/components/ui/Price';
import { StockPill } from '@/components/ui/StockPill';
import { discountPercent, cn } from '@/lib/utils';
import type { ProductCardData } from '@/lib/queries';

export function ProductCard({ product, className }: { product: ProductCardData; className?: string }) {
  const off = discountPercent(product.price, product.previousPrice);
  const soldOut = product.stockQuantity <= 0;

  return (
    <article
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-card border border-line bg-white transition-shadow duration-200 ease-swift hover:shadow-lift',
        className
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden border-b border-line bg-white">
        <ProductThumb src={product.imageUrl} alt={product.name} />

        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {off > 0 ? <Badge tone="sale">{off}% off</Badge> : null}
          {product.isNewArrival ? <Badge tone="brand">New arrival</Badge> : null}
          {product.condition === 'REFURBISHED' ? <Badge tone="neutral">Refurbished</Badge> : null}
        </div>

        <button
          type="button"
          aria-label={`Add ${product.name} to wishlist`}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-pill border border-line bg-white text-slate transition-colors hover:border-scarlet hover:text-scarlet"
        >
          <Heart size={17} />
        </button>

        {soldOut ? (
          <div className="absolute inset-x-0 bottom-0 bg-ink/85 py-1.5 text-center text-xs font-semibold text-white">
            Currently out of stock
          </div>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs font-semibold text-brand">{product.brand}</p>

        <h3 className="text-[0.9375rem] font-semibold leading-snug text-ink">
          <Link href={`/product/${product.slug}`} className="line-clamp-2 after:absolute after:inset-0 hover:text-brand">
            {product.name}
          </Link>
        </h3>

        <Rating value={product.ratingAverage} count={product.ratingCount} />

        <div className="mt-auto space-y-3 pt-1">
          <Price price={product.price} previousPrice={product.previousPrice} />
          <div className="flex items-center justify-between gap-2">
            <StockPill quantity={product.stockQuantity} minStockLevel={product.minStockLevel} />
            <button
              type="button"
              disabled={soldOut}
              aria-label={`Add ${product.name} to cart`}
              className="relative z-10 inline-flex h-9 items-center gap-1.5 rounded-card bg-brand px-3 text-sm font-semibold text-white transition-colors hover:bg-brand-soft disabled:bg-line disabled:text-slate"
            >
              <ShoppingCart size={15} aria-hidden />
              Add
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
