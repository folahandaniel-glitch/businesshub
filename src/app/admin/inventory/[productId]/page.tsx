import type { Metadata } from 'next';
import { redirect, notFound } from 'next/navigation';
import { PackageSearch } from 'lucide-react';
import { getCurrentAdmin, hasPermission } from '@/lib/admin-permissions';
import { AdminShell } from '@/components/admin/AdminShell';
import { Badge } from '@/components/ui/Badge';
import { getInventoryHistory } from '@/lib/admin-inventory';
import { formatDate } from '@/lib/utils';

export const metadata: Metadata = { title: 'Stock history', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

const ACTION_LABEL: Record<string, string> = {
  STOCK_IN: 'Stock in',
  SALE: 'Sale',
  RETURN: 'Return',
  ADJUSTMENT: 'Adjustment',
  DAMAGE: 'Damage / loss'
};

const ACTION_TONE: Record<string, 'success' | 'brand' | 'warning' | 'danger' | 'neutral'> = {
  STOCK_IN: 'success',
  SALE: 'brand',
  RETURN: 'neutral',
  ADJUSTMENT: 'warning',
  DAMAGE: 'danger'
};

export default async function InventoryHistoryPage({ params }: { params: { productId: string } }) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect('/admin/login');
  if (admin.mustChangePassword) redirect('/admin/change-password');

  const canView = await hasPermission(admin, 'INVENTORY_MANAGEMENT', 'view');
  if (!canView) redirect('/admin');

  const history = await getInventoryHistory(params.productId);
  if (!history) notFound();

  return (
    <AdminShell admin={admin}>
      <h1 className="text-2xl font-extrabold text-ink">{history.productName}</h1>
      <p className="mt-1 text-sm text-slate">
        SKU: {history.sku} &middot; {history.stockQuantity} currently in stock &middot; low stock threshold {history.minStockLevel}
      </p>

      <div className="mt-6 overflow-hidden rounded-card border border-line bg-white">
        {history.entries.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-14 text-center">
            <PackageSearch size={28} className="text-brand-line" strokeWidth={1.25} aria-hidden />
            <p className="text-sm text-slate">No stock movements recorded yet.</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-mist text-xs uppercase tracking-wide text-slate">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Reason</th>
                <th className="px-4 py-3">Change</th>
                <th className="px-4 py-3">Balance after</th>
                <th className="px-4 py-3">Note</th>
                <th className="px-4 py-3">By</th>
              </tr>
            </thead>
            <tbody>
              {history.entries.map((entry) => (
                <tr key={entry.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 text-slate-deep">{formatDate(entry.createdAt, true)}</td>
                  <td className="px-4 py-3">
                    <Badge tone={ACTION_TONE[entry.action] ?? 'neutral'}>{ACTION_LABEL[entry.action] ?? entry.action}</Badge>
                  </td>
                  <td className={`px-4 py-3 font-semibold ${entry.quantity >= 0 ? 'text-success' : 'text-scarlet'}`}>
                    {entry.quantity >= 0 ? '+' : ''}
                    {entry.quantity}
                  </td>
                  <td className="px-4 py-3 text-ink">{entry.balanceAfter}</td>
                  <td className="px-4 py-3 text-slate-deep">{entry.note ?? entry.reference ?? '-'}</td>
                  <td className="px-4 py-3 text-slate-deep">{entry.adminLabel ?? 'System'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminShell>
  );
}
