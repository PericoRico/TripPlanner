import { Controller, Get, Query, BadRequestException, Post, Delete, Body, Param, ParseUUIDPipe } from '@nestjs/common';
import { TripsService } from './trips.service';
import { GetTripsDto } from './dto/get-trips.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Trip } from './entities/trip.entity';
import { CreateTripDto } from './dto/create-trip.dto';


@ApiTags('Trips')
@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) { }

  @ApiOperation({ summary: 'Search trips in external API by origin and destination' })
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
    return await this.tripsService.createTrip(createTripDto);

  }

  @Get('all')
  @ApiResponse({ status: 200, description: 'List of trips saved in the DB', type: [Trip] })
  async listAllTrips(): Promise<Trip[]> {
    return await this.tripsService.getAllTrips();
  }

  @ApiOperation({ summary: 'Search among the trips in the DB and get trips with maximum of one stopover for that origin and destination' })
  @ApiResponse({ status: 200, description: 'List of trips', type: [Trip] })
  @ApiResponse({ status: 400, description: 'Bad Request: Origin ,destination and sort_by strategy are required.' })
  @Get('stopovers')
  async getStopoversTrips(
    @Query() query: GetTripsDto
  ) {
    if (!query.origin || !query.destination) throw new BadRequestException('Origin and destination are required.');
    const stopoversTrips = await this.tripsService.getStopoversTrips(query.origin, query.destination, query.sort_by);
    if (stopoversTrips.length < 1) throw new BadRequestException('No stopovers found between the specified origin and destination.');
    return stopoversTrips
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Get a saved trip from the DB', type: [Trip] })
  async getTrip(@Param('id', new ParseUUIDPipe()) id: string): Promise<Trip> {
    return await this.tripsService.getTrip(id);
  }


  @Delete(':id')
  @ApiResponse({ status: 204, description: 'Delete trip from DB' })
  async deleteTrip(@Param('id') id: string): Promise<Trip> {
    return await this.tripsService.deleteTrip(id);
  }

}
