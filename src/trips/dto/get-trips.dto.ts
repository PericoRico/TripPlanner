import { IsEnum, IsIn, IsNotEmpty, IsString } from "class-validator";
import { VALID_AIRPORTS } from "../enums/airports.constant";
import { SortBy } from "../enums/sort-by.enum";

export class GetTripsDto {
    @IsNotEmpty()
    @IsIn(VALID_AIRPORTS, { message: 'Origin must be a valid airport code.' })
    origin: string;

    @IsNotEmpty()
    @IsIn(VALID_AIRPORTS, { message: 'Destination must be a valid airport code.' })
    destination: string;

    @IsNotEmpty()
    @IsEnum(SortBy)
    sort_by: SortBy;
}


