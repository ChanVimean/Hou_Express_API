import {
  IsOptional,
  IsInt,
  Min,
  Max,
  IsEnum,
  IsString,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  TicketStatus,
  TicketPriority,
} from '../../../generated/prisma/client.js';

export class GetTicketsQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 10;

  @IsOptional()
  @IsEnum(TicketStatus)
  status?: TicketStatus;

  @IsOptional()
  @IsEnum(TicketPriority)
  priority?: TicketPriority;

  // Category filter
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  categoryId?: number;

  // Minimum estimate filter
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  estimateMin?: number;

  // Maximum estimate filter
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  estimateMax?: number;

  @IsOptional()
  @IsString()
  search?: string;
}
