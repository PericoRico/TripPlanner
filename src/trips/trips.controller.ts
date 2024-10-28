import { Controller, Get, Query, BadRequestException, Post, Delete, Body } from '@nestjs/common';
import { TripsService } from './trips.service';
import { GetTripsDto } from './dto/get-trips.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Trip } from './entities/trip.entity';
import { CreateTripDto } from './dto/create-trip.dto';

@ApiTags('Trips')
@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) { }

  @ApiOperation({ summary: 'Search trips by origin and destination' })
  @ApiResponse({ status: 200, description: 'List of trips', type: [Trip] })
  @ApiResponse({ status: 400, description: 'Bad Request: Origin ,destination and sort_by strategy are required.' })
  @Get()
  async getTrips(
    @Query() query: GetTripsDto
  ) {
    if (!query.origin || !query.destination) {
      throw new BadRequestException('Origin and destination are required.');
    }
    return await this.tripsService.getSortedTrips(query.origin, query.destination, query.sort_by);
  }

  @Post()
  @ApiOperation({
    summary: 'Save trips',
    description: 'Creates a new trip entry with the specified details.',
  })
  @ApiResponse({ status: 201, description: 'Trip created', type: Trip })
  async saveTrip(@Body() createTripDto: CreateTripDto): Promise<Trip> {
    const trip = await this.tripsService.createTrip(createTripDto);
    return trip;
  }

  // @Get()
  // @ApiResponse({ status: 200, description: 'List of trips', type: [TripResponseDto] })
  // async listTrips(): Promise<TripResponseDto[]> {
  //   const trips = await this.tripsService.getAllTrips();
  //   return trips;
  // }

  // @Delete(':id')
  // @ApiResponse({ status: 204, description: 'Trip deleted' })
  // async deleteTrip(@Param('id') id: string): Promise<void> {
  //   await this.tripsService.deleteTrip(id);
  // }

}
