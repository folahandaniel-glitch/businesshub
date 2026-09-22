import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const ADMIN_COOKIE_NAME = 'bhc_admin_session';
const ADMIN_SESSION_DURATION_SECONDS = 60 * 60 * 12; // 12 hours - shorter-lived than a customer session

/**
 * Deliberately separate from the customer AUTH_SECRET usage in
 * src/lib/session.ts: an admin session and a customer session are
 * different trust boundaries, and keeping their cookies and payloads
 * entirely distinct means a bug in one cannot leak into the other.
 */
function getSecretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error('AUTH_SECRET is not set. Add it to your environment before admins can sign in.');
  }
  return new TextEncoder().encode(secret);
}

export type AdminSessionPayload = {
  adminId: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN';
};

export async function createAdminSession(payload: AdminSessionPayload) {
  const token = await new SignJWT({ adminId: payload.adminId, email: payload.email, role: payload.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${ADMIN_SESSION_DURATION_SECONDS}s`)
    .sign(getSecretKey());

  cookies().set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: ADMIN_SESSION_DURATION_SECONDS
  });
}

export function clearAdminSession() {
  cookies().delete(ADMIN_COOKIE_NAME);
}

/** Reads and verifies the admin session cookie. Returns null when absent, expired, or tampered with. */
export async function getAdminSession(): Promise<AdminSessionPayload | null> {
  const token = cookies().get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (
      typeof payload.adminId !== 'string' ||
      typeof payload.email !== 'string' ||
      (payload.role !== 'SUPER_ADMIN' && payload.role !== 'ADMIN')
    ) {
      return null;
    }
    return { adminId: payload.adminId, email: payload.email, role: payload.role };
  } catch {
    return null;
  }
}
