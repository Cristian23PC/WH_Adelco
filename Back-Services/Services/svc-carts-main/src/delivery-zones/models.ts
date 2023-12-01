import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsIn, IsInt, IsNumber, IsString } from 'class-validator';

type Frequency = 'W' | 'B1' | 'B2' | 'TR1' | 'TR2' | 'TR3' | 'M1' | 'M2' | 'M3' | 'M4';

type DeliveryDays = Array<0 | 1 | 2 | 3 | 4 | 5 | 6>;

export class DeliveryZone {
  constructor(
    label: string,
    dchDefault: string,
    commune: string,
    dcCode: string,
    dcLabel: string,
    isAvailable: boolean,
    preparationTime: number,
    cutoffTime: string[],
    deliveryDays: DeliveryDays,
    deliveryRange: number,
    frequency: Frequency
  ) {
    this.label = label;
    this.commune = commune;
    this.dcCode = dcCode;
    this.dchDefault = dchDefault;
    this.dcLabel = dcLabel;
    this.isAvailable = isAvailable;
    this.preparationTime = preparationTime;
    this.cutoffTime = cutoffTime;
    this.deliveryDays = deliveryDays;
    this.deliveryRange = deliveryRange;
    this.frequency = frequency;
  }

  @ApiProperty({ description: 'DeliveryZone label' })
  label: string;

  @ApiProperty({ description: 'DeliveryZone Default Distribution Channel' })
  dchDefault: string;

  @ApiProperty({ description: 'DeliveryZone commune' })
  commune: string;

  @ApiProperty({ description: 'DeliveryZone Distribution center code' })
  dcCode: string;

  @ApiProperty({ description: 'DeliveryZone Distribution center label' })
  dcLabel: string;

  @ApiProperty({ description: 'DeliveryZone available' })
  @IsBoolean()
  isAvailable: boolean;

  @ApiProperty({ description: 'DeliveryZone preparation time' })
  @IsNumber()
  @IsInt()
  preparationTime: number;

  @ApiProperty({ description: 'DeliveryZone cut off time' })
  @IsArray()
  @IsString({ each: true })
  cutoffTime: string[];

  @ApiProperty({ description: 'DeliveryZone delivery days' })
  @IsArray()
  @IsNumber({}, { each: true })
  deliveryDays: DeliveryDays;

  @ApiProperty({ description: 'DeliveryZone delivery range' })
  @IsNumber()
  @IsInt()
  deliveryRange: number;

  @ApiProperty({ description: 'DeliveryZone frequency' })
  @IsIn(['W', 'B1', 'B2', 'TR1', 'TR2', 'TR3', 'M1', 'M2', 'M3', 'M4'])
  frequency: Frequency;
}
