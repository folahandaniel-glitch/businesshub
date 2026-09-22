import { prisma } from './prisma';
import { getAdminSession, type AdminSessionPayload } from './admin-session';
import { AdminRole, type PermissionKey } from '@prisma/client';
import { NextResponse } from 'next/server';

export type CurrentAdmin = {
  id: string;
  fullName: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN';
  mustChangePassword: boolean;
};

export async function getCurrentAdmin(): Promise<CurrentAdmin | null> {
  const session: AdminSessionPayload | null = await getAdminSession();
  if (!session) return null;

  try {
    const admin = await prisma.admin.findUnique({
      where: { id: session.adminId },
      select: { id: true, fullName: true, email: true, role: true, status: true, mustChangePassword: true }
    });
    if (!admin || admin.status !== 'ACTIVE') return null;

    return {
      id: admin.id,
      fullName: admin.fullName,
      email: admin.email,
      role: admin.role,
      mustChangePassword: admin.mustChangePassword
    };
  } catch {
    return null;
  }
}

type PermissionAction = 'view' | 'create' | 'edit' | 'delete';

/**
 * A Super Admin always has every permission (see the "Important
 * administrative rule" in the project spec). A regular Admin is checked
 * against their explicitly granted AdminPermission row for that key -
 * no row, or the row missing that action, means no access.
 */
export async function hasPermission(admin: CurrentAdmin, key: PermissionKey, action: PermissionAction = 'view') {
  if (admin.role === AdminRole.SUPER_ADMIN) return true;

  try {
    const permission = await prisma.adminPermission.findUnique({
      where: { adminId_key: { adminId: admin.id, key } }
    });
    if (!permission) return false;

    switch (action) {
      case 'view':
        return permission.canView;
      case 'create':
        return permission.canCreate;
      case 'edit':
        return permission.canEdit;
      case 'delete':
        return permission.canDelete;
      default:
        return false;
    }
  } catch {
    return false;
  }
}

/**
 * The single check every admin API route makes before doing anything:
 * not signed in -> 401, signed in but lacking the specific permission for
 * this action -> 403, otherwise the caller gets the admin back and
 * proceeds. Keeping this in one place means every admin route enforces
 * RBAC the same way rather than each one reimplementing the check.
 */
export async function requireAdminPermission(
  key: PermissionKey,
  action: PermissionAction = 'view'
): Promise<{ admin: CurrentAdmin } | { response: NextResponse }> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { response: NextResponse.json({ error: 'Not signed in.' }, { status: 401 }) };
  }

  const allowed = await hasPermission(admin, key, action);
  if (!allowed) {
    return { response: NextResponse.json({ error: 'You do not have permission to do this.' }, { status: 403 }) };
  }

  return { admin };
}
