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
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.businesshubcomputers.com'
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
