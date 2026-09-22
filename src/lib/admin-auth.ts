import bcrypt from 'bcryptjs';
import { prisma } from './prisma';
import { createAdminSession, clearAdminSession } from './admin-session';
import { AdminStatus } from '@prisma/client';

export type AdminAuthResult =
  | { ok: true; mustChangePassword: boolean }
  | { ok: false; error: string };

export async function loginAdmin(input: { email: string; password: string }): Promise<AdminAuthResult> {
  const email = input.email.trim().toLowerCase();

  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin || admin.status !== AdminStatus.ACTIVE) {
    return { ok: false, error: 'Incorrect email or password.' };
  }

  const valid = await bcrypt.compare(input.password, admin.passwordHash);
  if (!valid) return { ok: false, error: 'Incorrect email or password.' };

  await prisma.admin.update({ where: { id: admin.id }, data: { lastLoginAt: new Date() } });
  await prisma.auditLog.create({
    data: { adminId: admin.id, actorLabel: admin.email, action: 'ADMIN_LOGIN' }
  });

  await createAdminSession({ adminId: admin.id, email: admin.email, role: admin.role });
  return { ok: true, mustChangePassword: admin.mustChangePassword };
}

export function logoutAdmin() {
  clearAdminSession();
}

export type ChangePasswordResult = { ok: true } | { ok: false; error: string };

export async function changeAdminPassword(
  adminId: string,
  input: { currentPassword: string; newPassword: string }
): Promise<ChangePasswordResult> {
  if (input.newPassword.length < 12) {
    return { ok: false, error: 'New password must be at least 12 characters.' };
  }

  const admin = await prisma.admin.findUnique({ where: { id: adminId } });
  if (!admin) return { ok: false, error: 'Admin account not found.' };

  const valid = await bcrypt.compare(input.currentPassword, admin.passwordHash);
  if (!valid) return { ok: false, error: 'Current password is incorrect.' };

  const passwordHash = await bcrypt.hash(input.newPassword, 12);
  await prisma.admin.update({
    where: { id: adminId },
    data: { passwordHash, mustChangePassword: false }
  });
  await prisma.auditLog.create({
    data: { adminId: admin.id, actorLabel: admin.email, action: 'ADMIN_PASSWORD_CHANGED' }
  });

  return { ok: true };
}
