import type { Metadata } from 'next';
import { RegisterForm } from '@/components/auth/RegisterForm';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Create an account' };

export default function RegisterPage() {
  return (
    <div className="shell flex justify-center py-14">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-extrabold text-ink">Create your account</h1>
        <p className="mt-2 text-sm text-slate">Track orders and save products to a wishlist.</p>
        <div className="mt-7 rounded-card border border-line bg-white p-6">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
