import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { CreateTicketDto } from './dto/create-ticket.dto.js';
import { UpdateTicketStatusDto } from './dto/update-ticket-status.dto.js';
import {
  Prisma,
  TicketHistoryAction,
  TicketPriority,
  TicketStatus,
} from '../../generated/prisma/client.js';
import { GetTicketsQueryDto } from './dto/get-tickets-query.dto.js';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.type.js';
import { UserRoles } from '../../common/constants/role.constants.js';
import { TicketActionDto } from './dto/ticket-action-dto.js';
import { GetActionHistoryQueryDto } from './dto/get-action-history-query.dto.js';

@Injectable()
export class TicketsService {
  constructor(private prisma: PrismaService) {}

  // --- Paginated Get All Tickets ---
  async findAllTickets(query: GetTicketsQueryDto, user: AuthenticatedUser) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.TicketWhereInput = {};

    // Access control based on role
    switch (user.role) {
      case UserRoles.STAFF:
        // Staff can only view tickets they submitted
        where.requestedBy = user.userId;
        break;

      case UserRoles.SUPERVISOR:
      case UserRoles.DEPARTMENT_MANAGER:
      case UserRoles.CEO:
      case UserRoles.ADMIN:
        // Higher roles can view all tickets
        break;

      default:
        throw new ForbiddenException(
          'You do not have permission to view tickets',
        );
    }

    // Open tab: only Submitted or Pending tickets
    const openStatuses = [TicketStatus.SUBMITTED, TicketStatus.PENDING];

    where.status = query.status
      ? {
          in: openStatuses.filter((status) => status === query.status),
        }
      : {
          in: openStatuses,
        };

    // Filter by priority
    if (query.priority) where.priority = query.priority;

    // Filter by category
    if (query.categoryId) where.categoryId = query.categoryId;

    // Filter by estimate amount
    if (query.estimateMin !== undefined || query.estimateMax !== undefined)
      where.estimateAmount = {
        ...(query.estimateMin !== undefined && {
          gte: query.estimateMin,
        }),
        ...(query.estimateMax !== undefined && {
          lte: query.estimateMax,
        }),
      };

    // Search
    if (query.search?.trim()) {
      const search = query.search.trim();

      where.OR = [
        {
          ticketNumber: {
            contains: search,
          },
        },
        {
          description: {
            contains: search,
          },
        },
        {
          requester: {
            is: {
              name: {
                contains: search,
              },
            },
          },
        },
        {
          category: {
            is: {
              name: {
                contains: search,
              },
            },
          },
        },
      ];
    }

    const [tickets, total] = await Promise.all([
      this.prisma.ticket.findMany({
        where,
        skip,
        take: limit,
        include: {
          category: true,
          requester: {
            select: {
              id: true,
              name: true,
            },
          },
          payment: true,
          attachments: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),

      this.prisma.ticket.count({ where }),
    ]);

    return {
      data: tickets,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // --- Create new ticket ---
  async createTicket(dto: CreateTicketDto) {
    return await this.prisma.$transaction(async (tx) => {
      const year = new Date().getFullYear();
      const prefix = `TICK-${year}-`;

      // Find existing ticket numbers for the current year
      const existingTickets = await tx.ticket.findMany({
        where: {
          ticketNumber: {
            startsWith: prefix,
          },
        },
        select: {
          ticketNumber: true,
        },
      });

      // Find the highest existing sequence number
      const highestSequence = existingTickets.reduce((highest, ticket) => {
        const match = ticket.ticketNumber.match(/^TICK-\d{4}-(\d+)$/);

        if (!match) return highest;

        return Math.max(highest, Number(match[1]));
      }, 0);

      const nextSequence = highestSequence + 1;
      const ticketNumber = `${prefix}${String(nextSequence).padStart(3, '0')}`;

      // Create ticket
      const ticket = await tx.ticket.create({
        data: {
          ticketNumber,
          categoryId: Number(dto.categoryId),
          description: dto.description,
          estimateAmount: dto.estimateAmount,
          priority: dto.priority || TicketPriority.NORMAL,
          status: TicketStatus.PENDING,
          deadline: new Date(dto.deadline),
          requestedBy: dto.requestedBy,
        },
      });

      // Record initial submission in status history
      await tx.ticketStatusHistory.create({
        data: {
          ticketId: ticket.id,
          action: TicketHistoryAction.SUBMITTED,
          actionBy: dto.requestedBy,
          comment: 'Ticket initially submitted.',
        },
      });

      return {
        message: 'Ticket created successfully',
        ticket,
      };
    });
  }

  // --- Update ticket Status ---
  async updateStatus(id: number, dto: UpdateTicketStatusDto) {
    // TODO: Implement status update / pop-up action logic
    return { message: `Update status shell stub for ticket ${id}` };
  }

  // --- Find all Category ---
  async findAllCategory() {
    return this.prisma.ticketCategory.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  // --- Approve status ---
  async approveTicket(
    ticketId: number,
    dto: TicketActionDto,
    user: AuthenticatedUser,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const ticket = await tx.ticket.findUnique({
        where: { id: ticketId },
      });

      if (!ticket) throw new NotFoundException('Ticket not found');

      if (ticket.status !== TicketStatus.PENDING)
        throw new ConflictException('Only pending tickets can be approved');

      const updated = await tx.ticket.updateMany({
        where: {
          id: ticketId,
          status: TicketStatus.PENDING,
        },
        data: {
          status: TicketStatus.APPROVED,
        },
      });

      if (updated.count === 0)
        throw new ConflictException(
          'Ticket status has changed. Please refresh and try again.',
        );

      await tx.ticketStatusHistory.create({
        data: {
          ticketId,
          action: TicketHistoryAction.APPROVED,
          actionBy: user.userId,
          comment: dto.comment?.trim() || null,
        },
      });

      return tx.ticket.findUnique({
        where: { id: ticketId },
      });
    });
  }

  // --- Reject status ---
  async rejectTicket(
    ticketId: number,
    dto: TicketActionDto,
    user: AuthenticatedUser,
  ) {
    // Comment is required when rejecting
    const comment = dto.comment?.trim();

    if (!comment)
      throw new BadRequestException(
        'A comment is required when rejecting a ticket',
      );

    return this.prisma.$transaction(async (tx) => {
      const ticket = await tx.ticket.findUnique({
        where: { id: ticketId },
      });

      if (!ticket) throw new NotFoundException('Ticket not found');

      if (ticket.status !== TicketStatus.PENDING)
        throw new ConflictException('Only pending tickets can be rejected');

      const updated = await tx.ticket.updateMany({
        where: {
          id: ticketId,
          status: TicketStatus.PENDING,
        },
        data: {
          status: TicketStatus.REJECTED,
        },
      });

      if (updated.count === 0)
        throw new ConflictException(
          'Ticket status has changed. Please refresh and try again.',
        );

      await tx.ticketStatusHistory.create({
        data: {
          ticketId,
          action: TicketHistoryAction.REJECTED,
          actionBy: user.userId,
          comment,
        },
      });

      return tx.ticket.findUnique({
        where: { id: ticketId },
      });
    });
  }

  // --- Mark ticket as Pending / On Hold ---
  async pendingTicket(
    ticketId: number,
    dto: TicketActionDto,
    user: AuthenticatedUser,
  ) {
    // Comment is required when marking pending
    const comment = dto.comment?.trim();

    if (!comment)
      throw new BadRequestException(
        'A comment is required when marking a ticket as pending',
      );

    return this.prisma.$transaction(async (tx) => {
      const ticket = await tx.ticket.findUnique({
        where: { id: ticketId },
      });

      if (!ticket) throw new NotFoundException('Ticket not found');

      if (ticket.status !== TicketStatus.PENDING)
        throw new ConflictException(
          'Only pending tickets can be marked as pending',
        );

      // Only create history; ticket status does NOT change
      await tx.ticketStatusHistory.create({
        data: {
          ticketId,
          action: TicketHistoryAction.PENDING,
          actionBy: user.userId,
          comment,
        },
      });

      return tx.ticket.findUnique({
        where: { id: ticketId },
      });
    });
  }

  async getTicketMetrics(user: AuthenticatedUser) {
    const where: Prisma.TicketWhereInput = {};

    // Staff can only see metrics for their own tickets
    switch (user.role) {
      case UserRoles.STAFF:
        where.requestedBy = user.userId;
        break;

      // These roles can see all tickets
      case UserRoles.SUPERVISOR:
      case UserRoles.DEPARTMENT_MANAGER:
      case UserRoles.CEO:
      case UserRoles.ADMIN:
        break;

      default:
        throw new ForbiddenException(
          'You do not have permission to view ticket metrics',
        );
    }

    const [total, pending, approved, rejected] = await Promise.all([
      this.prisma.ticket.count({
        where,
      }),

      this.prisma.ticket.count({
        where: {
          ...where,
          status: TicketStatus.PENDING,
        },
      }),

      this.prisma.ticket.count({
        where: {
          ...where,
          status: TicketStatus.APPROVED,
        },
      }),

      this.prisma.ticket.count({
        where: {
          ...where,
          status: TicketStatus.REJECTED,
        },
      }),
    ]);

    return {
      total,
      pending,
      approved,
      rejected,
    };
  }

  async getActionHistory(
    query: GetActionHistoryQueryDto,
    user: AuthenticatedUser,
  ) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    // Action history excludes SUBMITTED records
    const actionStatuses = [
      TicketHistoryAction.PENDING,
      TicketHistoryAction.APPROVED,
      TicketHistoryAction.REJECTED,
    ];

    const where: Prisma.TicketStatusHistoryWhereInput = {
      action: query.action
        ? {
            in: actionStatuses.filter((action) => action === query.action),
          }
        : {
            in: actionStatuses,
          },
    };

    // Access control
    switch (user.role) {
      case UserRoles.STAFF:
        where.ticket = {
          requestedBy: user.userId,
        };
        break;

      case UserRoles.SUPERVISOR:
      case UserRoles.DEPARTMENT_MANAGER:
      case UserRoles.CEO:
      case UserRoles.ADMIN:
        // Higher roles can view all action history
        break;

      default:
        throw new ForbiddenException(
          'You do not have permission to view action history',
        );
    }

    const [history, total] = await Promise.all([
      this.prisma.ticketStatusHistory.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          ticket: {
            include: {
              category: true,
              requester: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      }),

      this.prisma.ticketStatusHistory.count({ where }),
    ]);

    return {
      data: history,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
