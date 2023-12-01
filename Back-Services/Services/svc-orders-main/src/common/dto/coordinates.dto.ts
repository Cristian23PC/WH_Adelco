import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class Coordinates {
  @ApiProperty({
    description: 'Latitude.',
    type: Number,
    required: true
  })
  @IsNumber()
  lat: number;

  @ApiProperty({
    description: 'Longitude.',
    type: Number,
    required: true
  })
  @IsNumber()
  long: number;
}
