import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentAdmin } from '@/lib/admin-permissions';
import { ChangePasswordForm } from '@/components/admin/ChangePasswordForm';

export const metadata: Metadata = { title: 'Change password', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function AdminChangePasswordPage() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect('/admin/login');

  return (
    <div className="flex min-h-screen items-center justify-center bg-mist px-4">
      <div className="w-full max-w-sm rounded-card border border-line bg-white p-6">
        <h1 className="text-xl font-bold text-ink">Change password</h1>
        <p className="mt-1 text-sm text-slate">Signed in as {admin.email}</p>
        <div className="mt-6">
          <ChangePasswordForm forced={admin.mustChangePassword} />
        </div>
      </div>
    </div>
  );
}
