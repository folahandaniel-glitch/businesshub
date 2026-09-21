# BUSINESS-HUB COMPUTERS

Full stack e-commerce platform. Registration Number: RC: 3001886.

Stack: Next.js 14 (App Router) + TypeScript + Tailwind CSS + PostgreSQL + Prisma.

---

## Stage 1 delivered

| Area | Files |
|---|---|
| Project configuration | `package.json`, `next.config.mjs`, `tsconfig.json`, `postcss.config.mjs`, `.env.example` |
| Database schema, all 28 entities | `prisma/schema.prisma` |
| Demo data and settings seed | `prisma/seed.ts` |
| Secure first Super Admin | `prisma/create-super-admin.ts` |
| Brand design tokens | `tailwind.config.ts`, `src/app/globals.css` |
| Shared helpers | `src/lib/utils.ts`, `src/lib/prisma.ts`, `src/lib/site-config.ts` |
| UI primitives | `src/components/ui/` |
| Site shell | `src/components/site/Header.tsx`, `src/components/site/Footer.tsx`, `src/app/layout.tsx` |

## Stage 2 delivered

| Area | Files |
|---|---|
| Homepage | `src/app/page.tsx` |
| Data layer | `src/lib/queries.ts` |
| Product card, grid | `src/components/shop/ProductCard.tsx`, `src/components/shop/ProductSection.tsx` |
| Homepage sections | `src/components/home/Hero.tsx`, `CategoryStrip.tsx`, `FlashDeals.tsx`, `WhyChooseUs.tsx`, `Testimonials.tsx`, `Newsletter.tsx` |
| Supporting UI | `src/components/ui/ProductThumb.tsx`, `src/components/ui/Rating.tsx` |
| Newsletter endpoint | `src/app/api/newsletter/route.ts` |

## Stage 3 delivered

| Area | Files |
|---|---|
| Shop listing, search, filters, sort, pagination | `src/app/shop/page.tsx`, `src/lib/shop-queries.ts` |
| Categories index and category pages | `src/app/categories/page.tsx`, `src/app/categories/[slug]/page.tsx` |
| Deals page | `src/app/deals/page.tsx` |
| Product detail page | `src/app/product/[slug]/page.tsx`, `src/components/product/` |
| Shop UI | `src/components/shop/FilterSidebar.tsx`, `SortBar.tsx`, `Pagination.tsx`, `ProductGrid.tsx` |
| About, Contact (real form), legal pages | `src/app/about`, `src/app/contact`, `src/app/privacy`, `src/app/terms`, `src/app/shipping`, `src/app/returns` |
| Contact form endpoint | `src/app/api/contact/route.ts` (writes to the `ContactMessage` table) |
| Honest "coming soon" pages for what stage 4/5 delivers | `src/components/ui/ComingSoon.tsx` |

## Stage 4 delivered

| Area | Files |
|---|---|
| Session and customer auth | `src/lib/session.ts`, `src/lib/customer-auth.ts` |
| Guest-cart cookie assignment | `src/middleware.ts` (cookies can only be written in middleware/Route Handlers/Server Actions, never in a page render - this is why the guest cart id is assigned here) |
| Cart data layer and API | `src/lib/cart.ts`, `src/app/api/cart/**` |
| Wishlist data layer and API | `src/lib/wishlist.ts`, `src/app/api/wishlist/route.ts` |
| Checkout (atomic order creation, stock decrement) | `src/lib/checkout.ts`, `src/app/api/checkout/route.ts` |
| Delivery fee estimate (placeholder until stage 9's courier integration) | `src/lib/delivery.ts` |
| Order lookups | `src/lib/orders.ts` |
| Login, register, cart, wishlist, account, order pages | `src/app/login`, `src/app/register`, `src/app/cart`, `src/app/wishlist`, `src/app/account/**`, `src/app/checkout`, `src/app/order-confirmation/[orderNumber]` |

## Deploying

See **DEPLOYMENT.md** for the full GitHub and Vercel walkthrough.

## Local setup

```bash
# 1. Install dependencies
npm install

# 2. Create your environment file and fill it in
cp .env.example .env

# 3. Generate the Prisma client and create the database tables
npx prisma generate
npm run db:push

# 4. Load categories, settings and demo products
npm run db:seed

# 5. Create the first Super Admin (reads SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD)
npm run setup:admin

# 6. Start the development server
npm run dev
```

Open http://localhost:3000.

## Brand tokens

| Token | Hex | Use |
|---|---|---|
| `ink` | `#0A1B4D` | Headlines, footer, deepest navy |
| `brand` | `#17359B` | Primary buttons, links, active states |
| `brand.tint` | `#EDF1FC` | Pale blue fills and hover states |
| `scarlet` | `#D6202A` | Calls to action, discounts, alerts |
| `mist` | `#F4F6FB` | Page background |
| `line` | `#E2E7F1` | Hairline borders |

Typefaces: Archivo for headings, Inter for body text.

The section heading device (`.rule-heading`) repeats the vertical rule from the logo, where a red bar separates the BH mark from the wordmark.

## Security notes

- No password, API key or payment credential is hardcoded anywhere. All secrets come from environment variables.
- The Super Admin script refuses to run without environment values and rejects passwords under 12 characters.
- The new Super Admin is created with `mustChangePassword = true`.
- Passwords are hashed with bcrypt at cost factor 12.
- Security headers are set in `next.config.mjs`.

## Build plan

1. **Stage 1, done.** Foundation, schema, design system, site shell.
2. **Stage 2, done.** Storefront homepage: hero with live spotlight deal, category grid, featured products, countdown deals strip, new arrivals, best sellers, why choose us, testimonials, newsletter capture, organization structured data.
3. **Stage 3, done.** Shop listing, search, filtering, sorting, pagination, product details page, About/Contact/legal pages.
4. **Stage 4, done.** Cart, wishlist, customer accounts, checkout, order creation and tracking.
5. **Stage 5.** Admin authentication, role based access control, admin dashboard with analytics.
6. **Stage 6.** Product, category and inventory management modules.
7. **Stage 7.** Order management, Super Admin controls, admin and permission management, task management.
8. **Stage 8.** Marketing (discounts, coupons, banners), reviews, site settings (social, contact, business), notifications, audit logs, reports and exports.
9. **Stage 9.** Payment gateway integration (Paystack and Flutterwave), SEO polish, performance pass, full test sweep.
