import { Controller, Get, Post, Body, Patch, Param, Delete, Query, BadRequestException } from '@nestjs/common';
import { TripsService } from './trips.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { SortBy } from './enums/sort-by.enum';
import { GetTripsDto } from './dto/get-trips.dto';

@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) { }

  @Get()
  async getTrips(
    @Query() query: GetTripsDto
  ) {
    if (!query.origin || !query.destination) {
      throw new BadRequestException('Origin and destination are required.');
    }
    return await this.tripsService.getSortedTrips(query.origin, query.destination, query.sort_by);
  }

}
