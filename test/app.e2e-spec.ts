import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { TripsService } from '../src/trips/trips.service';
import { TripsController } from '../src/trips/trips.controller';
import { SortBy } from '../src/trips/enums/sort-by.enum';
import { HttpService } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { AppModule } from '../src/app.module';
import { PrismaModule } from '../src/prisma_db/prisma.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let tripsService: TripsService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule, AppModule, PrismaModule],
      controllers: [TripsController],
      providers: [
        TripsService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        }],

    }).compile();

    app = moduleFixture.createNestApplication();

    // Configure ValidationPipe 
    app.useGlobalPipes(new ValidationPipe());

    await app.init();

    tripsService = moduleFixture.get<TripsService>(TripsService);
  });;

  // Test application status
  it('should return Status', () => {

    const expectedResponse = { status: 'ok' };

    return request(app.getHttpServer())
      .get('/status')
      .expect(200)
      .expect(res => {
        expect(res.body).toEqual(expectedResponse);
      });
  });

  // Test validation pipes
  it('should return 400 when origin is missing', () => {
    return request(app.getHttpServer())
      .get('/trips')
      .query({
        destination: 'ATL',
        sort_by: SortBy.Fastest
      })
      .expect(400)
      .expect(res => {
        expect(res.body.message).toContain('origin should not be empty');
      });
  });

  it('should return 400 when destination is missing', () => {
    return request(app.getHttpServer())
      .get('/trips')
      .query({
        origin: 'ATL',
        sort_by: SortBy.Fastest
      })
      .expect(400)
      .expect(res => {
        expect(res.body.message).toContain('destination should not be empty');
      });
  });

  it('should return 400 when sort_by is missing', () => {
    return request(app.getHttpServer())
      .get('/trips')
      .query({
        origin: 'ATL',
        destination: 'SYD',
      })
      .expect(400)
      .expect(res => {
        expect(res.body.message).toContain('sort_by should not be empty');
      });
  });
});
