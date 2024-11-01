import { ApiProperty } from "@nestjs/swagger";

export class Trip {
  @ApiProperty({ description: 'IATA code of the origin' })
  origin: string;

  @ApiProperty({ description: 'IATA code of the destination' })
  destination: string;

  @ApiProperty({ description: 'Cost of the trip' })
  cost: number;

  @ApiProperty({ description: 'Duration of the trip in hours' })
  duration: number;

  @ApiProperty({ description: 'Type of transport, e.g., car, train, flight' })
  type: 'car' | 'train' | 'flight' | 'bus';

  @ApiProperty({ description: 'Unique identifier of the trip' })
  id: string;

  @ApiProperty({ description: 'Display name of the trip' })
  display_name: string;

  @ApiProperty({ description: 'Creation time' })
  createdAt?: Date

  @ApiProperty({ description: 'True if the trip is direct' })
  isDirect?: boolean
}