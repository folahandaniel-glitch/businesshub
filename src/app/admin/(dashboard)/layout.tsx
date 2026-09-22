import { redirect } from 'next/navigation';
import { getCurrentAdmin } from '@/lib/admin-permissions';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminTopbar } from '@/components/admin/AdminTopbar';

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect('/admin/login');
  if (admin.mustChangePassword) redirect('/admin/change-password');

  return (
    <div className="flex min-h-screen bg-mist">
      <AdminSidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <AdminTopbar name={admin.fullName} role={admin.role} />
        <main className="flex-1 p-5 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
