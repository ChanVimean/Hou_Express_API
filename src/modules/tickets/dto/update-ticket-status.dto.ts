import { IsEnum, IsString, IsOptional } from 'class-validator';
import { TicketStatus } from '../../../generated/prisma/client.js';

export class UpdateTicketStatusDto {
  @IsEnum(TicketStatus)
  status: TicketStatus;

  @IsString()
  actionBy: string;

  @IsString()
  @IsOptional()
  comment?: string;
}
