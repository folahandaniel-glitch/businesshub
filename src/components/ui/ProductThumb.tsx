import Image from 'next/image';
import { Monitor } from 'lucide-react';

/**
 * Product imagery with a branded fallback, so a catalogue entry that
 * has not been photographed yet still renders cleanly instead of
 * leaving a broken frame on the page.
 */
export function ProductThumb({
  src,
  alt,
  sizes = '(max-width: 768px) 50vw, 260px'
}: {
  src: string | null;
  alt: string;
  sizes?: string;
}) {
  if (!src) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-mist text-brand-line">
        <Monitor size={40} strokeWidth={1.25} aria-hidden />
        <span className="text-2xs font-semibold text-slate">Image coming soon</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      className="object-contain p-4 transition-transform duration-300 ease-swift group-hover:scale-[1.04]"
    />
  );
}
