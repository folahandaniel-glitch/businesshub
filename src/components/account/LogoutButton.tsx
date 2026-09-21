'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onClick() {
    setLoading(true);
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-card border border-line px-4 py-2.5 text-sm font-semibold text-ink hover:border-scarlet hover:text-scarlet"
    >
      <LogOut size={16} aria-hidden />
      {loading ? 'Signing out' : 'Sign out'}
    </button>
  );
}
