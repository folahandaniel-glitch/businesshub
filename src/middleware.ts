import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const CART_COOKIE_NAME = 'bhc_cart';
const CART_COOKIE_MAX_AGE = 60 * 60 * 24 * 90; // 90 days

/**
 * Next.js only allows a cookie write inside a Server Action, a Route
 * Handler, or middleware - never during a plain Server Component render.
 * The guest cart identifier is read in Server Components (the header's
 * cart count, the cart page, the checkout page), so it must already exist
 * by the time any of those render. Middleware runs ahead of every matched
 * request and is the one place allowed to create it lazily; everywhere
 * else in the app only ever reads this cookie.
 */
export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  if (!request.cookies.get(CART_COOKIE_NAME)) {
    response.cookies.set(CART_COOKIE_NAME, crypto.randomUUID(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: CART_COOKIE_MAX_AGE
    });
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
};
