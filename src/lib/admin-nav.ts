/**
 * The full admin navigation from the project specification. Only
 * Dashboard is a real, working page in this stage; every other entry
 * routes to the shared coming-soon catch-all, which reads this same
 * list to know its own title and which stage delivers it - so adding a
 * real page later only means removing its entry here.
 */
export type NavLeaf = { label: string; href: string; stage: string };
export type NavGroup = { label: string; icon: string; items: NavLeaf[] } | NavLeaf;

export const ADMIN_NAV: NavGroup[] = [
  { label: 'Dashboard', href: '/admin', stage: 'live' },
  {
    label: 'Products',
    icon: 'Package',
    items: [
      { label: 'All Products', href: '/admin/products', stage: 'Stage 6' },
      { label: 'Add Product', href: '/admin/products/add', stage: 'Stage 6' },
      { label: 'Categories', href: '/admin/categories', stage: 'Stage 6' },
      { label: 'Inventory', href: '/admin/inventory', stage: 'Stage 6' }
    ]
  },
  {
    label: 'Orders',
    icon: 'ShoppingBag',
    items: [
      { label: 'All Orders', href: '/admin/orders', stage: 'Stage 7' },
      { label: 'Pending', href: '/admin/orders/pending', stage: 'Stage 7' },
      { label: 'Processing', href: '/admin/orders/processing', stage: 'Stage 7' },
      { label: 'Delivered', href: '/admin/orders/delivered', stage: 'Stage 7' },
      { label: 'Cancelled', href: '/admin/orders/cancelled', stage: 'Stage 7' }
    ]
  },
  { label: 'Customers', href: '/admin/customers', stage: 'Stage 7' },
  {
    label: 'Admins & Staff',
    icon: 'Users',
    items: [
      { label: 'Admins', href: '/admin/staff/admins', stage: 'Stage 7' },
      { label: 'Roles', href: '/admin/staff/roles', stage: 'Stage 7' },
      { label: 'Permissions', href: '/admin/staff/permissions', stage: 'Stage 7' },
      { label: 'Tasks', href: '/admin/staff/tasks', stage: 'Stage 7' }
    ]
  },
  {
    label: 'Marketing',
    icon: 'Megaphone',
    items: [
      { label: 'Discounts', href: '/admin/marketing/discounts', stage: 'Stage 8' },
      { label: 'Coupons', href: '/admin/marketing/coupons', stage: 'Stage 8' },
      { label: 'Promotions', href: '/admin/marketing/promotions', stage: 'Stage 8' },
      { label: 'Banners', href: '/admin/marketing/banners', stage: 'Stage 8' }
    ]
  },
  { label: 'Reviews', href: '/admin/reviews', stage: 'Stage 8' },
  {
    label: 'Reports',
    icon: 'BarChart3',
    items: [
      { label: 'Sales', href: '/admin/reports/sales', stage: 'Stage 8' },
      { label: 'Products', href: '/admin/reports/products', stage: 'Stage 8' },
      { label: 'Customers', href: '/admin/reports/customers', stage: 'Stage 8' },
      { label: 'Inventory', href: '/admin/reports/inventory', stage: 'Stage 8' }
    ]
  },
  {
    label: 'Website',
    icon: 'Globe',
    items: [
      { label: 'Homepage', href: '/admin/website/homepage', stage: 'Stage 8' },
      { label: 'Banners', href: '/admin/website/banners', stage: 'Stage 8' },
      { label: 'Testimonials', href: '/admin/website/testimonials', stage: 'Stage 8' },
      { label: 'Social Media', href: '/admin/website/social-media', stage: 'Stage 8' },
      { label: 'Contact Information', href: '/admin/website/contact', stage: 'Stage 8' },
      { label: 'Business Information', href: '/admin/website/business', stage: 'Stage 8' }
    ]
  },
  { label: 'Notifications', href: '/admin/notifications', stage: 'Stage 8' },
  { label: 'Audit Logs', href: '/admin/audit-logs', stage: 'Stage 8' },
  { label: 'Settings', href: '/admin/settings', stage: 'Stage 8' }
];

function isLeaf(entry: NavGroup): entry is NavLeaf {
  return 'href' in entry;
}

/** Looks up the nav entry for a given path, for the coming-soon catch-all to show the right title and stage. */
export function findNavEntry(path: string): NavLeaf | null {
  for (const entry of ADMIN_NAV) {
    if (isLeaf(entry)) {
      if (entry.href === path) return entry;
    } else {
      const match = entry.items.find((i) => i.href === path);
      if (match) return match;
    }
  }
  return null;
}

export { isLeaf };
