import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentAdmin, hasPermission } from '@/lib/admin-permissions';
import { AdminShell } from '@/components/admin/AdminShell';
import { BusinessInfoForm } from '@/components/admin/settings/BusinessInfoForm';
import { getBusinessInfo } from '@/lib/admin-settings';
import { PermissionKey } from '@prisma/client';

export const metadata: Metadata = { title: 'Business information', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function AdminBusinessInfoPage() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect('/admin/login');
  if (admin.mustChangePassword) redirect('/admin/change-password');

  const canView = await hasPermission(admin, PermissionKey.CONTENT_MANAGEMENT, 'view');
  if (!canView) redirect('/admin');

  const info = await getBusinessInfo();

  return (
    <AdminShell admin={admin}>
      <h1 className="text-2xl font-extrabold text-ink">Business information</h1>
      <p className="mt-1 text-sm text-slate">Shown on the About page and used across the site.</p>
      <div className="mt-6 max-w-2xl">
        <BusinessInfoForm initial={info} />
      </div>
    </AdminShell>
  );
}
