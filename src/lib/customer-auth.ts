import bcrypt from 'bcryptjs';
import { prisma } from './prisma';
import { createSession, clearSession, getOrCreateGuestCartKey, clearGuestCartKey } from './session';
import { mergeGuestCartIntoCustomer } from './cart';

export type AuthResult = { ok: true } | { ok: false; error: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function registerCustomer(input: {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}): Promise<AuthResult> {
  const fullName = input.fullName.trim();
  const email = input.email.trim().toLowerCase();
  const phone = input.phone.trim();

  if (fullName.length < 2) return { ok: false, error: 'Enter your full name.' };
  if (!EMAIL_RE.test(email)) return { ok: false, error: 'Enter a valid email address.' };
  if (phone.length < 7) return { ok: false, error: 'Enter a valid phone number.' };
  if (input.password.length < 8) return { ok: false, error: 'Password must be at least 8 characters.' };

  const existing = await prisma.customer.findUnique({ where: { email } });
  if (existing) return { ok: false, error: 'An account with this email already exists. Try signing in instead.' };

  const passwordHash = await bcrypt.hash(input.password, 10);
  const customer = await prisma.customer.create({
    data: { fullName, email, phone, passwordHash }
  });

  await signInCustomer(customer.id, customer.email);
  return { ok: true };
}

export async function loginCustomer(input: { email: string; password: string }): Promise<AuthResult> {
  const email = input.email.trim().toLowerCase();

  const customer = await prisma.customer.findUnique({ where: { email } });
  if (!customer || !customer.isActive) {
    return { ok: false, error: 'Incorrect email or password.' };
  }

  const valid = await bcrypt.compare(input.password, customer.passwordHash);
  if (!valid) return { ok: false, error: 'Incorrect email or password.' };

  await prisma.customer.update({ where: { id: customer.id }, data: { lastLoginAt: new Date() } });
  await signInCustomer(customer.id, customer.email);
  return { ok: true };
}

/** Shared by register and login: opens the session and folds any guest cart into the account. */
async function signInCustomer(customerId: string, email: string) {
  const guestKey = getOrCreateGuestCartKey();
  await createSession({ customerId, email });
  await mergeGuestCartIntoCustomer(customerId, guestKey);
  clearGuestCartKey();
}

export function logoutCustomer() {
  clearSession();
}
