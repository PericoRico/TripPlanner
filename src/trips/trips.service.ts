import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { PrismaService } from '../prisma_db/prisma.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { Trip } from './entities/trip.entity';
import { SortBy } from './enums/sort-by.enum';
import { v4 as uuidv4 } from 'uuid';


@Injectable()
export class TripsService {
  private readonly apiUrl: string;
  private readonly apiKey: string;
  private readonly logger = new Logger(TripsService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService
  ) {
    this.apiUrl = this.configService.get<string>('API_TRIPS_URL');
    this.apiKey = this.configService.get<string>('X_API_KEY');
  }

  // Main method to retrieve trips based on the specified origin and destination,
  // and then sort the results according to the provided sorting criteria.
  async getSortedTrips(origin: string, destination: string, sort_by: SortBy): Promise<Trip[]> {
    const trips = await this.searchTrips(origin, destination);
    return this.sortTrips(trips, sort_by);
  }

  async searchTrips(origin: string, destination: string): Promise<Trip[]> {
    try {
      const response = await axios.get<Trip[]>(`${this.apiUrl}/default/trips`, {
        headers: {
          'x-api-key': this.apiKey,
        },
        params: {
          origin,
          destination,
        },
      })

      return response.data;
    } catch (error) {
      this.logger.error(`Error searching for trips: ${error.message}`, error.stack);
      throw new InternalServerErrorException('An error occurred while searching for trips.');
    }
  }

  private sortTrips(trips: Trip[], sort_by: SortBy): Trip[] {
    if (sort_by === SortBy.Fastest) {
      return trips.sort((a, b) => a.duration - b.duration);
    } else {
      return trips.sort((a, b) => a.cost - b.cost);
    }
  }

  async createTrip(createTripDto: CreateTripDto): Promise<Trip> {
    return await this.prisma.trip.create({
      data: {
        origin: createTripDto.origin,
        destination: createTripDto.destination,
        cost: createTripDto.cost,
        duration: createTripDto.duration,
        type: createTripDto.type,
        id: createTripDto.id,
        display_name: createTripDto.display_name,
      },
    });
  }

  async getAllTrips(): Promise<Trip[]> {
    return await this.prisma.trip.findMany();
  }

  async getTrip(id: string): Promise<Trip> {
    const trip = await this.prisma.trip.findUnique(
      {
        where: { id: id },
      }
    );

    if (!trip) throw new NotFoundException(`Trip with ID ${id} not found`);

    return trip;
  }

  async deleteTrip(id: string): Promise<Trip> {
    const deletedTrip = await this.prisma.trip.delete({
      where: { id },
    });
    if (!deletedTrip) throw new NotFoundException(`Trip with id ${id} not found`);
    return deletedTrip
  }

  async getStopoversTrips(origin: string, destination: string, sortBy: SortBy) {
    // 1. Get all saved trips
    const allTrips = await this.getAllTrips();

    // 2. Find direct and stepover trips
    const directTrips = this.findDirectTrips(allTrips, origin, destination);
    const oneStopTrips = this.findOneStopTrips(allTrips, origin, destination);

    // 3. Combine results and apply sorting
    const allRelevantTrips = [...directTrips, ...oneStopTrips];
    return this.sortTrips(allRelevantTrips, sortBy);
  }

  private findDirectTrips(trips: Trip[], origin: string, destination: string): Trip[] {
    return trips.filter(trip => trip.origin === origin && trip.destination === destination);
  }

  private findOneStopTrips(trips: Trip[], origin: string, destination: string): Trip[] {
    const oneStopTrips: Trip[] = [];

    // Get posible destinations to stopover based on the given origin
    const stopoverOptions = [...new Set(
      trips
        .filter(trip => trip.origin === origin)
        .map(trip => trip.destination)
    )];

    for (const stopover of stopoverOptions) {
      // Posibilities from origin to stopover point
      const firstLeg = trips.filter(trip => trip.origin === origin && trip.destination === stopover);
      // Posibilities from stopover point to destination
      const secondLeg = trips.filter(trip => trip.origin === stopover && trip.destination === destination);

      // Combine trips
      if (firstLeg.length > 0 && secondLeg.length > 0) {
        const combinedTrips = this.combineTrips(firstLeg, secondLeg);
        oneStopTrips.push(...combinedTrips);
      }
    }

    return oneStopTrips;
  }

  private combineTrips(firstLeg: Trip[], secondLeg: Trip[]): Trip[] {
    const tripsWithStopover = [];
    for (const leg1 of firstLeg) {
      for (const leg2 of secondLeg) {
        tripsWithStopover.push({
          id: uuidv4(),
          origin: leg1.origin,
          destination: leg2.destination,
          cost: leg1.cost + leg2.cost,
          duration: leg1.duration + leg2.duration,
          type: leg1.type,
          display_name: `${leg1.display_name} - ${leg2.display_name}`,
          isDirect: false, // Assuming that there are no direct trips between two stops
        });
      }
    }
    return tripsWithStopover;
  }
}
