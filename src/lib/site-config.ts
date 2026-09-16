const DEFAULT_SITE_URL = 'https://www.businesshubcomputers.com';

/**
 * Reads NEXT_PUBLIC_SITE_URL and always returns a valid absolute URL string.
 *
 * A plain `??` fallback only catches undefined/null. On Vercel it is easy
 * to add an environment variable and leave its value blank, which sets it
 * to an empty string rather than leaving it unset - `??` would not catch
 * that, and `new URL('')` throws and fails the entire build. This checks
 * for a non-empty value explicitly, and validates the result really is a
 * parseable URL before trusting it, so a malformed value (e.g. a value
 * missing "https://") falls back safely instead of crashing the build.
 */
function resolveSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return DEFAULT_SITE_URL;
  try {
    return new URL(raw).toString().replace(/\/$/, '');
  } catch {
    return DEFAULT_SITE_URL;
  }
}

/**
 * Fallback site values. Live values are served from the
 * BusinessInformation, ContactInformation and SocialLink tables
 * so the Super Admin can change them without a code deploy.
 */
export const siteConfig = {
  name: 'BUSINESS-HUB COMPUTERS',
  shortName: 'Business-Hub',
  registrationNumber: 'RC: 3001886',
  tagline: 'Computers, components and office technology, sourced and supported in Nigeria.',
  url: resolveSiteUrl()
};

export const primaryNav = [
  { label: 'HOME', href: '/' },
  { label: 'SHOP', href: '/shop' },
  { label: 'CATEGORIES', href: '/categories' },
  { label: 'DEALS', href: '/deals' },
  { label: 'ABOUT US', href: '/about' },
  { label: 'CONTACT', href: '/contact' }
];

export const footerLinks = {
  quickLinks: [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: 'Categories', href: '/categories' },
    { label: 'Deals', href: '/deals' },
    { label: 'About us', href: '/about' },
    { label: 'Contact', href: '/contact' }
  ],
  customerService: [
    { label: 'My account', href: '/account' },
    { label: 'Orders', href: '/account/orders' },
    { label: 'Shipping information', href: '/shipping' },
    { label: 'Returns', href: '/returns' },
    { label: 'Privacy policy', href: '/privacy' },
    { label: 'Terms and conditions', href: '/terms' }
  ]
};
