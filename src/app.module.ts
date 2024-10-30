import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TripsModule } from './trips/trips.module';

@Module({
  imports: [TripsModule, ConfigModule.forRoot({
    isGlobal: true,
    validationSchema: Joi.object({
      X_API_KEY: Joi.string().required(),
      PORT: Joi.number().port().default(3000),
      API_TRIPS_URL: Joi.string().required(),
      DATABASE_URL: Joi.string().required(),
    }),
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
