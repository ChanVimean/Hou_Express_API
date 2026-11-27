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
    // ======================================================
    // 1. Fetch prerequisite users and category
    // ======================================================

    const staff1User = await prisma.user.findUnique({
      where: { email: 'staff1@gmail.com' },
    });

    const staff2User = await prisma.user.findUnique({
      where: { email: 'staff2@gmail.com' },
    });

    const staff3User = await prisma.user.findUnique({
      where: { email: 'staff3@gmail.com' },
    });

    const supervisorUser = await prisma.user.findUnique({
      where: { email: 'supervisor@gmail.com' },
    });

    const managerUser = await prisma.user.findUnique({
      where: { email: 'manager@gmail.com' },
    });

    const ceoUser = await prisma.user.findUnique({
      where: { email: 'ceo@gmail.com' },
    });

    const category = await prisma.ticketCategory.findFirst({
      where: { name: 'IT Support' },
    });

    if (
      !staff1User ||
      !staff2User ||
      !staff3User ||
      !supervisorUser ||
      !managerUser ||
      !ceoUser ||
      !category
    ) {
      console.warn(
        'Skipping ticket seeding: Required users or ticket category were not found.',
      );
      return;
    }

    // Admin is intentionally excluded from this test seed.
    const actionUsers = [supervisorUser, managerUser, ceoUser];

    // ======================================================
    // 2. Sample ticket data (4 tickets per staff member)
    // ======================================================

    const sampleTickets = [
      // --------------------------------------------------
      // STAFF 1
      // --------------------------------------------------

      {
        ticketNumber: 'TICK-2026-001',
        categoryId: category.id,
        description: 'New developer laptop setup and license installation.',
        estimateAmount: 1500,
        priority: TicketPriority.URGENT,
        status: TicketStatus.SUBMIT,
        deadline: new Date(Date.now() + 7 * 86400000),
        requestedBy: staff1User.id,
        payment: {
          status: PaymentStatus.UNPAID,
        },
        history: [
          {
            action: TicketHistoryAction.SUBMITTED,
            actionBy: staff1User.id,
            comment: 'Submitted for a new developer workstation.',
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
        estimateAmount: 250,
        priority: TicketPriority.NORMAL,
        status: TicketStatus.SUBMIT,
        deadline: new Date(Date.now() + 14 * 86400000),
        requestedBy: staff1User.id,
        payment: {
          status: PaymentStatus.UNPAID,
        },
        history: [
          {
            action: TicketHistoryAction.SUBMITTED,
            actionBy: staff1User.id,
            comment: 'Submitted initial request for a replacement chair.',
          },
        ],
      },

      {
        ticketNumber: 'TICK-2026-003',
        categoryId: category.id,
        description: 'Purchase additional monitor for development work.',
        estimateAmount: 320,
        priority: TicketPriority.URGENT,
        status: TicketStatus.SUBMIT,
        deadline: new Date(Date.now() + 10 * 86400000),
        requestedBy: staff1User.id,
        payment: {
          status: PaymentStatus.UNPAID,
        },
        history: [
          {
            action: TicketHistoryAction.SUBMITTED,
            actionBy: staff1User.id,
            comment: 'Requesting an additional monitor.',
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
        estimateAmount: 85,
        priority: TicketPriority.NORMAL,
        status: TicketStatus.SUBMIT,
        deadline: new Date(Date.now() + 20 * 86400000),
        requestedBy: staff1User.id,
        payment: {
          status: PaymentStatus.UNPAID,
        },
        history: [
          {
            action: TicketHistoryAction.SUBMITTED,
            actionBy: staff1User.id,
            comment: 'Requesting replacement keyboard and mouse.',
          },
        ],
      },

      // --------------------------------------------------
      // STAFF 2
      // --------------------------------------------------

      {
        ticketNumber: 'TICK-2026-005',
        categoryId: category.id,
        description: 'Purchase software license for development tools.',
        estimateAmount: 600,
        priority: TicketPriority.URGENT,
        status: TicketStatus.SUBMIT,
        deadline: new Date(Date.now() + 5 * 86400000),
        requestedBy: staff2User.id,
        payment: {
          status: PaymentStatus.UNPAID,
        },
        history: [
          {
            action: TicketHistoryAction.SUBMITTED,
            actionBy: staff2User.id,
            comment: 'Requesting a license for development tools.',
          },
        ],
      },

      {
        ticketNumber: 'TICK-2026-006',
        categoryId: category.id,
        description: 'Office desk repair and maintenance.',
        estimateAmount: 180,
        priority: TicketPriority.NORMAL,
        status: TicketStatus.SUBMIT,
        deadline: new Date(Date.now() + 12 * 86400000),
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
        estimateAmount: 120,
        priority: TicketPriority.NORMAL,
        status: TicketStatus.SUBMIT,
        deadline: new Date(Date.now() + 15 * 86400000),
        requestedBy: staff2User.id,
        payment: {
          status: PaymentStatus.UNPAID,
        },
        history: [
          {
            action: TicketHistoryAction.SUBMITTED,
            actionBy: staff2User.id,
            comment: 'Need external storage for project backup.',
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
        estimateAmount: 45,
        priority: TicketPriority.NORMAL,
        status: TicketStatus.SUBMIT,
        deadline: new Date(Date.now() + 30 * 86400000),
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

      // --------------------------------------------------
      // STAFF 3
      // --------------------------------------------------

      {
        ticketNumber: 'TICK-2026-009',
        categoryId: category.id,
        description: 'Replacement laptop battery and maintenance.',
        estimateAmount: 220,
        priority: TicketPriority.URGENT,
        status: TicketStatus.SUBMIT,
        deadline: new Date(Date.now() + 3 * 86400000),
        requestedBy: staff3User.id,
        payment: {
          status: PaymentStatus.UNPAID,
        },
        history: [
          {
            action: TicketHistoryAction.SUBMITTED,
            actionBy: staff3User.id,
            comment: 'Laptop battery no longer holds charge.',
          },
        ],
      },

      {
        ticketNumber: 'TICK-2026-010',
        categoryId: category.id,
        description: 'Request for a second office monitor.',
        estimateAmount: 280,
        priority: TicketPriority.NORMAL,
        status: TicketStatus.SUBMIT,
        deadline: new Date(Date.now() + 18 * 86400000),
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
        estimateAmount: 160,
        priority: TicketPriority.URGENT,
        status: TicketStatus.SUBMIT,
        deadline: new Date(Date.now() + 8 * 86400000),
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
        ],
      },

      {
        ticketNumber: 'TICK-2026-012',
        categoryId: category.id,
        description: 'Request for replacement headset for online meetings.',
        estimateAmount: 95,
        priority: TicketPriority.NORMAL,
        status: TicketStatus.SUBMIT,
        deadline: new Date(Date.now() + 25 * 86400000),
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

    // ======================================================
    // 3. Assign workflow statuses and action history
    // ======================================================

    const testStatuses = [
      TicketStatus.SUBMIT, // 001
      TicketStatus.PENDING, // 002
      TicketStatus.APPROVED, // 003
      TicketStatus.REJECTED, // 004

      TicketStatus.SUBMIT, // 005
      TicketStatus.PENDING, // 006
      TicketStatus.APPROVED, // 007
      TicketStatus.REJECTED, // 008

      TicketStatus.SUBMIT, // 009
      TicketStatus.PENDING, // 010
      TicketStatus.APPROVED, // 011
      TicketStatus.REJECTED, // 012
    ];

    const pendingComments = [
      'Returned to pending for additional verification.',
      'Waiting for additional information.',
      'Pending budget confirmation.',
    ];

    const approvedComments = [
      'Approved after reviewing the request.',
      'Approved for department operational needs.',
      'Approved. Proceed with the requested purchase.',
    ];

    const rejectedComments = [
      'Rejected due to insufficient justification.',
      'Rejected. Please provide additional documentation.',
      'Rejected after reviewing the request.',
    ];

    const workflowTickets = sampleTickets.map((ticket, index) => {
      const status = testStatuses[index];

      const submittedHistory = ticket.history.filter(
        (history) => history.action === TicketHistoryAction.SUBMITTED,
      );

      // SUBMIT: only submission history; no action yet
      if (status === TicketStatus.SUBMIT) {
        return {
          ...ticket,
          status,
          payment: {
            status: PaymentStatus.UNPAID,
          },
          history: submittedHistory,
        };
      }

      // Deterministic action-user assignment
      const actionUser = actionUsers[index % actionUsers.length];

      let action: TicketHistoryAction;
      let comment: string;

      switch (status) {
        case TicketStatus.PENDING:
          action = TicketHistoryAction.PENDING;
          comment = pendingComments[index % pendingComments.length];
          break;

        case TicketStatus.APPROVED:
          action = TicketHistoryAction.APPROVED;
          comment = approvedComments[index % approvedComments.length];
          break;

        case TicketStatus.REJECTED:
          action = TicketHistoryAction.REJECTED;
          comment = rejectedComments[index % rejectedComments.length];
          break;

        default:
          return ticket;
      }

      return {
        ...ticket,
        status,
        payment: {
          status: PaymentStatus.UNPAID,
        },
        history: [
          ...submittedHistory,
          {
            action,
            actionBy: actionUser.id,
            comment,
          },
        ],
      };
    });

    // ======================================================
    // 4. Seed/update tickets and nested relations
    // ======================================================

    const seededTicketsSummary: Array<{
      id: number;
      ticketNumber: string;
      status: string;
      priority: string;
    }> = [];

    for (const ticketData of workflowTickets) {
      const { payment, history, attachment, ...rest } = ticketData;

      const savedTicket = await prisma.ticket.upsert({
        where: {
          ticketNumber: rest.ticketNumber,
        },

        // --------------------------------------------------
        // CREATE new ticket
        // --------------------------------------------------

        create: {
          ...rest,

          payment: payment
            ? {
                create: {
                  ...payment,
                  paidBy: null,
                  paidAt: null,
                },
              }
            : undefined,

          statusHistory: history
            ? {
                create: history,
              }
            : undefined,

          attachments: attachment
            ? {
                create: [attachment],
              }
            : undefined,
        },

        // --------------------------------------------------
        // UPDATE existing ticket
        // --------------------------------------------------

        update: {
          ...rest,

          // Remove old histories (including old Admin actions)
          // and recreate the test history
          statusHistory: {
            deleteMany: {},
            create: history,
          },

          // Reset payment data for test purposes
          payment: payment
            ? {
                upsert: {
                  create: {
                    ...payment,
                    paidBy: null,
                    paidAt: null,
                  },
                  update: {
                    status: PaymentStatus.UNPAID,
                    paidBy: null,
                    paidAt: null,
                  },
                },
              }
            : undefined,

          // Existing attachments are intentionally preserved.
          // New attachments are only created for new tickets.
        },
      });

      seededTicketsSummary.push({
        id: savedTicket.id,
        ticketNumber: savedTicket.ticketNumber,
        status: savedTicket.status,
        priority: savedTicket.priority,
      });
    }

    // ======================================================
    // 5. Display seeded tickets
    // ======================================================

    console.table(seededTicketsSummary);

    console.info(
      `Successfully seeded/updated ${seededTicketsSummary.length} tickets and related relations.\n`,
    );
  } catch (error) {
    console.error('Failed while seeding tickets:', error);
    throw error;
  }
}
