import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { CreateTicketDto } from './dto/create-ticket.dto.js';
import { UpdateTicketStatusDto } from './dto/update-ticket-status.dto.js';
import { TicketFilterDto } from './dto/ticket-filter.dto.js';
import {
  Prisma,
  TicketHistoryAction,
  TicketPriority,
  TicketStatus,
} from '../../generated/prisma/client.js';
import { GetTicketsQueryDto } from './dto/get-tickets-query.dto.js';

@Injectable()
export class TicketsService {
  constructor(private prisma: PrismaService) {}

  // --- Create new ticket ---
  async create(dto: CreateTicketDto) {
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

  // --- Paginated Get All ---
  async findAll(query: GetTicketsQueryDto) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.TicketWhereInput = {};

    if (query.status) where.status = query.status;

    // Run query and total count in parallel for performance
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
        orderBy: { createdAt: 'desc' },
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

  async findAllOpen() {
    // TODO: Implement fetch open tickets logic
    return { message: 'Find all open tickets shell stub' };
  }

  async updateStatus(id: number, dto: UpdateTicketStatusDto) {
    // TODO: Implement status update / pop-up action logic
    return { message: `Update status shell stub for ticket ${id}` };
  }

  async findFiltered(filters: TicketFilterDto) {
    // TODO: Implement filtered view and print logic
    return { message: 'Filtered tickets shell stub', filters };
  }
}
