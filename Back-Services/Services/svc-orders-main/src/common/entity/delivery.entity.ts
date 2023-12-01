import { CustomFields, DeliveryItem, Parcel } from '@commercetools/platform-sdk';
import { ApiProperty } from '@nestjs/swagger';
import { CustomFieldsEntity } from './custom-fields.entity';
import { AddressEntity } from './address/adddress.entity';
import { Address } from 'cluster';
import { ParcelEntity } from './parcel.entity';

export class DeliveryEntity {
  @ApiProperty({
    description: 'Unique identifier of the Delivery',
    type: String,
    required: true
  })
  id: string;

  @ApiProperty({
    type: String,
    required: true
  })
  createdAt: string;

  @ApiProperty({
    description: 'Items which are shipped in this delivery regardless their distribution over several parcels.',
    type: () => DeliveryItemEntity,
    required: true,
    isArray: true
  })
  items: DeliveryItem[];

  @ApiProperty({
    type: () => ParcelEntity,
    required: true,
    isArray: true
  })
  parcels: Parcel[];

  @ApiProperty({
    type: () => AddressEntity,
    required: false
  })
  address?: Address;

  @ApiProperty({
    description: 'Custom Fields for the Transaction.',
    type: () => CustomFieldsEntity,
    required: false
  })
  custom?: CustomFields;
}

export class DeliveryItemEntity {
  @ApiProperty({
    description: 'Unique identifier of the DeliveryItem.',
    type: String,
    required: true
  })
  id: string;

  @ApiProperty({
    type: String,
    required: true
  })
  quantity: number;
}
