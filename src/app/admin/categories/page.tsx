import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentAdmin, hasPermission } from '@/lib/admin-permissions';
import { AdminShell } from '@/components/admin/AdminShell';
import { CategoryTree } from '@/components/admin/categories/CategoryTree';
import { listCategoriesForAdmin, getCategoryOptions } from '@/lib/admin-categories';
import { PermissionKey } from '@prisma/client';

export const metadata: Metadata = { title: 'Categories', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function AdminCategoriesPage() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect('/admin/login');
  if (admin.mustChangePassword) redirect('/admin/change-password');

  const canView = await hasPermission(admin, PermissionKey.CATEGORY_MANAGEMENT, 'view');
  if (!canView) redirect('/admin');

  const [tree, options] = await Promise.all([listCategoriesForAdmin(), getCategoryOptions()]);

  return (
    <AdminShell admin={admin}>
      <h1 className="text-2xl font-extrabold text-ink">Categories</h1>
      <p className="mt-1 text-sm text-slate">Organise the catalogue into categories and subcategories.</p>

      <div className="mt-6">
        <CategoryTree tree={tree} options={options} />
      </div>
    </AdminShell>
  );
}
