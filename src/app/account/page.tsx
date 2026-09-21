import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { PackageSearch, Heart, MapPin } from 'lucide-react';
import { LogoutButton } from '@/components/account/LogoutButton';
import { getCurrentCustomer } from '@/lib/orders';
import { formatDate } from '@/lib/utils';

export const metadata: Metadata = { title: 'My account' };
export const dynamic = 'force-dynamic';

export default async function AccountPage() {
  const customer = await getCurrentCustomer();
  if (!customer) redirect('/login?next=/account');

  return (
    <div className="shell py-8 md:py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="rule-heading text-2xl md:text-3xl">Hi, {customer.fullName.split(' ')[0]}</h1>
          <p className="mt-2 text-sm text-slate">
            {customer.email} · Member since {formatDate(customer.createdAt)}
          </p>
        </div>
        <LogoutButton />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <AccountLink href="/account/orders" icon={<PackageSearch size={22} />} title="Your orders" body="Track and review past orders" />
        <AccountLink href="/wishlist" icon={<Heart size={22} />} title="Wishlist" body="Products you have saved" />
        <AccountLink href="/account" icon={<MapPin size={22} />} title="Addresses" body="Saved delivery addresses" disabled />
      </div>
    </div>
  );
}

function AccountLink({
  href,
  icon,
  title,
  body,
  disabled = false
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  body: string;
  disabled?: boolean;
}) {
  const content = (
    <div className="rounded-card border border-line bg-white p-6 transition-colors hover:border-brand">
      <span className="inline-grid h-11 w-11 place-items-center rounded-card bg-brand-tint text-brand" aria-hidden>
        {icon}
      </span>
      <h2 className="mt-4 text-base font-bold text-ink">{title}</h2>
      <p className="mt-1.5 text-sm text-slate">{body}</p>
      {disabled ? <p className="mt-2 text-xs font-semibold text-brand">Coming soon</p> : null}
    </div>
  );
  return disabled ? content : <Link href={href}>{content}</Link>;
}
