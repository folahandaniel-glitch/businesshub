import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const COOKIE_NAME = process.env.SESSION_COOKIE_NAME || 'bhc_session';
const CART_COOKIE_NAME = 'bhc_cart';
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 30; // 30 days

function getSecretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) {
    // A missing secret must never silently produce an insecure session.
    // Failing loudly here is safer than issuing a token nobody can trust.
    throw new Error('AUTH_SECRET is not set. Add it to your environment before customers can sign in.');
  }
  return new TextEncoder().encode(secret);
}

export type SessionPayload = { customerId: string; email: string };

/** Signs a session token and sets it as an httpOnly cookie. */
export async function createSession(payload: SessionPayload) {
  const token = await new SignJWT({ customerId: payload.customerId, email: payload.email })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSecretKey());

  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_DURATION_SECONDS
  });
}

export function clearSession() {
  cookies().delete(COOKIE_NAME);
}

/** Reads and verifies the session cookie for the current request. Returns null when absent or invalid. */
export async function getSession(): Promise<SessionPayload | null> {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (typeof payload.customerId !== 'string' || typeof payload.email !== 'string') return null;
    return { customerId: payload.customerId, email: payload.email };
  } catch {
    // Expired, tampered, or signed with a since-rotated secret. Treat as signed out.
    return null;
  }
}

/**
 * A stable anonymous cart identifier for guests who have not signed in.
 * Middleware (see /src/middleware.ts) sets this cookie on every request
 * before any page renders, so this function only ever reads it - never
 * writes - which keeps it safe to call from a plain Server Component,
 * not just from a Route Handler or Server Action.
 */
export function getOrCreateGuestCartKey(): string {
  const existing = cookies().get(CART_COOKIE_NAME)?.value;
  if (existing) return existing;

  // Middleware should have set this already. If it is somehow missing -
  // middleware skipped, or the matcher excluded this path - generate a
  // value for this request only rather than crashing. It will not persist
  // without a Set-Cookie, but the request still completes correctly.
  return crypto.randomUUID();
}

export function clearGuestCartKey() {
  cookies().delete(CART_COOKIE_NAME);
}
