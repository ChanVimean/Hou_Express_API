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
import { GetTicketsQueryDto } from './dto/get-tickets-query.dto.js';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketService: TicketsService) {}

  @Get()
  async findAllTicket(@Query() query: GetTicketsQueryDto) {
    return this.ticketService.findAllTickets(query);
  }

  @Post('create')
  async createTicket(@Body() createTicketDto: CreateTicketDto) {
    return this.ticketService.createTicket(createTicketDto);
  }

  @Get('category')
  async findAllCategory() {
    return this.ticketService.findAllCategory();
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateTicketStatusDto,
  ) {
    return this.ticketService.updateStatus(Number(id), updateStatusDto);
  }
}
