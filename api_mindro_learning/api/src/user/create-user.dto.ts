
import { IsString, IsOptional, IsDateString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  profilePicture?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  joinedDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  monthlyFee?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  teacherId?: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({ required: false })
  nextDueDate?: string;
}
