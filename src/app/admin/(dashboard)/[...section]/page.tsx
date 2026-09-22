import type { Metadata } from 'next';
import { Construction } from 'lucide-react';
import { findNavEntry } from '@/lib/admin-nav';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { section: string[] } }): Promise<Metadata> {
  const path = `/admin/${params.section.join('/')}`;
  const entry = findNavEntry(path);
  return { title: entry?.label ?? 'Admin', robots: { index: false, follow: false } };
}

export default function AdminSectionComingSoon({ params }: { params: { section: string[] } }) {
  const path = `/admin/${params.section.join('/')}`;
  const entry = findNavEntry(path);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <span className="grid h-14 w-14 place-items-center rounded-card bg-brand-tint text-brand" aria-hidden>
        <Construction size={26} />
      </span>
      <h1 className="mt-5 text-xl font-bold text-ink">{entry?.label ?? 'This section'} is being built</h1>
      <p className="mt-2.5 max-w-md text-sm leading-relaxed text-slate">
        This part of the admin backend is not wired up yet. Manage this data directly with the Prisma scripts and
        Prisma Studio in the meantime (<code className="rounded bg-mist px-1.5 py-0.5 text-xs">npm run db:studio</code>).
      </p>
      <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-brand">
        Arrives in {entry?.stage ?? 'a later stage'}
      </p>
    </div>
  );
}
