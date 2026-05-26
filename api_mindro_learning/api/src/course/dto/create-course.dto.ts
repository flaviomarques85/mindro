import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateCourseDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  level?: string;

  @ApiProperty()
  user: {
    connect: { id: string };
  };

  @ApiProperty()
  language: {
    connect: { id: string };
  };
}
