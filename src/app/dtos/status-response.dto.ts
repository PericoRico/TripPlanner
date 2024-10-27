import { ApiProperty } from '@nestjs/swagger';

export class StatusResponseDto {
    @ApiProperty({ description: 'Status of the application', example: 'ok' })
    status: string;
}