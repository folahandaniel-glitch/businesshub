import type { Metadata } from 'next';
import { LoginForm } from '@/components/auth/LoginForm';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Sign in' };

export default function LoginPage() {
  return (
    <div className="shell flex justify-center py-14">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-extrabold text-ink">Sign in</h1>
        <p className="mt-2 text-sm text-slate">Access your orders, addresses and wishlist.</p>
        <div className="mt-7 rounded-card border border-line bg-white p-6">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
