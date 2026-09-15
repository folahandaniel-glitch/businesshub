import { Quote } from 'lucide-react';
import { Rating } from '@/components/ui/Rating';

export type Testimonial = {
  id: string;
  authorName: string;
  rating: number;
  title: string | null;
  body: string;
};

/**
 * Only approved, admin-featured reviews reach this section, and the
 * section disappears entirely when there are none. No placeholder
 * praise is ever shown.
 */
export function Testimonials({ items }: { items: Testimonial[] }) {
  if (items.length === 0) return null;

  return (
    <section className="bg-white py-10 md:py-14">
      <div className="shell">
        <h2 className="rule-heading">What our customers say</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {items.map((t) => (
            <figure key={t.id} className="rounded-card border border-line bg-mist p-6">
              <Quote size={22} className="text-scarlet" aria-hidden />
              <Rating value={t.rating} size={14} />
              {t.title ? <figcaption className="mt-3 text-sm font-bold text-ink">{t.title}</figcaption> : null}
              <blockquote className="mt-2 text-sm leading-relaxed text-slate-deep">{t.body}</blockquote>
              <p className="mt-4 text-xs font-semibold text-slate">{t.authorName}</p>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
