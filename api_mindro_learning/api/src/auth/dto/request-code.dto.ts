import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RequestCodeDto {
    @ApiProperty()
    @IsString()
    userId: string;
}
