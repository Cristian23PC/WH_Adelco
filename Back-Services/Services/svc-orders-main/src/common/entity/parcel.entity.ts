import { ApiProperty } from '@nestjs/swagger';
import { DeliveryItemEntity } from './delivery.entity';
import { CustomFields, DeliveryItem } from '@commercetools/platform-sdk';
import { CustomFieldsEntity } from './custom-fields.entity';

export class ParcelEntity {
  @ApiProperty({
    description: 'Unique identifier of the Parcel.',
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
    description: 'The delivery items contained in this parcel.',
    type: () => DeliveryItemEntity,
    required: false,
    isArray: true
  })
  items?: DeliveryItem[];

  @ApiProperty({
    description: 'Custom Fields of this parcel.',
    type: () => CustomFieldsEntity,
    required: false,
    isArray: true
  })
  custom?: CustomFields;
}
