'use client';

import { useState } from 'react';
import { useSettingsSave, SaveButton } from './SettingsForm';
import type { ContactInfoValues } from '@/lib/admin-settings';

export function ContactInfoForm({ initial }: { initial: ContactInfoValues }) {
  const [values, setValues] = useState(initial);
  const { save, status, error } = useSettingsSave('/api/admin/settings/contact');

  const inputClass = 'h-11 w-full rounded-card border border-line px-3.5 text-[0.9375rem] focus:border-brand';
  const labelClass = 'mb-1.5 block text-sm font-semibold text-ink';

  function field(key: keyof ContactInfoValues, label: string, placeholder = '') {
    return (
      <div>
        <label className={labelClass}>{label}</label>
        <input
          value={values[key]}
          onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
          placeholder={placeholder}
          className={inputClass}
        />
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        save(values);
      }}
      className="rounded-card border border-line bg-white p-6"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {field('primaryPhone', 'Primary phone')}
        {field('secondaryPhone', 'Secondary phone')}
        {field('whatsappNumber', 'WhatsApp number')}
        {field('email', 'Email address')}
        {field('supportEmail', 'Support email')}
        {field('openingHours', 'Opening hours')}
        <div className="sm:col-span-2">
          <label className={labelClass}>Main address</label>
          <textarea
            rows={2}
            value={values.address}
            onChange={(e) => setValues((v) => ({ ...v, address: e.target.value }))}
            className="w-full rounded-card border border-line px-3.5 py-2.5 text-[0.9375rem] focus:border-brand"
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Branch address</label>
          <textarea
            rows={2}
            value={values.branchAddress}
            onChange={(e) => setValues((v) => ({ ...v, branchAddress: e.target.value }))}
            className="w-full rounded-card border border-line px-3.5 py-2.5 text-[0.9375rem] focus:border-brand"
          />
        </div>
        <div className="sm:col-span-2">{field('mapsLink', 'Google Maps link')}</div>
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
