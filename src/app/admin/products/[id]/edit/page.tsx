import type { Metadata } from 'next';
import { redirect, notFound } from 'next/navigation';
import { getCurrentAdmin, hasPermission } from '@/lib/admin-permissions';
import { AdminShell } from '@/components/admin/AdminShell';
import { ProductForm } from '@/components/admin/products/ProductForm';
import { getProductForEdit } from '@/lib/admin-products';
import { getCategoryOptions } from '@/lib/admin-categories';

export const metadata: Metadata = { title: 'Edit product', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function AdminEditProductPage({ params }: { params: { id: string } }) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect('/admin/login');
  if (admin.mustChangePassword) redirect('/admin/change-password');

  const canEdit = await hasPermission(admin, 'PRODUCT_MANAGEMENT', 'edit');
  if (!canEdit) redirect('/admin/products');

  const [product, categoryOptions] = await Promise.all([getProductForEdit(params.id), getCategoryOptions()]);
  if (!product) notFound();

  return (
    <AdminShell admin={admin}>
      <h1 className="text-2xl font-extrabold text-ink">Edit product</h1>
      <p className="mt-1 text-sm text-slate">{product.name}</p>

      <div className="mt-6">
        <ProductForm mode="edit" productId={product.id} initial={product} categoryOptions={categoryOptions} />
      </div>
    </AdminShell>
  );
}
