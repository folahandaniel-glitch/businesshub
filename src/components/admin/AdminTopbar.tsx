'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export function AdminTopbar({ name, role }: { name: string; role: 'SUPER_ADMIN' | 'ADMIN' }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onSignOut() {
    setLoading(true);
    await fetch('/api/admin/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-line bg-white px-5 lg:px-6">
      <div className="pl-12 lg:pl-0">
        <p className="text-sm font-bold text-ink">{name}</p>
        <div className="mt-0.5 flex items-center gap-1.5">
          <ShieldCheck size={13} className="text-brand" aria-hidden />
          <Badge tone={role === 'SUPER_ADMIN' ? 'sale' : 'brand'}>
            {role === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin'}
          </Badge>
        </div>
      </div>

      <button
        type="button"
        onClick={onSignOut}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-card border border-line px-3.5 py-2 text-sm font-semibold text-ink hover:border-scarlet hover:text-scarlet"
      >
        <LogOut size={15} aria-hidden />
        {loading ? 'Signing out' : 'Sign out'}
      </button>
    </header>
  );
}
