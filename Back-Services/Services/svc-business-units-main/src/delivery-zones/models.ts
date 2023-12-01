import { ApiProperty } from '@nestjs/swagger';
import { MinimumOrderAmountDto } from '@/business-units/models';

type Frequency = 'W' | 'B1' | 'B2' | 'TR1' | 'TR2' | 'TR3' | 'M1' | 'M2' | 'M3' | 'M4';

type DeliveryDays = Array<0 | 1 | 2 | 3 | 4 | 5 | 6>;

export class DeliveryZone {
  constructor(
    id: string,
    key: string,
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
    frequency: Frequency,
    minimumOrderAmount?: MinimumOrderAmountDto
  ) {
    this.id = id;
    this.key = key;
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
    this.minimumOrderAmount = minimumOrderAmount;
  }

  @ApiProperty({ description: 'DeliveryZone ID' })
  id: string;

  @ApiProperty({ description: 'DeliveryZone Key' })
  key: string;

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
  isAvailable: boolean;

  @ApiProperty({ description: 'DeliveryZone preparation time' })
  preparationTime: number;

  @ApiProperty({ description: 'DeliveryZone cut off time' })
  cutoffTime: string[];

  @ApiProperty({ description: 'DeliveryZone delivery days' })
  deliveryDays: DeliveryDays;

  @ApiProperty({ description: 'DeliveryZone delivery range' })
  deliveryRange: number;

  @ApiProperty({ description: 'DeliveryZone frequency' })
  frequency: Frequency;

  @ApiProperty({ description: 'DeliveryZone minimum order amount' })
  minimumOrderAmount: MinimumOrderAmountDto;
}

export interface IDeliveryZoneCustomObjectValue {
  id: string;
  label: string;
  t2Rate: string;
  dchDefault: string;
  commune: string;
  dcCode: string;
  dcLabel: string;
  isAvailable: boolean;
  preparationTime: number;
  cutoffTime: string[];
  deliveryDays: DeliveryDays;
  deliveryRange: number;
  frequency: Frequency;
}
