'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2, Eye, EyeOff, Star } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CategoryFormModal, type CategoryFormValues } from './CategoryFormModal';
import type { CategoryTreeNode, CategoryOption } from '@/lib/admin-categories';

const EMPTY_FORM: CategoryFormValues = { name: '', description: '', parentId: '', isVisible: true, isPopular: false };

export function CategoryTree({ tree, options }: { tree: CategoryTreeNode[]; options: CategoryOption[] }) {
  const router = useRouter();
  const [modal, setModal] = useState<CategoryFormValues | null>(null);
  const [deleteError, setDeleteError] = useState<Record<string, string>>({});
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function closeModal() {
    setModal(null);
  }

  function onSaved() {
    closeModal();
    router.refresh();
  }

  async function onDelete(node: CategoryTreeNode) {
    if (!window.confirm(`Delete "${node.name}"? This cannot be undone.`)) return;

    setDeletingId(node.id);
    setDeleteError((prev) => ({ ...prev, [node.id]: '' }));
    try {
      const res = await fetch(`/api/admin/categories/${node.id}`, { method: 'DELETE' });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? 'Could not delete this category.');
      router.refresh();
    } catch (err) {
      setDeleteError((prev) => ({
        ...prev,
        [node.id]: err instanceof Error ? err.message : 'Could not delete this category.'
      }));
    } finally {
      setDeletingId(null);
    }
  }

  function renderNode(node: CategoryTreeNode, depth = 0) {
    return (
      <div key={node.id}>
        <div
          className="flex flex-wrap items-center justify-between gap-3 border-b border-line py-3"
          style={{ paddingLeft: depth * 24 }}
        >
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold text-ink">{node.name}</p>
              {node.isPopular ? (
                <span title="Shown on homepage">
                  <Star size={13} className="fill-amber-400 text-amber-400" />
                </span>
              ) : null}
              {node.isVisible ? (
                <Eye size={13} className="text-slate" aria-label="Visible" />
              ) : (
                <EyeOff size={13} className="text-scarlet" aria-label="Hidden" />
              )}
              <Badge tone="neutral">
                {node.productCount} {node.productCount === 1 ? 'product' : 'products'}
              </Badge>
            </div>
            {node.description ? <p className="mt-1 text-sm text-slate">{node.description}</p> : null}
            {deleteError[node.id] ? <p className="mt-1 text-sm text-scarlet">{deleteError[node.id]}</p> : null}
          </div>

          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() =>
                setModal({
                  id: node.id,
                  name: node.name,
                  description: node.description ?? '',
                  parentId: node.parentId ?? '',
                  isVisible: node.isVisible,
                  isPopular: node.isPopular
                })
              }
              className="grid h-8 w-8 place-items-center rounded-card border border-line text-slate hover:border-brand hover:text-brand"
              aria-label={`Edit ${node.name}`}
            >
              <Pencil size={14} />
            </button>
            <button
              type="button"
              onClick={() => onDelete(node)}
              disabled={deletingId === node.id}
              className="grid h-8 w-8 place-items-center rounded-card border border-line text-slate hover:border-scarlet hover:text-scarlet"
              aria-label={`Delete ${node.name}`}
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
        {node.children.map((child) => renderNode(child, depth + 1))}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button onClick={() => setModal(EMPTY_FORM)}>
          <Plus size={16} aria-hidden />
          Add category
        </Button>
      </div>

      <div className="rounded-card border border-line bg-white px-5">
        {tree.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate">No categories yet. Add the first one above.</p>
        ) : (
          tree.map((node) => renderNode(node))
        )}
      </div>

      {modal ? (
        <CategoryFormModal initial={modal} categoryOptions={options} onClose={closeModal} onSaved={onSaved} />
      ) : null}
    </div>
  );
}
