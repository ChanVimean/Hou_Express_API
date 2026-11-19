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
    // 1. Fetch prerequisite users and category
    const staff1User = await prisma.user.findFirst({
      where: { email: 'staff1@gmail.com' },
    });

    const staff2User = await prisma.user.findFirst({
      where: { email: 'staff2@gmail.com' },
    });

    const staff3User = await prisma.user.findFirst({
      where: { email: 'staff3@gmail.com' },
    });

    const adminUser = await prisma.user.findFirst({
      where: { email: 'admin@gmail.com' },
    });

    const category = await prisma.ticketCategory.findFirst({
      where: { name: 'IT Support' },
    });

    if (!staff1User || !staff2User || !staff3User || !adminUser || !category) {
      console.warn(
        'Skipping ticket seeding: Required users or ticket categories were not found.',
      );
      return;
    }

    // 2. Sample ticket data (4 tickets per staff member)
    const sampleTickets = [
      // ==========================================
      // STAFF 1
      // ==========================================
      {
        ticketNumber: 'TICK-2026-001',
        categoryId: category.id,
        description: 'New developer laptop setup and license installation.',
        estimateAmount: 1500.0,
        priority: TicketPriority.URGENT,
        status: TicketStatus.APPROVED,
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        requestedBy: staff1User.id,
        payment: {
          status: PaymentStatus.PAID,
          paidBy: adminUser.id,
          paidAt: new Date(),
        },
        history: [
          {
            action: TicketHistoryAction.SUBMITTED,
            actionBy: staff1User.id,
            comment: 'Ticket submitted for approval.',
          },
          {
            action: TicketHistoryAction.APPROVED,
            actionBy: adminUser.id,
            comment: 'Approved for hardware purchase.',
          },
        ],
        attachment: {
          fileName: 'laptop-quote.pdf',
          filePath: '/uploads/tickets/laptop-quote.pdf',
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
        requestedBy: staff1User.id,
        payment: {
          status: PaymentStatus.UNPAID,
        },
        history: [
          {
            action: TicketHistoryAction.SUBMITTED,
            actionBy: staff1User.id,
            comment: 'Submitted initial request.',
          },
        ],
      },
      {
        ticketNumber: 'TICK-2026-003',
        categoryId: category.id,
        description: 'Purchase additional monitor for development work.',
        estimateAmount: 320.0,
        priority: TicketPriority.URGENT,
        status: TicketStatus.APPROVED,
        deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        requestedBy: staff1User.id,
        payment: {
          status: PaymentStatus.PAID,
          paidBy: adminUser.id,
          paidAt: new Date(),
        },
        history: [
          {
            action: TicketHistoryAction.SUBMITTED,
            actionBy: staff1User.id,
            comment: 'Requesting an additional monitor.',
          },
          {
            action: TicketHistoryAction.APPROVED,
            actionBy: adminUser.id,
            comment: 'Approved for productivity improvement.',
          },
        ],
        attachment: {
          fileName: 'monitor-quotation.png',
          filePath: '/uploads/tickets/monitor-quotation.png',
          mimeType: 'image/png',
          fileSize: 51200,
        },
      },
      {
        ticketNumber: 'TICK-2026-004',
        categoryId: category.id,
        description: 'Replacement keyboard and mouse due to damaged equipment.',
        estimateAmount: 85.0,
        priority: TicketPriority.NORMAL,
        status: TicketStatus.PENDING,
        deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        requestedBy: staff1User.id,
        payment: {
          status: PaymentStatus.UNPAID,
        },
        history: [
          {
            action: TicketHistoryAction.SUBMITTED,
            actionBy: staff1User.id,
            comment: 'Current keyboard and mouse are damaged.',
          },
        ],
      },

      // ==========================================
      // STAFF 2
      // ==========================================
      {
        ticketNumber: 'TICK-2026-005',
        categoryId: category.id,
        description: 'Purchase software license for development tools.',
        estimateAmount: 600.0,
        priority: TicketPriority.URGENT,
        status: TicketStatus.APPROVED,
        deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        requestedBy: staff2User.id,
        payment: {
          status: PaymentStatus.UNPAID,
        },
        history: [
          {
            action: TicketHistoryAction.SUBMITTED,
            actionBy: staff2User.id,
            comment: 'Requesting software license for development.',
          },
          {
            action: TicketHistoryAction.APPROVED,
            actionBy: adminUser.id,
            comment: 'Approved. Awaiting payment.',
          },
        ],
      },
      {
        ticketNumber: 'TICK-2026-006',
        categoryId: category.id,
        description: 'Office desk repair and maintenance.',
        estimateAmount: 180.0,
        priority: TicketPriority.NORMAL,
        status: TicketStatus.PENDING,
        deadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
        requestedBy: staff2User.id,
        payment: {
          status: PaymentStatus.UNPAID,
        },
        history: [
          {
            action: TicketHistoryAction.SUBMITTED,
            actionBy: staff2User.id,
            comment: 'Desk requires repair due to damaged legs.',
          },
        ],
      },
      {
        ticketNumber: 'TICK-2026-007',
        categoryId: category.id,
        description: 'Request for external hard drive for project backup.',
        estimateAmount: 120.0,
        priority: TicketPriority.NORMAL,
        status: TicketStatus.APPROVED,
        deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        requestedBy: staff2User.id,
        payment: {
          status: PaymentStatus.PAID,
          paidBy: adminUser.id,
          paidAt: new Date(),
        },
        history: [
          {
            action: TicketHistoryAction.SUBMITTED,
            actionBy: staff2User.id,
            comment: 'Need external storage for project backup.',
          },
          {
            action: TicketHistoryAction.APPROVED,
            actionBy: adminUser.id,
            comment: 'Approved for project backup.',
          },
        ],
        attachment: {
          fileName: 'storage-price.jpg',
          filePath: '/uploads/tickets/storage-price.jpg',
          mimeType: 'image/jpeg',
          fileSize: 75000,
        },
      },
      {
        ticketNumber: 'TICK-2026-008',
        categoryId: category.id,
        description: 'Request for additional office supplies.',
        estimateAmount: 45.0,
        priority: TicketPriority.NORMAL,
        status: TicketStatus.PENDING,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        requestedBy: staff2User.id,
        payment: {
          status: PaymentStatus.UNPAID,
        },
        history: [
          {
            action: TicketHistoryAction.SUBMITTED,
            actionBy: staff2User.id,
            comment: 'Requesting additional office supplies.',
          },
        ],
      },

      // ==========================================
      // STAFF 3
      // ==========================================
      {
        ticketNumber: 'TICK-2026-009',
        categoryId: category.id,
        description: 'Replacement laptop battery and maintenance.',
        estimateAmount: 220.0,
        priority: TicketPriority.URGENT,
        status: TicketStatus.APPROVED,
        deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        requestedBy: staff3User.id,
        payment: {
          status: PaymentStatus.PAID,
          paidBy: adminUser.id,
          paidAt: new Date(),
        },
        history: [
          {
            action: TicketHistoryAction.SUBMITTED,
            actionBy: staff3User.id,
            comment: 'Laptop battery no longer holds charge.',
          },
          {
            action: TicketHistoryAction.APPROVED,
            actionBy: adminUser.id,
            comment: 'Approved as urgent equipment maintenance.',
          },
        ],
      },
      {
        ticketNumber: 'TICK-2026-010',
        categoryId: category.id,
        description: 'Request for a second office monitor.',
        estimateAmount: 280.0,
        priority: TicketPriority.NORMAL,
        status: TicketStatus.PENDING,
        deadline: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
        requestedBy: staff3User.id,
        payment: {
          status: PaymentStatus.UNPAID,
        },
        history: [
          {
            action: TicketHistoryAction.SUBMITTED,
            actionBy: staff3User.id,
            comment: 'Requesting a second monitor for multitasking.',
          },
        ],
      },
      {
        ticketNumber: 'TICK-2026-011',
        categoryId: category.id,
        description: 'Purchase of a USB-C docking station.',
        estimateAmount: 160.0,
        priority: TicketPriority.URGENT,
        status: TicketStatus.APPROVED,
        deadline: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
        requestedBy: staff3User.id,
        payment: {
          status: PaymentStatus.UNPAID,
        },
        history: [
          {
            action: TicketHistoryAction.SUBMITTED,
            actionBy: staff3User.id,
            comment: 'Requesting docking station for laptop connectivity.',
          },
          {
            action: TicketHistoryAction.APPROVED,
            actionBy: adminUser.id,
            comment: 'Approved for workstation setup.',
          },
        ],
      },
      {
        ticketNumber: 'TICK-2026-012',
        categoryId: category.id,
        description: 'Request for replacement headset for online meetings.',
        estimateAmount: 95.0,
        priority: TicketPriority.NORMAL,
        status: TicketStatus.PENDING,
        deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        requestedBy: staff3User.id,
        payment: {
          status: PaymentStatus.UNPAID,
        },
        history: [
          {
            action: TicketHistoryAction.SUBMITTED,
            actionBy: staff3User.id,
            comment: 'Existing headset has audio issues.',
          },
        ],
      },
    ];

    // 3. Seed tickets and nested relations
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

    // 4. Display seeded tickets
    console.table(seededTicketsSummary);

    console.info(
      `Successfully seeded ${seededTicketsSummary.length} tickets and related relations.\n`,
    );
  } catch (error) {
    console.error('Failed while seeding tickets:', error);
    throw error;
  }
}
