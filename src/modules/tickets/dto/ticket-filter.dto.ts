import { IsOptional, IsEnum, IsDateString } from 'class-validator';
import { TicketStatus } from '../../../generated/prisma/client.js';

export class TicketFilterDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsEnum(TicketStatus)
  status?: TicketStatus;
}
