'use client';

import { useState } from 'react';
import { Mail, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function subscribe() {
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setState('error');
      setMessage('Enter a valid email address, for example name@company.com.');
      return;
    }
    setState('sending');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (!res.ok) throw new Error();
      setState('done');
      setEmail('');
    } catch {
      setState('error');
      setMessage('That did not go through. Check your connection and try again.');
    }
  }

  return (
    <section className="shell pb-4">
      <div className="grid gap-6 rounded-card bg-brand px-6 py-8 text-white md:grid-cols-[1.1fr_1fr] md:items-center md:px-10">
        <div>
          <h2 className="flex items-center gap-2 font-display text-xl font-bold text-white md:text-2xl">
            <Mail size={22} aria-hidden />
            Price drops and new stock, straight to your inbox
          </h2>
          <p className="mt-2 max-w-md text-sm text-white/80">
            One email when prices move or fresh stock lands. No daily noise, and you can leave at any time.
          </p>
        </div>

        {state === 'done' ? (
          <p className="inline-flex items-center gap-2 rounded-card bg-white/15 px-4 py-3 text-sm font-semibold">
            <Check size={18} aria-hidden />
            You are subscribed. Watch your inbox.
          </p>
        ) : (
          <div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (state === 'error') setState('idle');
                }}
                placeholder="name@company.com"
                className="h-11 flex-1 rounded-card border border-white/25 bg-white/10 px-4 text-[0.9375rem] text-white placeholder:text-white/55 focus:border-white focus:bg-white/15"
              />
              <Button variant="accent" onClick={subscribe} disabled={state === 'sending'}>
                {state === 'sending' ? 'Subscribing' : 'Subscribe'}
              </Button>
            </div>
            {state === 'error' ? (
              <p className="mt-2 text-sm font-medium text-white" role="alert">
                {message}
              </p>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}
