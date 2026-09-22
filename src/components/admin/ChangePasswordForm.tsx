'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export function ChangePasswordForm({ forced = false }: { forced?: boolean }) {
  const router = useRouter();
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const form = new FormData(e.currentTarget);
    const currentPassword = form.get('currentPassword');
    const newPassword = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');

    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/admin/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? 'Could not update your password.');

      setDone(true);
      window.setTimeout(() => {
        router.push('/admin');
        router.refresh();
      }, 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update your password.');
      setLoading(false);
    }
  }

  if (done) {
    return <p className="text-sm font-semibold text-success">Password updated. Redirecting to the dashboard...</p>;
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {forced ? (
        <p className="rounded-card bg-brand-tint px-4 py-3 text-sm text-brand">
          This account was created with a temporary password. Set a new one to continue.
        </p>
      ) : null}

      <div>
        <label htmlFor="currentPassword" className="mb-1.5 block text-sm font-semibold text-ink">
          Current password
        </label>
        <input
          id="currentPassword"
          name="currentPassword"
          type="password"
          required
          autoComplete="current-password"
          className="h-11 w-full rounded-card border border-line px-3.5 text-[0.9375rem] text-ink focus:border-brand"
        />
      </div>
      <div>
        <label htmlFor="newPassword" className="mb-1.5 block text-sm font-semibold text-ink">
          New password
        </label>
        <input
          id="newPassword"
          name="newPassword"
          type="password"
          required
          minLength={12}
          autoComplete="new-password"
          className="h-11 w-full rounded-card border border-line px-3.5 text-[0.9375rem] text-ink focus:border-brand"
        />
        <p className="mt-1.5 text-xs text-slate">At least 12 characters.</p>
      </div>
      <div>
        <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-semibold text-ink">
          Confirm new password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          minLength={12}
          autoComplete="new-password"
          className="h-11 w-full rounded-card border border-line px-3.5 text-[0.9375rem] text-ink focus:border-brand"
        />
      </div>

      {error ? (
        <p className="text-sm font-medium text-scarlet" role="alert">
          {error}
        </p>
      ) : null}

      <Button type="submit" size="lg" disabled={loading} className="w-full">
        {loading ? 'Updating' : 'Update password'}
      </Button>
    </form>
  );
}
