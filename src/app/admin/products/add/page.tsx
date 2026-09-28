import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentAdmin, hasPermission } from '@/lib/admin-permissions';
import { AdminShell } from '@/components/admin/AdminShell';
import { ProductForm } from '@/components/admin/products/ProductForm';
import { getCategoryOptions } from '@/lib/admin-categories';

export const metadata: Metadata = { title: 'Add product', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function AdminAddProductPage() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect('/admin/login');
  if (admin.mustChangePassword) redirect('/admin/change-password');

  const canCreate = await hasPermission(admin, 'PRODUCT_MANAGEMENT', 'create');
  if (!canCreate) redirect('/admin/products');

  const categoryOptions = await getCategoryOptions();

  return (
    <AdminShell admin={admin}>
      <h1 className="text-2xl font-extrabold text-ink">Add product</h1>
      <p className="mt-1 text-sm text-slate">Fill in the details below to add a new product to the catalogue.</p>

      {categoryOptions.length === 0 ? (
        <p className="mt-6 rounded-card border border-dashed border-line bg-white p-6 text-sm text-slate">
          Create a category first before adding products.
        </p>
      ) : (
        <div className="mt-6">
          <ProductForm mode="create" categoryOptions={categoryOptions} />
        </div>
      )}
    </AdminShell>
  );
}
