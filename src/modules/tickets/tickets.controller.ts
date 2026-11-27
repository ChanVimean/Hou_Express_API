import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Put,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { TicketsService } from './tickets.service.js';
import { CreateTicketDto } from './dto/create-ticket.dto.js';
import { GetTicketsQueryDto } from './dto/get-tickets-query.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { RolesGuard } from '../../common/guards/role.guard.js';
import { Roles } from '../../common/decorators/role.decorator.js';
import { UserRoles } from '../../common/constants/role.constants.js';
import { TicketActionDto } from './dto/ticket-action-dto.js';
import { GetActionHistoryQueryDto } from './dto/get-action-history-query.dto.js';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.type.js';

@Controller('ticket')
export class TicketsController {
  constructor(private readonly ticketService: TicketsService) {}

  @Get('tickets')
  @UseGuards(JwtAuthGuard)
  async findAllTicket(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: GetTicketsQueryDto,
  ) {
    return this.ticketService.findAllTickets(query, user);
  }

  @Post('create')
  @UseGuards(JwtAuthGuard)
  async createTicket(@Body() createTicketDto: CreateTicketDto) {
    return this.ticketService.createTicket(createTicketDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('category')
  async findAllCategory() {
    return this.ticketService.findAllCategory();
  }

  @Get('metrics')
  @UseGuards(JwtAuthGuard)
  async getTicketMetrics(@CurrentUser() user: AuthenticatedUser) {
    return this.ticketService.getTicketMetrics(user);
  }

  @Get('action/history')
  @UseGuards(JwtAuthGuard)
  async getActionHistory(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: GetActionHistoryQueryDto,
  ) {
    return this.ticketService.getActionHistory(query, user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    UserRoles.SUPERVISOR,
    UserRoles.DEPARTMENT_MANAGER,
    UserRoles.CEO,
    UserRoles.ADMIN,
  )
  @Put(':id/approve')
  async approveTicket(
    @Param('id', ParseIntPipe) ticketId: number,
    @Body() dto: TicketActionDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.ticketService.approveTicket(ticketId, dto, user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    UserRoles.SUPERVISOR,
    UserRoles.DEPARTMENT_MANAGER,
    UserRoles.CEO,
    UserRoles.ADMIN,
  )
  @Put(':id/reject')
  async rejectTicket(
    @Param('id', ParseIntPipe) ticketId: number,
    @Body() dto: TicketActionDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.ticketService.rejectTicket(ticketId, dto, user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    UserRoles.SUPERVISOR,
    UserRoles.DEPARTMENT_MANAGER,
    UserRoles.CEO,
    UserRoles.ADMIN,
  )
  @Put(':id/pending')
  async pendingTicket(
    @Param('id', ParseIntPipe) ticketId: number,
    @Body() dto: TicketActionDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.ticketService.pendingTicket(ticketId, dto, user);
  }
}
