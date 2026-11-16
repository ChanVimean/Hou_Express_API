import {
  IsInt,
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsDateString,
} from 'class-validator';
import { TicketPriority } from '../../../generated/prisma/client.js';

export class CreateTicketDto {
  @IsInt()
  categoryId: number;

  @IsString()
  description: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  estimateAmount: number;

  @IsEnum(TicketPriority)
  @IsOptional()
  priority?: TicketPriority;

  @IsDateString()
  deadline: string;

  @IsString()
  requestedBy: string;
}
