'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';

/**
 * Shared save behaviour for every settings form on this page: PATCH the
 * given endpoint, show a brief confirmation, and refresh the page so the
 * public site (which reads this same data) reflects the change on next
 * load without a full reload.
 */
export function useSettingsSave(endpoint: string) {
  const router = useRouter();
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [error, setError] = useState('');

  async function save(payload: unknown) {
    setStatus('saving');
    setError('');
    try {
      const res = await fetch(endpoint, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? 'Could not save.');
      setStatus('saved');
      router.refresh();
      window.setTimeout(() => setStatus('idle'), 2000);
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Could not save.');
    }
  }

  return { save, status, error };
}

export function SaveButton({ status }: { status: 'idle' | 'saving' | 'saved' | 'error' }) {
  return (
    <Button type="submit" disabled={status === 'saving'}>
      {status === 'saved' ? (
        <>
          <Check size={16} aria-hidden /> Saved
        </>
      ) : status === 'saving' ? (
        'Saving'
      ) : (
        'Save changes'
      )}
    </Button>
  );
}
