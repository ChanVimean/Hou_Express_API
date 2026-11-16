import 'dotenv/config';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../../src/generated/prisma/client.js';
import { seedUsers } from './user.seeder.js';
import { seedTicketCategories } from './ticket-category.seeder.js';
import { seedTickets } from './ticket.seeder.js';

const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

async function seeder() {
  console.time('Total Seed Duration');
  console.info('Starting complete database seeding sequence...\n');

  // Seeders
  await seedUsers(prisma);
  await seedTicketCategories(prisma);
  await seedTickets(prisma);

  console.info('All seeders finished successfully.');
  console.timeEnd('Total Seed Duration');
}

seeder()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
