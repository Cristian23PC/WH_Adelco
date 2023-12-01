import { ApiProperty } from '@nestjs/swagger';

export class DeliveryZone {
  constructor(id: string, key: string, label: string, dchDefault: string, commune: string, dcCode: string, dcLabel: string) {
    this.id = id;
    this.key = key;
    this.label = label;
    this.commune = commune;
    this.dcCode = dcCode;
    this.dchDefault = dchDefault;
    this.dcLabel = dcLabel;
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
}

export interface IDeliveryZoneCustomObjectValue {
  id: string;
  label: string;
  t2Rate: string;
  dchDefault: string;
  commune: string;
  dcCode: string;
  dcLabel: string;
}
