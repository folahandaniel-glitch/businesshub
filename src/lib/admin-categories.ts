import { prisma } from './prisma';
import { slugify } from './utils';

export type CategoryTreeNode = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isVisible: boolean;
  isPopular: boolean;
  sortOrder: number;
  productCount: number;
  parentId: string | null;
  children: CategoryTreeNode[];
};

export async function listCategoriesForAdmin(): Promise<CategoryTreeNode[]> {
  const all = await prisma.category.findMany({
    orderBy: [{ parentId: 'asc' }, { sortOrder: 'asc' }],
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      isVisible: true,
      isPopular: true,
      sortOrder: true,
      parentId: true,
      _count: { select: { products: true } }
    }
  });

  const nodes = new Map<string, CategoryTreeNode>();
  for (const c of all) {
    nodes.set(c.id, {
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      isVisible: c.isVisible,
      isPopular: c.isPopular,
      sortOrder: c.sortOrder,
      productCount: c._count.products,
      parentId: c.parentId,
      children: []
    });
  }

  const roots: CategoryTreeNode[] = [];
  for (const node of nodes.values()) {
    if (node.parentId && nodes.has(node.parentId)) {
      nodes.get(node.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots;
}

export type CategoryInput = {
  name: string;
  description?: string;
  parentId?: string | null;
  isVisible?: boolean;
  isPopular?: boolean;
};

export type CategoryResult = { ok: true; id: string } | { ok: false; error: string };

export async function createCategory(input: CategoryInput): Promise<CategoryResult> {
  const name = input.name.trim();
  if (name.length < 2) return { ok: false, error: 'Category name is too short.' };

  const slug = slugify(name);
  const existing = await prisma.category.findUnique({ where: { slug } });
  if (existing) return { ok: false, error: 'A category with this name already exists.' };

  const category = await prisma.category.create({
    data: {
      name,
      slug,
      description: input.description?.trim() || null,
      parentId: input.parentId || null,
      isVisible: input.isVisible ?? true,
      isPopular: input.isPopular ?? false
    }
  });

  return { ok: true, id: category.id };
}

export async function updateCategory(id: string, input: CategoryInput): Promise<CategoryResult> {
  const name = input.name.trim();
  if (name.length < 2) return { ok: false, error: 'Category name is too short.' };

  const current = await prisma.category.findUnique({ where: { id } });
  if (!current) return { ok: false, error: 'Category not found.' };

  // A category cannot become its own parent, nor a descendant of itself -
  // both would create a cycle in the tree.
  if (input.parentId === id) {
    return { ok: false, error: 'A category cannot be its own parent.' };
  }
  if (input.parentId) {
    const descendantIds = await getDescendantIds(id);
    if (descendantIds.includes(input.parentId)) {
      return { ok: false, error: 'A category cannot be moved under its own subcategory.' };
    }
  }

  const slug = name === current.name ? current.slug : slugify(name);
  if (slug !== current.slug) {
    const clash = await prisma.category.findUnique({ where: { slug } });
    if (clash) return { ok: false, error: 'A category with this name already exists.' };
  }

  await prisma.category.update({
    where: { id },
    data: {
      name,
      slug,
      description: input.description?.trim() || null,
      parentId: input.parentId || null,
      isVisible: input.isVisible ?? current.isVisible,
      isPopular: input.isPopular ?? current.isPopular
    }
  });

  return { ok: true, id };
}

async function getDescendantIds(categoryId: string): Promise<string[]> {
  const children = await prisma.category.findMany({ where: { parentId: categoryId }, select: { id: true } });
  let ids = children.map((c) => c.id);
  for (const child of children) {
    ids = ids.concat(await getDescendantIds(child.id));
  }
  return ids;
}

export type DeleteResult = { ok: true } | { ok: false; error: string };

export async function deleteCategory(id: string): Promise<DeleteResult> {
  const category = await prisma.category.findUnique({
    where: { id },
    select: { _count: { select: { products: true, children: true } } }
  });
  if (!category) return { ok: false, error: 'Category not found.' };

  if (category._count.children > 0) {
    return { ok: false, error: 'Move or delete its subcategories first.' };
  }
  if (category._count.products > 0) {
    return { ok: false, error: 'Move its products to another category first.' };
  }

  await prisma.category.delete({ where: { id } });
  return { ok: true };
}

export type CategoryOption = { id: string; label: string };

function flattenTree(nodes: CategoryTreeNode[], depth = 0): CategoryOption[] {
  let options: CategoryOption[] = [];
  for (const node of nodes) {
    options.push({ id: node.id, label: `${'— '.repeat(depth)}${node.name}` });
    options = options.concat(flattenTree(node.children, depth + 1));
  }
  return options;
}

/** For the product form's category select - a flat, indented list so subcategories are visibly nested. */
export async function getCategoryOptions(): Promise<CategoryOption[]> {
  const tree = await listCategoriesForAdmin();
  return flattenTree(tree);
}
