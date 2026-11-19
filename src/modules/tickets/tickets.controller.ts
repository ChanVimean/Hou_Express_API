import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { TicketsService } from './tickets.service.js';
import { CreateTicketDto } from './dto/create-ticket.dto.js';
import { GetTicketsQueryDto } from './dto/get-tickets-query.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.type.js';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketService: TicketsService) {}

  @Get()
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
}
