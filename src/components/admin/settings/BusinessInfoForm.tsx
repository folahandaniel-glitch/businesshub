'use client';

import { useState } from 'react';
import { useSettingsSave, SaveButton } from './SettingsForm';
import type { BusinessInfoValues } from '@/lib/admin-settings';

export function BusinessInfoForm({ initial }: { initial: BusinessInfoValues }) {
  const [values, setValues] = useState(initial);
  const { save, status, error } = useSettingsSave('/api/admin/settings/business');

  const inputClass = 'h-11 w-full rounded-card border border-line px-3.5 text-[0.9375rem] focus:border-brand';
  const labelClass = 'mb-1.5 block text-sm font-semibold text-ink';

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        save(values);
      }}
      className="rounded-card border border-line bg-white p-6"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Company name</label>
          <input
            value={values.companyName}
            onChange={(e) => setValues((v) => ({ ...v, companyName: e.target.value }))}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Registration number</label>
          <input
            value={values.registrationNumber}
            onChange={(e) => setValues((v) => ({ ...v, registrationNumber: e.target.value }))}
            className={inputClass}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Tagline</label>
          <input
            value={values.tagline}
            onChange={(e) => setValues((v) => ({ ...v, tagline: e.target.value }))}
            placeholder="Quality Technology. Trusted Service."
            className={inputClass}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Short description</label>
          <textarea
            rows={2}
            value={values.description}
            onChange={(e) => setValues((v) => ({ ...v, description: e.target.value }))}
            placeholder="Used in search results and social sharing previews."
            className="w-full rounded-card border border-line px-3.5 py-2.5 text-[0.9375rem] focus:border-brand"
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>About / why choose us</label>
          <textarea
            rows={4}
            value={values.aboutText}
            onChange={(e) => setValues((v) => ({ ...v, aboutText: e.target.value }))}
            placeholder="Shown on the About page."
            className="w-full rounded-card border border-line px-3.5 py-2.5 text-[0.9375rem] focus:border-brand"
          />
        </div>
        <div>
          <label className={labelClass}>Business hours</label>
          <input
            value={values.businessHours}
            onChange={(e) => setValues((v) => ({ ...v, businessHours: e.target.value }))}
            placeholder="Monday to Saturday, 8:00am to 6:00pm"
            className={inputClass}
          />
        </div>
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
