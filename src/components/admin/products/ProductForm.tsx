'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Star } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { CategoryOption } from '@/lib/admin-categories';
import type { ProductForEdit } from '@/lib/admin-products';

type SpecRow = { key: string; value: string };
type ImageRow = { url: string; altText: string; isPrimary: boolean };

export function ProductForm({
  mode,
  productId,
  initial,
  categoryOptions
}: {
  mode: 'create' | 'edit';
  productId?: string;
  initial?: ProductForEdit;
  categoryOptions: CategoryOption[];
}) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? '');
  const [sku, setSku] = useState(initial?.sku ?? '');
  const [brand, setBrand] = useState(initial?.brand ?? '');
  const [modelNumber, setModelNumber] = useState(initial?.modelNumber ?? '');
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? categoryOptions[0]?.id ?? '');
  const [shortDescription, setShortDescription] = useState(initial?.shortDescription ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [warrantyInfo, setWarrantyInfo] = useState(initial?.warrantyInfo ?? '');
  const [price, setPrice] = useState(initial?.price ? String(initial.price) : '');
  const [previousPrice, setPreviousPrice] = useState(initial?.previousPrice ? String(initial.previousPrice) : '');
  const [condition, setCondition] = useState(initial?.condition ?? 'NEW');
  const [status, setStatus] = useState(initial?.status ?? 'PUBLISHED');
  const [isFeatured, setIsFeatured] = useState(initial?.isFeatured ?? false);
  const [isBestSeller, setIsBestSeller] = useState(initial?.isBestSeller ?? false);
  const [isNewArrival, setIsNewArrival] = useState(initial?.isNewArrival ?? false);
  const [minStockLevel, setMinStockLevel] = useState(String(initial?.minStockLevel ?? 5));
  const [initialStock, setInitialStock] = useState('0');
  const [tagsText, setTagsText] = useState(initial?.tags.join(', ') ?? '');

  const [specs, setSpecs] = useState<SpecRow[]>(
    initial?.specifications && Object.keys(initial.specifications).length > 0
      ? Object.entries(initial.specifications).map(([key, value]) => ({ key, value }))
      : [{ key: '', value: '' }]
  );
  const [images, setImages] = useState<ImageRow[]>(
    initial?.images && initial.images.length > 0
      ? initial.images.map((img) => ({ url: img.url, altText: img.altText ?? '', isPrimary: img.isPrimary }))
      : [{ url: '', altText: '', isPrimary: true }]
  );

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function updateSpec(i: number, field: 'key' | 'value', value: string) {
    setSpecs((prev) => prev.map((s, idx) => (idx === i ? { ...s, [field]: value } : s)));
  }
  function updateImage(i: number, field: keyof ImageRow, value: string | boolean) {
    setImages((prev) =>
      prev.map((img, idx) => {
        if (field === 'isPrimary' && value === true) {
          return { ...img, isPrimary: idx === i };
        }
        return idx === i ? { ...img, [field]: value } : img;
      })
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const specifications = Object.fromEntries(
      specs.filter((s) => s.key.trim() && s.value.trim()).map((s) => [s.key.trim(), s.value.trim()])
    );
    const tags = tagsText
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    const payload = {
      name,
      sku,
      brand,
      modelNumber: modelNumber || undefined,
      categoryId,
      shortDescription: shortDescription || undefined,
      description,
      specifications,
      warrantyInfo: warrantyInfo || undefined,
      price: Number(price),
      previousPrice: previousPrice ? Number(previousPrice) : null,
      condition,
      status,
      isFeatured,
      isBestSeller,
      isNewArrival,
      tags,
      images: images.filter((img) => img.url.trim()),
      minStockLevel: Number(minStockLevel),
      ...(mode === 'create' ? { initialStock: Number(initialStock) } : {})
    };

    try {
      const res = await fetch(mode === 'create' ? '/api/admin/products' : `/api/admin/products/${productId}`, {
        method: mode === 'create' ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? 'Could not save this product.');

      router.push('/admin/products');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save this product.');
      setLoading(false);
    }
  }

  const inputClass = 'h-11 w-full rounded-card border border-line px-3.5 text-[0.9375rem] focus:border-brand';
  const labelClass = 'mb-1.5 block text-sm font-semibold text-ink';

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <section className="rounded-card border border-line bg-white p-6">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate">Basic information</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelClass}>Product name</label>
            <input required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>SKU</label>
            <input required value={sku} onChange={(e) => setSku(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Brand</label>
            <input required value={brand} onChange={(e) => setBrand(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Model number</label>
            <input value={modelNumber} onChange={(e) => setModelNumber(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Category</label>
            <select required value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className={inputClass}>
              {categoryOptions.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Short description</label>
            <input
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="One line shown on product cards"
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Full description</label>
            <textarea
              required
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-card border border-line px-3.5 py-2.5 text-[0.9375rem] focus:border-brand"
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Warranty information</label>
            <input value={warrantyInfo} onChange={(e) => setWarrantyInfo(e.target.value)} className={inputClass} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Tags (comma separated)</label>
            <input value={tagsText} onChange={(e) => setTagsText(e.target.value)} className={inputClass} />
          </div>
        </div>
      </section>

      <section className="rounded-card border border-line bg-white p-6">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate">Pricing and condition</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className={labelClass}>Price (₦)</label>
            <input required type="number" min="1" step="1" value={price} onChange={(e) => setPrice(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Previous price (₦)</label>
            <input
              type="number"
              min="1"
              step="1"
              value={previousPrice}
              onChange={(e) => setPreviousPrice(e.target.value)}
              placeholder="Optional"
              className={inputClass}
            />
            <p className="mt-1 text-xs text-slate">Set this to show a discount badge automatically.</p>
          </div>
          <div>
            <label className={labelClass}>Condition</label>
            <select value={condition} onChange={(e) => setCondition(e.target.value as typeof condition)} className={inputClass}>
              <option value="NEW">New</option>
              <option value="REFURBISHED">Refurbished</option>
              <option value="UK_USED">UK used</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value as typeof status)} className={inputClass}>
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-5">
          <label className="flex items-center gap-2 text-sm text-slate-deep">
            <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="h-4 w-4 rounded border-line text-brand" />
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-deep">
            <input type="checkbox" checked={isBestSeller} onChange={(e) => setIsBestSeller(e.target.checked)} className="h-4 w-4 rounded border-line text-brand" />
            Best seller
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-deep">
            <input type="checkbox" checked={isNewArrival} onChange={(e) => setIsNewArrival(e.target.checked)} className="h-4 w-4 rounded border-line text-brand" />
            New arrival
          </label>
        </div>
      </section>

      <section className="rounded-card border border-line bg-white p-6">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate">Stock</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {mode === 'create' ? (
            <div>
              <label className={labelClass}>Opening stock quantity</label>
              <input type="number" min="0" step="1" value={initialStock} onChange={(e) => setInitialStock(e.target.value)} className={inputClass} />
            </div>
          ) : (
            <div>
              <label className={labelClass}>Current stock quantity</label>
              <input disabled value={initial?.stockQuantity ?? 0} className={`${inputClass} bg-mist text-slate`} />
              <p className="mt-1 text-xs text-slate">Change stock levels from the Inventory page, not here.</p>
            </div>
          )}
          <div>
            <label className={labelClass}>Low stock threshold</label>
            <input type="number" min="0" step="1" value={minStockLevel} onChange={(e) => setMinStockLevel(e.target.value)} className={inputClass} />
          </div>
        </div>
      </section>

      <section className="rounded-card border border-line bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate">Specifications</h2>
          <Button type="button" variant="ghost" size="sm" onClick={() => setSpecs((prev) => [...prev, { key: '', value: '' }])}>
            <Plus size={14} aria-hidden /> Add row
          </Button>
        </div>
        <div className="mt-4 space-y-2.5">
          {specs.map((row, i) => (
            <div key={i} className="flex gap-2.5">
              <input
                placeholder="Label, e.g. Processor"
                value={row.key}
                onChange={(e) => updateSpec(i, 'key', e.target.value)}
                className={`${inputClass} h-10 flex-1`}
              />
              <input
                placeholder="Value, e.g. Intel Core i7"
                value={row.value}
                onChange={(e) => updateSpec(i, 'value', e.target.value)}
                className={`${inputClass} h-10 flex-[1.5]`}
              />
              <button
                type="button"
                onClick={() => setSpecs((prev) => prev.filter((_, idx) => idx !== i))}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-card border border-line text-slate hover:border-scarlet hover:text-scarlet"
                aria-label="Remove row"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-card border border-line bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate">Images</h2>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setImages((prev) => [...prev, { url: '', altText: '', isPrimary: prev.length === 0 }])}
          >
            <Plus size={14} aria-hidden /> Add image
          </Button>
        </div>
        <p className="mt-1 text-xs text-slate">
          Paste a direct image URL. Connect cloud storage later for direct upload - see the README.
        </p>
        <div className="mt-4 space-y-2.5">
          {images.map((img, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => updateImage(i, 'isPrimary', true)}
                aria-label={img.isPrimary ? 'Primary image' : 'Set as primary image'}
                className="shrink-0 p-1"
              >
                <Star size={18} className={img.isPrimary ? 'fill-amber-400 text-amber-400' : 'text-line'} />
              </button>
              <input
                placeholder="https://..."
                value={img.url}
                onChange={(e) => updateImage(i, 'url', e.target.value)}
                className={`${inputClass} h-10 flex-[1.5]`}
              />
              <input
                placeholder="Alt text"
                value={img.altText}
                onChange={(e) => updateImage(i, 'altText', e.target.value)}
                className={`${inputClass} h-10 flex-1`}
              />
              <button
                type="button"
                onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-card border border-line text-slate hover:border-scarlet hover:text-scarlet"
                aria-label="Remove image"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {error ? (
        <p className="text-sm font-medium text-scarlet" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex justify-end gap-2.5">
        <Button type="button" variant="ghost" onClick={() => router.push('/admin/products')}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving' : mode === 'create' ? 'Create product' : 'Save changes'}
        </Button>
      </div>
    </form>
  );
}
