import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { TripsService } from './trips.service';
import { SortBy } from './enums/sort-by.enum';
import { Trip } from './entities/trip.entity';
import { of } from 'rxjs';
import { AxiosResponse, InternalAxiosRequestConfig } from 'axios';

describe('TripsService', () => {
  let service: TripsService;
  let httpService: HttpService;
  let configService: ConfigService;

  const mockApiUrl = 'http://api.example.com';
  const mockApiKey = 'test-api-key';

  const mockTrips: Trip[] = [
    {
      id: '1',
      origin: 'A',
      destination: 'B',
      duration: 120,
      cost: 100,
      type: 'bus',
      display_name: 'Bus Route 1'
    },
    {
      id: '2',
      origin: 'A',
      destination: 'B',
      duration: 90,
      cost: 150,
      type: 'train',
      display_name: 'Express Train'
    },
    {
      id: '3',
      origin: 'A',
      destination: 'B',
      duration: 180,
      cost: 80,
      type: 'bus',
      display_name: 'Bus Route 2'
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TripsService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              switch (key) {
                case 'API_TRIPS_URL':
                  return mockApiUrl;
                case 'X_API_KEY':
                  return mockApiKey;
                default:
                  return null;
              }
            }),
          },
        },
      ],
    }).compile();

    // Get instances of our services
    service = module.get<TripsService>(TripsService);
    httpService = module.get<HttpService>(HttpService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('searchTrips', () => {
    it('should successfully fetch trips', async () => {
      const origin = 'A';
      const destination = 'B';

      // Mock response
      const mockAxiosResponse: AxiosResponse = {
        data: mockTrips,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          headers: {} as any,
        } as InternalAxiosRequestConfig,
      };

      // Http call simulation. Intercepts get method to return the mock
      jest.spyOn(httpService, 'get').mockImplementationOnce(() => of(mockAxiosResponse));

      const result = await service.searchTrips(origin, destination);

      expect(httpService.get).toHaveBeenCalledWith(
        `${mockApiUrl}/default/trips?origin=${origin}&destination=${destination}`,
        {
          headers: {
            'x-api-key': mockApiKey,
          },
        },
      );
      expect(result).toEqual(mockTrips);
    });

    it('should throw an error when the API call fails', async () => {
      const origin = 'A';
      const destination = 'B';
      const error = new Error('Error: Missing origin or destination query params');

      jest.spyOn(httpService, 'get').mockImplementationOnce(() => {
        throw error;
      });

      await expect(service.searchTrips(origin, destination)).rejects.toThrow('Error: Missing origin or destination query params');
    });
  });

  describe('getSortedTrips', () => {
    beforeEach(() => {
      jest.spyOn(service, 'searchTrips').mockResolvedValue(mockTrips);
    });

    it('should sort trips by duration when SortBy.Fastest is specified', async () => {
      const result = await service.getSortedTrips('A', 'B', SortBy.Fastest);

      expect(result).toEqual([
        { id: '2', origin: 'A', destination: 'B', duration: 90, cost: 150, type: 'train', display_name: 'Express Train' },
        { id: '1', origin: 'A', destination: 'B', duration: 120, cost: 100, type: 'bus', display_name: 'Bus Route 1' },
        { id: '3', origin: 'A', destination: 'B', duration: 180, cost: 80, type: 'bus', display_name: 'Bus Route 2' },
      ]);
    });

    it('should sort trips by cost when SortBy.Cheapest is specified', async () => {
      const result = await service.getSortedTrips('A', 'B', SortBy.Cheapest);

      expect(result).toEqual([
        { id: '3', origin: 'A', destination: 'B', duration: 180, cost: 80, type: 'bus', display_name: 'Bus Route 2' },
        { id: '1', origin: 'A', destination: 'B', duration: 120, cost: 100, type: 'bus', display_name: 'Bus Route 1' },
        { id: '2', origin: 'A', destination: 'B', duration: 90, cost: 150, type: 'train', display_name: 'Express Train' },
      ]);
    });
  });
});