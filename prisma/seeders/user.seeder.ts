import * as bcrypt from 'bcrypt';
import { PrismaClient } from '../../src/generated/prisma/client.js';

export async function seedUsers(prisma: PrismaClient) {
  console.info('Seeding roles and users...');

  try {
    const hashedPassword = await bcrypt.hash('Password123!', 10);

    const roles = [
      'ADMIN',
      'EMPLOYEE',
      'STAFF',
      'SUPERVISOR',
      'MANAGER',
      'CEO',
    ];

    const roleRecords = await Promise.all(
      roles.map((name) =>
        prisma.role.upsert({
          where: { name },
          update: {},
          create: { name },
        }),
      ),
    );

    const roleMap = Object.fromEntries(
      roleRecords.map((role) => [role.name, role.id]),
    );

    const usersToSeed = [
      {
        email: 'admin@gmail.com',
        name: 'System Admin',
        role: 'ADMIN',
      },
      {
        email: 'employee@gmail.com',
        name: 'Test Employee',
        role: 'EMPLOYEE',
      },
      {
        email: 'staff1@gmail.com',
        name: 'John Staff',
        role: 'STAFF',
      },
      {
        email: 'staff2@gmail.com',
        name: 'Jennie Staff',
        role: 'STAFF',
      },
      {
        email: 'staff3@gmail.com',
        name: 'Jin Staff',
        role: 'STAFF',
      },
      {
        email: 'supervisor@gmail.com',
        name: 'Test Supervisor',
        role: 'SUPERVISOR',
      },
      {
        email: 'manager@gmail.com',
        name: 'Test Manager',
        role: 'MANAGER',
      },
      {
        email: 'ceo@gmail.com',
        name: 'Test CEO',
        role: 'CEO',
      },
    ];

    const seededResults = [];

    for (const user of usersToSeed) {
      const { role, ...userData } = user;

      const existing = await prisma.user.findUnique({
        where: { email: user.email },
      });

      const savedUser = existing
        ? await prisma.user.update({
            where: { email: user.email },
            data: {
              roleId: roleMap[role],
            },
          })
        : await prisma.user.create({
            data: {
              ...userData,
              hashPassword: hashedPassword,
              status: 1,
              roleId: roleMap[role],
            },
          });

      seededResults.push({
        id: savedUser.id,
        name: savedUser.name,
        email: savedUser.email,
        role,
      });
    }

    console.table(seededResults);
  } catch (error) {
    console.error('Failed while seeding users:', error);
    throw error;
  }
}
