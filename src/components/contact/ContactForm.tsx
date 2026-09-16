'use client';

import { useState } from 'react';
import { Check, Send } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    setStatus('sending');
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? 'Something went wrong.');
      }
      setStatus('done');
      form.reset();
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    }
  }

  if (status === 'done') {
    return (
      <div className="flex items-start gap-3 rounded-card border border-emerald-200 bg-emerald-50 p-5">
        <Check size={20} className="mt-0.5 shrink-0 text-success" aria-hidden />
        <div>
          <p className="font-semibold text-ink">Message sent</p>
          <p className="mt-1 text-sm text-slate-deep">
            Thank you for reaching out. Our team will respond to the email address you provided.
          </p>
          <button
            type="button"
            onClick={() => setStatus('idle')}
            className="mt-3 text-sm font-semibold text-brand hover:underline"
          >
            Send another message
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" name="fullName" required autoComplete="name" />
        <Field label="Email address" name="email" type="email" required autoComplete="email" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Phone number" name="phone" type="tel" autoComplete="tel" />
        <Field label="Subject" name="subject" />
      </div>
      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-semibold text-ink">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          minLength={10}
          rows={5}
          className="w-full rounded-card border border-line px-3.5 py-2.5 text-[0.9375rem] text-ink focus:border-brand"
          placeholder="Tell us what you need, including quantity if this is a bulk or corporate order."
        />
      </div>

      {status === 'error' ? (
        <p className="text-sm font-medium text-scarlet" role="alert">
          {error}
        </p>
      ) : null}

      <Button type="submit" size="lg" disabled={status === 'sending'}>
        <Send size={17} aria-hidden />
        {status === 'sending' ? 'Sending' : 'Send message'}
      </Button>
    </form>
  );
}

function Field({
  label,
  name,
  type = 'text',
  required = false,
  autoComplete
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-semibold text-ink">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className="h-11 w-full rounded-card border border-line px-3.5 text-[0.9375rem] text-ink focus:border-brand"
      />
    </div>
  );
}
