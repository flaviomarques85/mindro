import { IsString, IsOptional, IsUUID, IsInt, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty()
  @IsUUID()
  userId: string;

  @ApiProperty()
  @IsUUID()
  teacherId: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsString()
  status: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  progress?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  weight?: number

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  completedAt?: string;
}