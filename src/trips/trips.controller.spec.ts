import { HttpService } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma_db/prisma.service';
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
      origin: 'YYZ',
      destination: 'ATL',
      duration: 240,
      cost: 50,
      type: 'bus',
      display_name: 'Express Bus'
    },
    {
      id: '2',
      origin: 'YYZ',
      destination: 'ATL',
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
        PrismaService,
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
