import * as bcrypt from 'bcrypt';
import { PrismaClient } from '../../src/generated/prisma/client.js';

export async function seedUsers(prisma: PrismaClient) {
  console.info('Seeding roles and users...');

  try {
    const hashedPassword = await bcrypt.hash('Password123!', 10);

    // 1. Ensure default roles exist first
    const adminRole = await prisma.role.upsert({
      where: { name: 'ADMIN' },
      update: {},
      create: { name: 'ADMIN' },
    });

    const staffRole = await prisma.role.upsert({
      where: { name: 'STAFF' },
      update: {},
      create: { name: 'STAFF' },
    });

    // 2. Define users (mapping hashedPassword -> hashPassword field)
    const usersToSeed = [
      {
        email: 'admin@gmail.com',
        name: 'System Admin',
        hashPassword: hashedPassword,
        status: 1,
        roleId: adminRole.id,
        roleName: adminRole.name,
      },
      {
        email: 'staff@gmail.com',
        name: 'Staff Requester',
        hashPassword: hashedPassword,
        status: 1,
        roleId: staffRole.id,
        roleName: staffRole.name,
      },
    ];

    const seededResults: Array<{
      id: string;
      name: string;
      email: string;
      role: string;
    }> = [];

    for (const { roleName, ...userData } of usersToSeed) {
      const existing = await prisma.user.findUnique({
        where: { email: userData.email },
      });

      if (existing) {
        console.warn(
          `User already exists, skipping creation: ${userData.email}`,
        );
        seededResults.push({
          id: existing.id,
          name: existing.name,
          email: existing.email,
          role: roleName,
        });
        continue;
      }

      const created = await prisma.user.create({
        data: userData,
      });

      seededResults.push({
        id: created.id,
        name: created.name,
        email: created.email,
        role: roleName,
      });
    }

    // Print a clean table of IDs ready to copy-paste into Postman
    console.table(seededResults);
  } catch (error) {
    console.error('Failed while seeding users:', error);
    throw error;
  }
}
