import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsIn, IsNotEmpty, IsString } from "class-validator";
import { VALID_AIRPORTS } from "../enums/airports.constant";
import { SortBy } from "../enums/sort-by.enum";

export class GetTripsDto {
    @ApiProperty({ example: "SYD", description: "IATA code of the origin", required: true })
    @IsNotEmpty()
    @IsIn(VALID_AIRPORTS, { message: 'Origin must be a valid airport code.' })
    origin: string;

    @ApiProperty({ example: "ATL", description: "IATA code of the destination", required: true })
    @IsNotEmpty()
    @IsIn(VALID_AIRPORTS, { message: 'Destination must be a valid airport code.' })
    destination: string;

    @ApiProperty({ name: 'sort_by', description: 'Sorting strategy: fastest or cheapest', required: true, enum: SortBy })
    @IsNotEmpty()
    @IsEnum(SortBy)
    sort_by: SortBy;
}


