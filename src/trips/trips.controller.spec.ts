import { HttpService } from '@nestjs/axios';
import { BadRequestException } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { GetTripsDto } from './dto/get-trips.dto';
import { Trip } from './entities/trip.entity';
import { SortBy } from './enums/sort-by.enum';
import { TripsController } from './trips.controller';
import { TripsService } from './trips.service';

describe('TripsController', () => {
  let controller: TripsController;
  let tripsService: TripsService;

  const mockTrips: Trip[] = [
    {
      id: '1',
      origin: 'New York',
      destination: 'Boston',
      duration: 240,
      cost: 50,
      type: 'bus',
      display_name: 'Express Bus'
    },
    {
      id: '2',
      origin: 'New York',
      destination: 'Boston',
      duration: 180,
      cost: 100,
      type: 'train',
      display_name: 'Fast Train'
    }
  ];


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      controllers: [TripsController],
      providers: [
        TripsService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        }
      ],
    }).compile();

    controller = module.get<TripsController>(TripsController);
    tripsService = module.get<TripsService>(TripsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getTrips', () => {
    it('should return trips when valid query parameters are provided', async () => {
      const query: GetTripsDto = {
        origin: 'SYD',
        destination: 'ATL',
        sort_by: SortBy.Fastest
      };

      jest.spyOn(tripsService, 'getSortedTrips').mockResolvedValue(mockTrips);

      const result = await controller.getTrips(query);

      expect(result).toBe(mockTrips);
      expect(tripsService.getSortedTrips).toHaveBeenCalledWith(
        query.origin,
        query.destination,
        query.sort_by
      );
    });
  });
});
