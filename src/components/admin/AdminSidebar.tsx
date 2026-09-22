'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Megaphone,
  BarChart3,
  Globe,
  Bell,
  ScrollText,
  Settings,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import { ADMIN_NAV, isLeaf } from '@/lib/admin-nav';
import { cn } from '@/lib/utils';

const ICONS: Record<string, React.ReactNode> = {
  Package: <Package size={17} />,
  ShoppingBag: <ShoppingBag size={17} />,
  Users: <Users size={17} />,
  Megaphone: <Megaphone size={17} />,
  BarChart3: <BarChart3 size={17} />,
  Globe: <Globe size={17} />
};

function NavContent({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  const [openGroup, setOpenGroup] = useState<string | null>(
    ADMIN_NAV.find((e) => !isLeaf(e) && e.items.some((i) => pathname.startsWith(i.href)))?.label ?? null
  );

  return (
    <nav className="flex-1 space-y-1 overflow-y-auto p-3">
      <Link
        href="/admin"
        onClick={onNavigate}
        className={cn(
          'flex items-center gap-2.5 rounded-card px-3 py-2.5 text-sm font-semibold transition-colors',
          pathname === '/admin' ? 'bg-brand text-white' : 'text-slate-deep hover:bg-mist'
        )}
      >
        <LayoutDashboard size={17} />
        Dashboard
      </Link>

      {ADMIN_NAV.filter((e) => !isLeaf(e) || e.href !== '/admin').map((entry) =>
        isLeaf(entry) ? (
          <Link
            key={entry.href}
            href={entry.href}
            onClick={onNavigate}
            className={cn(
              'flex items-center gap-2.5 rounded-card px-3 py-2.5 text-sm font-semibold transition-colors',
              pathname === entry.href ? 'bg-brand text-white' : 'text-slate-deep hover:bg-mist'
            )}
          >
            {entry.label}
          </Link>
        ) : (
          <div key={entry.label}>
            <button
              type="button"
              onClick={() => setOpenGroup(openGroup === entry.label ? null : entry.label)}
              className="flex w-full items-center justify-between rounded-card px-3 py-2.5 text-sm font-semibold text-slate-deep hover:bg-mist"
            >
              <span className="flex items-center gap-2.5">
                {ICONS[entry.icon]}
                {entry.label}
              </span>
              <ChevronDown
                size={15}
                className={cn('transition-transform', openGroup === entry.label && 'rotate-180')}
              />
            </button>
            {openGroup === entry.label ? (
              <div className="ml-4 mt-1 space-y-1 border-l border-line pl-3">
                {entry.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      'block rounded-card px-3 py-2 text-sm transition-colors',
                      pathname === item.href
                        ? 'bg-brand-tint font-semibold text-brand'
                        : 'text-slate hover:bg-mist hover:text-ink'
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        )
      )}

      <div className="my-2 border-t border-line" />
      <Link
        href="/admin/notifications"
        onClick={onNavigate}
        className={cn(
          'flex items-center gap-2.5 rounded-card px-3 py-2.5 text-sm font-semibold transition-colors',
          pathname === '/admin/notifications' ? 'bg-brand text-white' : 'text-slate-deep hover:bg-mist'
        )}
      >
        <Bell size={17} />
        Notifications
      </Link>
      <Link
        href="/admin/audit-logs"
        onClick={onNavigate}
        className={cn(
          'flex items-center gap-2.5 rounded-card px-3 py-2.5 text-sm font-semibold transition-colors',
          pathname === '/admin/audit-logs' ? 'bg-brand text-white' : 'text-slate-deep hover:bg-mist'
        )}
      >
        <ScrollText size={17} />
        Audit Logs
      </Link>
      <Link
        href="/admin/settings"
        onClick={onNavigate}
        className={cn(
          'flex items-center gap-2.5 rounded-card px-3 py-2.5 text-sm font-semibold transition-colors',
          pathname === '/admin/settings' ? 'bg-brand text-white' : 'text-slate-deep hover:bg-mist'
        )}
      >
        <Settings size={17} />
        Settings
      </Link>
    </nav>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-40 grid h-10 w-10 place-items-center rounded-card border border-line bg-white text-ink shadow-card lg:hidden"
        aria-label="Open admin menu"
      >
        <Menu size={20} />
      </button>

      <aside className="hidden w-64 shrink-0 flex-col border-r border-line bg-white lg:flex">
        <div className="flex h-16 items-center border-b border-line px-5">
          <Image src="/logo.jpeg" alt="Business-Hub Computers" width={160} height={38} className="h-8 w-auto" />
        </div>
        <NavContent pathname={pathname} />
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink/50" onClick={() => setMobileOpen(false)} aria-hidden />
          <div className="absolute inset-y-0 left-0 flex w-72 max-w-[85%] flex-col bg-white">
            <div className="flex h-16 items-center justify-between border-b border-line px-5">
              <Image src="/logo.jpeg" alt="Business-Hub Computers" width={150} height={36} className="h-7 w-auto" />
              <button type="button" onClick={() => setMobileOpen(false)} aria-label="Close menu" className="p-1 text-ink">
                <X size={22} />
              </button>
            </div>
            <NavContent pathname={pathname} onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      ) : null}
    </>
  );
}
