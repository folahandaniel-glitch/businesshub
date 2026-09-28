import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentAdmin, hasPermission } from '@/lib/admin-permissions';
import { AdminShell } from '@/components/admin/AdminShell';
import { ContactInfoForm } from '@/components/admin/settings/ContactInfoForm';
import { getContactInfo } from '@/lib/admin-settings';
import { PermissionKey } from '@prisma/client';

export const metadata: Metadata = { title: 'Contact information', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function AdminContactInfoPage() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect('/admin/login');
  if (admin.mustChangePassword) redirect('/admin/change-password');

  const canView = await hasPermission(admin, PermissionKey.CONTENT_MANAGEMENT, 'view');
  if (!canView) redirect('/admin');

  const info = await getContactInfo();

  return (
    <AdminShell admin={admin}>
      <h1 className="text-2xl font-extrabold text-ink">Contact information</h1>
      <p className="mt-1 text-sm text-slate">Shown in the site footer, Contact page and About page.</p>
      <div className="mt-6 max-w-2xl">
        <ContactInfoForm initial={info} />
      </div>
    </AdminShell>
  );
}
