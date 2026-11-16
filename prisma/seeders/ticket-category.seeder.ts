import { PrismaClient } from '../../src/generated/prisma/client.js';

export async function seedTicketCategories(prisma: PrismaClient) {
  console.info('Seeding ticket categories...');

  try {
    const categories = [
      { name: 'IT Support', isActive: true },
      { name: 'Facility Maintenance', isActive: true },
      { name: 'Office Supplies', isActive: true },
      { name: 'Equipment Request', isActive: true },
    ];

    const results: Array<{ id: number; name: string; isActive: boolean }> = [];

    for (const cat of categories) {
      const existing = await prisma.ticketCategory.findUnique({
        where: { name: cat.name },
      });

      if (existing) {
        console.warn(`Category already exists, skipping: ${cat.name}`);
        results.push(existing);
        continue;
      }

      const created = await prisma.ticketCategory.create({
        data: cat,
      });
      results.push(created);
    }

    console.table(results);
    console.info('Ticket categories seeded successfully.\n');
  } catch (error) {
    console.error('Failed while seeding ticket categories:', error);
    throw error;
  }
}
