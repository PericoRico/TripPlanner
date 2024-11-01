import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { TripsService } from './trips.service';
import { SortBy } from './enums/sort-by.enum';
import { Trip } from './entities/trip.entity';
import axios from 'axios';
import { PrismaService } from '../prisma_db/prisma.service';
import { InternalServerErrorException } from '@nestjs/common';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

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
        PrismaService,
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
      mockedAxios.get.mockResolvedValue({
        data: mockTrips,
        status: 200,
        statusText: 'OK',
      });

      const result = await service.searchTrips(origin, destination);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${mockApiUrl}/default/trips`,
        {
          headers: {
            'x-api-key': mockApiKey,
          },
          params: {
            origin,
            destination,
          },
        }
      );

      expect(result).toEqual(mockTrips);
    });

    it('should throw InternalServerErrorException on error', async () => {
      const origin = 'A';
      const destination = 'B';

      // Simula un error de axios
      mockedAxios.get.mockRejectedValue(new Error('Network error'));

      // Verifica que se lance la excepción esperada
      await expect(service.searchTrips(origin, destination))
        .rejects
        .toThrow(InternalServerErrorException);
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