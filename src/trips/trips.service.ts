import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { firstValueFrom } from 'rxjs';
import { Trip } from './entities/trip.entity';
import { SortBy } from './enums/sort-by.enum';


@Injectable()
export class TripsService {
  private readonly apiUrl: string;
  private readonly apiKey: string;
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiUrl = this.configService.get<string>('API_TRIPS_URL');
    this.apiKey = this.configService.get<string>('X_API_KEY');
  }

  // Main method to retrieve trips based on the specified origin and destination,
  // and then sort the results according to the provided sorting criteria.
  async getSortedTrips(origin: string, destination: string, sort_by: SortBy) {
    const trips = await this.searchTrips(origin, destination);
    return this.sortTrips(trips, sort_by);
  }

  async searchTrips(origin: string, destination: string): Promise<Trip[]> {
    try {
      const url = `${this.apiUrl}/default/trips?origin=${origin}&destination=${destination}`
      const response = await firstValueFrom(
        this.httpService.get<Trip[]>(url, {
          headers: {
            'x-api-key': this.apiKey
          },
        }),
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  private sortTrips(trips: Trip[], sort_by: SortBy): Trip[] {
    if (sort_by === SortBy.Fastest) {
      return trips.sort((a, b) => a.duration - b.duration);
    } else {
      return trips.sort((a, b) => a.cost - b.cost);
    }
  }
}
