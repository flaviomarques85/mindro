import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString } from 'class-validator';

export class CreateLessonDto {
  @ApiProperty()
  user: {
    connect: { id: string };
  };

  @ApiProperty()
  teacher: {
    connect: { id: string };
  };

  @ApiProperty()
  language: {
    connect: { id: string };
  };

  @ApiProperty()
  @IsDateString()
  date: string;

  @ApiProperty()
  @IsString()
  time: string;

  @ApiProperty()
  @IsString()
  status: string;
}
