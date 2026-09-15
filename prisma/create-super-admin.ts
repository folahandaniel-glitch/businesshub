/**
 * First-time Super Admin setup.
 * Run once: npm run setup:admin
 *
 * Credentials are read from environment variables. Nothing is hardcoded,
 * and the account is forced to change its password on first login.
 */
import { PrismaClient, AdminRole, PermissionKey } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SUPER_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.SUPER_ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error('Set SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD in .env before running this script.');
  }
  if (password.length < 12) {
    throw new Error('SUPER_ADMIN_PASSWORD must be at least 12 characters.');
  }

  const existing = await prisma.admin.findFirst({ where: { role: AdminRole.SUPER_ADMIN } });
  if (existing) {
    console.log(`A Super Admin already exists (${existing.email}). No changes made.`);
    return;
  }

  const admin = await prisma.admin.create({
    data: {
      fullName: 'Super Admin',
      email,
      passwordHash: await bcrypt.hash(password, 12),
      role: AdminRole.SUPER_ADMIN,
      mustChangePassword: true,
      permissions: {
        create: Object.values(PermissionKey).map((key) => ({
          key,
          canView: true,
          canCreate: true,
          canEdit: true,
          canDelete: true
        }))
      }
    }
  });

  await prisma.auditLog.create({
    data: { adminId: admin.id, actorLabel: admin.email, action: 'SUPER_ADMIN_CREATED', entity: 'Admin', entityId: admin.id }
  });

  console.log(`Super Admin created: ${admin.email}. Change the password immediately after first login.`);
}

main()
  .catch((e) => {
    console.error(e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
