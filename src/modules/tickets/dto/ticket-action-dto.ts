import { IsOptional, IsString } from 'class-validator';

export class TicketActionDto {
  @IsOptional()
  @IsString()
  comment?: string;
}
