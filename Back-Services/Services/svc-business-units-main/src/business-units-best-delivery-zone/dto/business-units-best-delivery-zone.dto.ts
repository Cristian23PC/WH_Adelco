import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class GetDeliveryZoneByLocalityDto {
  @ApiProperty({
    description: 'Locality',
    type: 'string',
    isArray: false,
    required: true
  })
  @IsNotEmpty()
  locality: string;
}
