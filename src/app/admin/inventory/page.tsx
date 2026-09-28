import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Search } from 'lucide-react';
import { getCurrentAdmin, hasPermission } from '@/lib/admin-permissions';
import { AdminShell } from '@/components/admin/AdminShell';
import { InventoryTable } from '@/components/admin/inventory/InventoryTable';
import { Pagination } from '@/components/shop/Pagination';
import { listInventory } from '@/lib/admin-inventory';
import { StockStatus } from '@prisma/client';

export const metadata: Metadata = { title: 'Inventory', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

const VALID_STATUSES: StockStatus[] = [StockStatus.IN_STOCK, StockStatus.LOW_STOCK, StockStatus.OUT_OF_STOCK];

export default async function AdminInventoryPage({
  searchParams
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect('/admin/login');
  if (admin.mustChangePassword) redirect('/admin/change-password');

  const canView = await hasPermission(admin, 'INVENTORY_MANAGEMENT', 'view');
  if (!canView) redirect('/admin');

  const get = (key: string) => (Array.isArray(searchParams[key]) ? searchParams[key]?.[0] : searchParams[key]);
  const statusParam = get('status');

  const { items, total, page, totalPages } = await listInventory({
    q: get('q'),
    stockStatus: VALID_STATUSES.includes(statusParam as StockStatus) ? (statusParam as StockStatus) : undefined,
    page: get('page') ? Number(get('page')) : 1
  });

  return (
    <AdminShell admin={admin}>
      <h1 className="text-2xl font-extrabold text-ink">Inventory</h1>
      <p className="mt-1 text-sm text-slate">{total} {total === 1 ? 'product' : 'products'}, sorted by lowest stock first.</p>

      <form className="mt-6 mb-5 flex flex-wrap items-center gap-3" method="get">
        <div className="relative flex-1 min-w-[16rem]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate" aria-hidden />
          <input
            name="q"
            defaultValue={get('q') ?? ''}
            placeholder="Search by name or SKU"
            className="h-10 w-full rounded-card border border-line pl-9 pr-3 text-sm focus:border-brand"
          />
        </div>
        <select name="status" defaultValue={get('status') ?? ''} className="h-10 rounded-card border border-line px-3 text-sm focus:border-brand">
          <option value="">All stock levels</option>
          <option value="IN_STOCK">In stock</option>
          <option value="LOW_STOCK">Low stock</option>
          <option value="OUT_OF_STOCK">Out of stock</option>
        </select>
        <button type="submit" className="h-10 rounded-card bg-brand px-4 text-sm font-semibold text-white hover:bg-brand-soft">
          Filter
        </button>
      </form>

      <InventoryTable items={items} />
      <Pagination page={page} totalPages={totalPages} />
    </AdminShell>
  );
}
