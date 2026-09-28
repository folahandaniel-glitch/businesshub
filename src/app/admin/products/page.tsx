import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Plus } from 'lucide-react';
import { getCurrentAdmin, hasPermission } from '@/lib/admin-permissions';
import { AdminShell } from '@/components/admin/AdminShell';
import { ProductFilters } from '@/components/admin/products/ProductFilters';
import { ProductTable } from '@/components/admin/products/ProductTable';
import { Pagination } from '@/components/shop/Pagination';
import { ButtonLink } from '@/components/ui/Button';
import { listProductsForAdmin } from '@/lib/admin-products';
import { getCategoryOptions } from '@/lib/admin-categories';
import { ProductStatus } from '@prisma/client';

export const metadata: Metadata = { title: 'Products', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

const VALID_STATUSES: ProductStatus[] = [ProductStatus.DRAFT, ProductStatus.PUBLISHED, ProductStatus.ARCHIVED];

export default async function AdminProductsPage({
  searchParams
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect('/admin/login');
  if (admin.mustChangePassword) redirect('/admin/change-password');

  const canView = await hasPermission(admin, 'PRODUCT_MANAGEMENT', 'view');
  if (!canView) redirect('/admin');

  const get = (key: string) => (Array.isArray(searchParams[key]) ? searchParams[key]?.[0] : searchParams[key]);
  const statusParam = get('status');

  const [{ products, total, page, totalPages }, categoryOptions] = await Promise.all([
    listProductsForAdmin({
      q: get('q'),
      categoryId: get('category'),
      status: VALID_STATUSES.includes(statusParam as ProductStatus) ? (statusParam as ProductStatus) : undefined,
      page: get('page') ? Number(get('page')) : 1
    }),
    getCategoryOptions()
  ]);

  return (
    <AdminShell admin={admin}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-ink">Products</h1>
          <p className="mt-1 text-sm text-slate">{total} {total === 1 ? 'product' : 'products'} in the catalogue.</p>
        </div>
        <ButtonLink href="/admin/products/add">
          <Plus size={16} aria-hidden />
          Add product
        </ButtonLink>
      </div>

      <div className="mt-6">
        <ProductFilters categoryOptions={categoryOptions} />
        <ProductTable products={products} />
        <Pagination page={page} totalPages={totalPages} />
      </div>
    </AdminShell>
  );
}
