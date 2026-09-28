import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentAdmin, hasPermission } from '@/lib/admin-permissions';
import { AdminShell } from '@/components/admin/AdminShell';
import { SocialLinksForm } from '@/components/admin/settings/SocialLinksForm';
import { listSocialLinks } from '@/lib/admin-settings';
import { PermissionKey } from '@prisma/client';

export const metadata: Metadata = { title: 'Social media', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function AdminSocialMediaPage() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect('/admin/login');
  if (admin.mustChangePassword) redirect('/admin/change-password');

  const canView = await hasPermission(admin, PermissionKey.CONTENT_MANAGEMENT, 'view');
  if (!canView) redirect('/admin');

  const links = await listSocialLinks();

  return (
    <AdminShell admin={admin}>
      <h1 className="text-2xl font-extrabold text-ink">Social media</h1>
      <p className="mt-1 text-sm text-slate">Links shown in the site footer. Leave a link blank to hide it.</p>
      <div className="mt-6 max-w-2xl">
        <SocialLinksForm initial={links} />
      </div>
    </AdminShell>
  );
}
