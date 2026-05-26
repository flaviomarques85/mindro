import { IsString, IsUUID, IsDateString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty()
  @IsUUID()
  userId: string;

  @ApiProperty()
  @IsUUID()
  teacherId: string;

  @ApiProperty()
  @IsDateString()
  date: string;

  @ApiProperty()
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsString()
  status: string;
}

export class CreateCheckoutDto {
  @ApiProperty()
  @IsUUID()
  userId: string;
}
