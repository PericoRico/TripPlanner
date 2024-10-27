import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { TripsService } from './trips.service';
import { GetTripsDto } from './dto/get-trips.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Trip } from './entities/trip.entity';

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

}
