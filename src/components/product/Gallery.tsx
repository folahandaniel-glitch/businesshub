'use client';

import { useState } from 'react';
import { ProductThumb } from '@/components/ui/ProductThumb';
import { cn } from '@/lib/utils';

export function Gallery({ images, name }: { images: { url: string; altText: string | null }[]; name: string }) {
  const [active, setActive] = useState(0);
  const shown = images.length > 0 ? images : [{ url: '', altText: name }];

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-card border border-line bg-white">
        <ProductThumb src={shown[active]?.url || null} alt={shown[active]?.altText ?? name} sizes="(max-width: 1024px) 90vw, 560px" />
      </div>

      {images.length > 1 ? (
        <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar">
          {images.map((img, i) => (
            <button
              key={img.url + i}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                'relative h-16 w-16 shrink-0 overflow-hidden rounded-card border-2 bg-white',
                i === active ? 'border-brand' : 'border-line'
              )}
              aria-label={`View image ${i + 1}`}
              aria-current={i === active}
            >
              <ProductThumb src={img.url} alt={img.altText ?? `${name} thumbnail ${i + 1}`} sizes="64px" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
