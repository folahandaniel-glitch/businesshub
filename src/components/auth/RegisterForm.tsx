'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const data = Object.fromEntries(new FormData(e.currentTarget).entries());

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? 'Could not create your account.');

      router.push(searchParams.get('next') || '/account');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create your account.');
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="fullName" className="mb-1.5 block text-sm font-semibold text-ink">
          Full name
        </label>
        <input
          id="fullName"
          name="fullName"
          required
          autoComplete="name"
          className="h-11 w-full rounded-card border border-line px-3.5 text-[0.9375rem] text-ink focus:border-brand"
        />
      </div>
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-ink">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="h-11 w-full rounded-card border border-line px-3.5 text-[0.9375rem] text-ink focus:border-brand"
        />
      </div>
      <div>
        <label htmlFor="phone" className="mb-1.5 block text-sm font-semibold text-ink">
          Phone number
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          autoComplete="tel"
          className="h-11 w-full rounded-card border border-line px-3.5 text-[0.9375rem] text-ink focus:border-brand"
        />
      </div>
      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-ink">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="h-11 w-full rounded-card border border-line px-3.5 text-[0.9375rem] text-ink focus:border-brand"
        />
        <p className="mt-1.5 text-xs text-slate">At least 8 characters.</p>
      </div>

      {error ? (
        <p className="text-sm font-medium text-scarlet" role="alert">
          {error}
        </p>
      ) : null}

      <Button type="submit" size="lg" disabled={loading} className="w-full">
        {loading ? 'Creating account' : 'Create account'}
      </Button>

      <p className="text-center text-sm text-slate">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-brand hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
