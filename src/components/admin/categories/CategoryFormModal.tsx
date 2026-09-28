'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { CategoryOption } from '@/lib/admin-categories';

export type CategoryFormValues = {
  id?: string;
  name: string;
  description: string;
  parentId: string;
  isVisible: boolean;
  isPopular: boolean;
};

export function CategoryFormModal({
  initial,
  categoryOptions,
  onClose,
  onSaved
}: {
  initial: CategoryFormValues;
  categoryOptions: CategoryOption[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [values, setValues] = useState(initial);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const isEdit = Boolean(initial.id);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(isEdit ? `/api/admin/categories/${initial.id}` : '/api/admin/categories', {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.name,
          description: values.description || undefined,
          parentId: values.parentId || null,
          isVisible: values.isVisible,
          isPopular: values.isPopular
        })
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? 'Could not save this category.');

      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save this category.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink/50" onClick={onClose} aria-hidden />
      <form
        onSubmit={onSubmit}
        className="relative w-full max-w-md rounded-card border border-line bg-white p-6 shadow-lift"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink">{isEdit ? 'Edit category' : 'Add category'}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="p-1 text-slate hover:text-ink">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="cat-name" className="mb-1.5 block text-sm font-semibold text-ink">
              Name
            </label>
            <input
              id="cat-name"
              required
              value={values.name}
              onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
              className="h-11 w-full rounded-card border border-line px-3.5 text-[0.9375rem] focus:border-brand"
            />
          </div>

          <div>
            <label htmlFor="cat-description" className="mb-1.5 block text-sm font-semibold text-ink">
              Description
            </label>
            <textarea
              id="cat-description"
              rows={2}
              value={values.description}
              onChange={(e) => setValues((v) => ({ ...v, description: e.target.value }))}
              className="w-full rounded-card border border-line px-3.5 py-2.5 text-[0.9375rem] focus:border-brand"
            />
          </div>

          <div>
            <label htmlFor="cat-parent" className="mb-1.5 block text-sm font-semibold text-ink">
              Parent category
            </label>
            <select
              id="cat-parent"
              value={values.parentId}
              onChange={(e) => setValues((v) => ({ ...v, parentId: e.target.value }))}
              className="h-11 w-full rounded-card border border-line px-3.5 text-[0.9375rem] focus:border-brand"
            >
              <option value="">None - top level category</option>
              {categoryOptions
                .filter((o) => o.id !== initial.id)
                .map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
            </select>
          </div>

          <div className="flex gap-5">
            <label className="flex items-center gap-2 text-sm text-slate-deep">
              <input
                type="checkbox"
                checked={values.isVisible}
                onChange={(e) => setValues((v) => ({ ...v, isVisible: e.target.checked }))}
                className="h-4 w-4 rounded border-line text-brand"
              />
              Visible on site
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-deep">
              <input
                type="checkbox"
                checked={values.isPopular}
                onChange={(e) => setValues((v) => ({ ...v, isPopular: e.target.checked }))}
                className="h-4 w-4 rounded border-line text-brand"
              />
              Show on homepage
            </label>
          </div>
        </div>

        {error ? (
          <p className="mt-4 text-sm font-medium text-scarlet" role="alert">
            {error}
          </p>
        ) : null}

        <div className="mt-6 flex justify-end gap-2.5">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving' : 'Save category'}
          </Button>
        </div>
      </form>
    </div>
  );
}
