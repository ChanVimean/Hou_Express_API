import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { TicketsService } from './tickets.service.js';
import { CreateTicketDto } from './dto/create-ticket.dto.js';
import { UpdateTicketStatusDto } from './dto/update-ticket-status.dto.js';
import { TicketFilterDto } from './dto/ticket-filter.dto.js';
import { GetTicketsQueryDto } from './dto/get-tickets-query.dto.js';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketService: TicketsService) {}

  @Post('create')
  async create(@Body() createTicketDto: CreateTicketDto) {
    return this.ticketService.create(createTicketDto);
  }

  @Get('')
  async findAll(@Query() query: GetTicketsQueryDto) {
    return this.ticketService.findAll(query);
  }

  @Get('open')
  async getOpenTickets() {
    return this.ticketService.findAllOpen();
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateTicketStatusDto,
  ) {
    return this.ticketService.updateStatus(Number(id), updateStatusDto);
  }

  @Get('history')
  async getFilteredTickets(@Query() filters: TicketFilterDto) {
    return this.ticketService.findFiltered(filters);
  }
}
