import { IsOptional, IsInt, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { TicketStatus } from '../../../generated/prisma/client.js';

export class GetTicketsQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @IsOptional()
  @IsEnum(TicketStatus)
  status?: TicketStatus;
}
