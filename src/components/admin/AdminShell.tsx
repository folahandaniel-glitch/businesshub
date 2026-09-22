import { AdminSidebar } from './AdminSidebar';
import { AdminTopbar } from './AdminTopbar';
import type { CurrentAdmin } from '@/lib/admin-permissions';

/**
 * Deliberately a plain presentational component, not a Next.js layout.
 * An earlier version used a route group (`(dashboard)`) with a shared
 * layout.tsx to apply this shell and the auth check in one place - that
 * pattern hit a known Vercel/Next.js output-tracing bug tied specifically
 * to parenthesized route group folders, which only surfaces during
 * Vercel's post-build file tracing step and is invisible to a local
 * `next build`. Every protected admin page now does its own auth check
 * (same proven pattern the customer /account pages already use) and
 * wraps its content with this component for the visual chrome only.
 */
export function AdminShell({ admin, children }: { admin: CurrentAdmin; children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-mist">
      <AdminSidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <AdminTopbar name={admin.fullName} role={admin.role} />
        <main className="flex-1 p-5 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
