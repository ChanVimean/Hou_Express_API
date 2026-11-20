import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  NotImplementedException,
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

    // Filter by status
    if (query.status) where.status = query.status;

    // Filter by priority
    if (query.priority) where.priority = query.priority;

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
    // 1. Generate a unique human-readable ticket number
    const ticketNumber = `TICK-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // 2. Run ticket creation and initial history log inside a transaction
    return await this.prisma.$transaction(async (tx) => {
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

      // Record the initial submission in status history
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
    // TODO: Implement rejection logic
    throw new NotImplementedException();
  }

  // --- Pendnig status ---
  async pendingTicket(
    ticketId: number,
    dto: TicketActionDto,
    user: AuthenticatedUser,
  ) {
    // TODO: Implement pending logic
    throw new NotImplementedException();
  }
}
