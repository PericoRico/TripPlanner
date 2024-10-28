import { Module } from '@nestjs/common';
import { TripsService } from './trips.service';
import { TripsController } from './trips.controller';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from 'src/prisma_db/prisma.module';

@Module({
  imports: [HttpModule, PrismaModule],
  controllers: [TripsController],
  providers: [TripsService],
})
export class TripsModule { }
