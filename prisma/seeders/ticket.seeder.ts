import {
  PrismaClient,
  TicketPriority,
  TicketStatus,
  PaymentStatus,
  TicketHistoryAction,
} from '../../src/generated/prisma/client.js';

export async function seedTickets(prisma: PrismaClient) {
  console.info('Seeding tickets, payments, and history logs...');

  try {
    // 1. Fetch prerequisite records (users and categories) to link foreign keys
    const staffUser = await prisma.user.findFirst({
      where: { email: 'staff@gmail.com' },
    });

    const adminUser = await prisma.user.findFirst({
      where: { email: 'admin@gmail.com' },
    });

    const category = await prisma.ticketCategory.findFirst({
      where: { name: 'IT Support' },
    });

    if (!staffUser || !adminUser || !category) {
      console.warn(
        'Skipping ticket seeding: Required users or ticket categories were not found.',
      );
      return;
    }

    const sampleTickets = [
      {
        ticketNumber: 'TICK-2026-001',
        categoryId: category.id,
        description: 'New developer laptop setup and license installation.',
        estimateAmount: 1500.0,
        priority: TicketPriority.URGENT,
        status: TicketStatus.APPROVED,
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        requestedBy: staffUser.id,
        payment: {
          status: PaymentStatus.PAID,
          paidBy: adminUser.id,
          paidAt: new Date(),
        },
        history: [
          {
            action: TicketHistoryAction.SUBMITTED,
            actionBy: staffUser.id,
            comment: 'Ticket submitted for approval.',
          },
          {
            action: TicketHistoryAction.APPROVED,
            actionBy: adminUser.id,
            comment: 'Approved for hardware purchase.',
          },
        ],
        attachment: {
          fileName: 'quote.pdf',
          filePath: '/uploads/tickets/quote.pdf',
          mimeType: 'application/pdf',
          fileSize: 102400,
        },
      },
      {
        ticketNumber: 'TICK-2026-002',
        categoryId: category.id,
        description: 'Ergonomic office chair replacement.',
        estimateAmount: 250.0,
        priority: TicketPriority.NORMAL,
        status: TicketStatus.PENDING,
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        requestedBy: staffUser.id,
        payment: {
          status: PaymentStatus.UNPAID,
        },
        history: [
          {
            action: TicketHistoryAction.SUBMITTED,
            actionBy: staffUser.id,
            comment: 'Submitted initial request.',
          },
        ],
      },
    ];

    const seededTicketsSummary: Array<{
      id: number;
      ticketNumber: string;
      status: string;
      priority: string;
    }> = [];

    for (const ticketData of sampleTickets) {
      const { payment, history, attachment, ...rest } = ticketData;

      const existing = await prisma.ticket.findUnique({
        where: { ticketNumber: rest.ticketNumber },
      });

      if (existing) {
        console.warn(`Ticket already exists, skipping: ${rest.ticketNumber}`);
        seededTicketsSummary.push({
          id: existing.id,
          ticketNumber: existing.ticketNumber,
          status: existing.status,
          priority: existing.priority,
        });
        continue;
      }

      // Create ticket along with nested relations in a clean transaction
      const created = await prisma.ticket.create({
        data: {
          ...rest,
          payment: payment ? { create: payment } : undefined,
          statusHistory: history ? { create: history } : undefined,
          attachments: attachment ? { create: [attachment] } : undefined,
        },
      });

      seededTicketsSummary.push({
        id: created.id,
        ticketNumber: created.ticketNumber,
        status: created.status,
        priority: created.priority,
      });
    }

    console.table(seededTicketsSummary);
    console.info('Tickets and related relations seeded successfully.\n');
  } catch (error) {
    console.error('Failed while seeding tickets:', error);
    throw error;
  }
}
