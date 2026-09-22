import type { Metadata } from 'next';
import Image from 'next/image';
import { AdminLoginForm } from '@/components/admin/AdminLoginForm';

export const metadata: Metadata = { title: 'Admin sign in', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex justify-center">
          <div className="rounded-card bg-white p-3">
            <Image src="/logo.jpeg" alt="Business-Hub Computers" width={200} height={48} className="h-9 w-auto" />
          </div>
        </div>
        <div className="rounded-card border border-line bg-white p-6">
          <h1 className="text-xl font-bold text-ink">Admin sign in</h1>
          <p className="mt-1 text-sm text-slate">Authorised staff only.</p>
          <div className="mt-6">
            <AdminLoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
