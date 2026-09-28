'use client';

import { useState } from 'react';
import { useSettingsSave, SaveButton } from './SettingsForm';
import type { SocialLinkValue } from '@/lib/admin-settings';

export function SocialLinksForm({ initial }: { initial: SocialLinkValue[] }) {
  const [links, setLinks] = useState(initial);
  const { save, status, error } = useSettingsSave('/api/admin/settings/social');

  function updateLink(id: string, field: 'url' | 'isActive', value: string | boolean) {
    setLinks((prev) => prev.map((l) => (l.id === id ? { ...l, [field]: value } : l)));
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        save({ links: links.map((l) => ({ id: l.id, url: l.url, isActive: l.isActive })) });
      }}
      className="rounded-card border border-line bg-white p-6"
    >
      <div className="space-y-3">
        {links.map((link) => (
          <div key={link.id} className="flex items-center gap-3">
            <span className="w-24 shrink-0 text-sm font-semibold text-ink">{link.platform}</span>
            <input
              value={link.url}
              onChange={(e) => updateLink(link.id, 'url', e.target.value)}
              placeholder={`https://...`}
              className="h-10 flex-1 rounded-card border border-line px-3.5 text-sm focus:border-brand"
            />
            <label className="flex shrink-0 items-center gap-1.5 text-xs text-slate">
              <input
                type="checkbox"
                checked={link.isActive}
                onChange={(e) => updateLink(link.id, 'isActive', e.target.checked)}
                className="h-4 w-4 rounded border-line text-brand"
              />
              Show
            </label>
          </div>
        ))}
      </div>

      {error ? (
        <p className="mt-4 text-sm font-medium text-scarlet" role="alert">
          {error}
        </p>
      ) : null}

      <div className="mt-5 flex justify-end">
        <SaveButton status={status} />
      </div>
    </form>
  );
}
