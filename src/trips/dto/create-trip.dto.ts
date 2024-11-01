import { IsNotEmpty, IsString, IsEnum, IsNumber, IsUUID, Length, IsIn } from 'class-validator';
import { TripType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { VALID_AIRPORTS } from '../enums/airports.constant';

export class CreateTripDto {
    @ApiProperty({ description: 'Unique identifier for the trip' })
    @IsUUID()
    id: string;

    @ApiProperty({ description: 'IATA code of the origin airport' })
    @IsNotEmpty()
    @IsIn(VALID_AIRPORTS, { message: 'Origin must be a valid airport code.' })
    origin: string;

    @ApiProperty({ description: 'IATA code of the destination airport' })
    @IsNotEmpty()
    @IsIn(VALID_AIRPORTS, { message: 'Destination must be a valid airport code.' })
    destination: string;

    @ApiProperty({ description: 'Cost of the trip', example: 7333 })
    @IsNotEmpty()
    @IsNumber()
    cost: number;

    @ApiProperty({ description: 'Duration of the trip in hours', example: 2 })
    @IsNotEmpty()
    @IsNumber()
    duration: number;

    @ApiProperty({ description: 'Type of trip', enum: TripType })
    @IsNotEmpty()
    @IsEnum(TripType)
    type: TripType;

    @ApiProperty({ description: 'Display name of the trip' })
    @IsNotEmpty()
    @IsString()
    display_name: string;
}

