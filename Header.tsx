'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import {
  Search,
  User,
  Heart,
  ShoppingCart,
  Menu,
  X,
  Phone,
  Truck,
  ShieldCheck,
  LayoutGrid
} from 'lucide-react';
import { primaryNav } from '@/lib/site-config';
import { cn } from '@/lib/utils';

export function Header({
  cartCount = 0,
  wishlistCount = 0,
  phone = '0803 000 0000'
}: {
  cartCount?: number;
  wishlistCount?: number;
  phone?: string;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-bar">
      {/* Utility bar */}
      <div className="hidden bg-ink text-white md:block">
        <div className="shell flex h-9 items-center justify-between text-xs">
          <div className="flex items-center gap-6">
            <span className="inline-flex items-center gap-1.5">
              <Truck size={14} className="text-scarlet" aria-hidden />
              Nationwide delivery from our Nigerian warehouse
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-scarlet" aria-hidden />
              Warranty backed on every new unit
            </span>
          </div>
          <a href={`tel:${phone.replace(/\s/g, '')}`} className="inline-flex items-center gap-1.5 hover:text-brand-line">
            <Phone size={14} aria-hidden />
            {phone}
          </a>
        </div>
      </div>

      {/* Main bar */}
      <div className="shell flex h-[4.5rem] items-center gap-4">
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="-ml-2 rounded-card p-2 text-ink lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>

        <Link href="/" className="shrink-0" aria-label="Business-Hub Computers home">
          <Image
            src="/logo.jpeg"
            alt="Business-Hub Computers"
            width={220}
            height={52}
            priority
            className="h-9 w-auto md:h-11"
          />
        </Link>

        <form action="/shop" className="relative ml-2 hidden flex-1 md:block" role="search">
          <input
            type="search"
            name="q"
            placeholder="Search laptops, printers, SSDs, routers"
            className="h-11 w-full rounded-card border border-line bg-mist pl-4 pr-28 text-[0.9375rem] text-ink placeholder:text-slate focus:border-brand focus:bg-white"
          />
          <button
            type="submit"
            className="absolute right-1 top-1 inline-flex h-9 items-center gap-1.5 rounded-[0.5rem] bg-brand px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-soft"
          >
            <Search size={16} aria-hidden />
            Search
          </button>
        </form>

        <div className="ml-auto flex items-center gap-1 md:gap-2">
          <IconLink href="/account" label="Account" icon={<User size={21} />} />
          <IconLink href="/wishlist" label="Wishlist" icon={<Heart size={21} />} count={wishlistCount} />
          <IconLink href="/cart" label="Cart" icon={<ShoppingCart size={21} />} count={cartCount} accent />
        </div>
      </div>

      {/* Category and page navigation */}
      <nav className="hidden border-t border-line bg-white lg:block" aria-label="Primary">
        <div className="shell flex h-12 items-center gap-1">
          <Link
            href="/categories"
            className="mr-3 inline-flex h-12 items-center gap-2 border-b-2 border-scarlet px-1 text-sm font-bold tracking-wide text-ink"
          >
            <LayoutGrid size={17} aria-hidden />
            ALL CATEGORIES
          </Link>
          {primaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex h-12 items-center border-b-2 border-transparent px-3.5 text-sm font-semibold tracking-wide text-slate-deep transition-colors duration-150 hover:border-brand hover:text-brand"
            >
              {item.label}
            </Link>
          ))}
          <Link href="/deals" className="ml-auto text-sm font-semibold text-scarlet hover:underline">
            Today&apos;s deals
          </Link>
        </div>
      </nav>

      {/* Mobile search */}
      <div className="shell pb-3 md:hidden">
        <form action="/shop" className="relative" role="search">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate" aria-hidden />
          <input
            type="search"
            name="q"
            placeholder="Search products"
            className="h-11 w-full rounded-card border border-line bg-mist pl-10 pr-3 text-[0.9375rem] text-ink placeholder:text-slate focus:border-brand focus:bg-white"
          />
        </form>
      </div>

      {menuOpen ? <MobileMenu onClose={() => setMenuOpen(false)} /> : null}
    </header>
  );
}

function IconLink({
  href,
  label,
  icon,
  count = 0,
  accent = false
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  count?: number;
  accent?: boolean;
}) {
  return (
    <Link
      href={href}
      className="relative inline-flex h-11 items-center gap-2 rounded-card px-2.5 text-ink transition-colors duration-150 hover:bg-brand-tint hover:text-brand md:px-3"
    >
      {icon}
      <span className="hidden text-sm font-semibold lg:inline">{label}</span>
      {count > 0 ? (
        <span
          className={cn(
            'absolute left-6 top-1 min-w-[1.15rem] rounded-pill px-1 text-center text-2xs font-bold text-white md:left-7',
            accent ? 'bg-scarlet' : 'bg-brand'
          )}
        >
          {count > 99 ? '99+' : count}
        </span>
      ) : null}
    </Link>
  );
}

function MobileMenu({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-ink/50" onClick={onClose} aria-hidden />
      <div className="absolute inset-y-0 left-0 flex w-[19rem] max-w-[86%] flex-col bg-white">
        <div className="flex h-[4.5rem] items-center justify-between border-b border-line px-5">
          <Image src="/logo.jpeg" alt="Business-Hub Computers" width={180} height={44} className="h-8 w-auto" />
          <button type="button" onClick={onClose} className="rounded-card p-2 text-ink" aria-label="Close menu">
            <X size={22} />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto p-3" aria-label="Mobile">
          {primaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="block rounded-card px-3 py-3 text-[0.9375rem] font-semibold text-ink hover:bg-brand-tint"
            >
              {item.label}
            </Link>
          ))}
          <div className="my-3 border-t border-line" />
          <Link href="/account" onClick={onClose} className="block rounded-card px-3 py-3 text-[0.9375rem] font-semibold text-slate-deep hover:bg-brand-tint">
            My account
          </Link>
          <Link href="/account/orders" onClick={onClose} className="block rounded-card px-3 py-3 text-[0.9375rem] font-semibold text-slate-deep hover:bg-brand-tint">
            Track an order
          </Link>
        </nav>
        <div className="border-t border-line bg-mist p-5 text-sm text-slate">
          <p className="font-semibold text-ink">Need help choosing?</p>
          <p className="mt-1">Call our sales desk and we will match a system to your budget.</p>
        </div>
      </div>
    </div>
  );
}
