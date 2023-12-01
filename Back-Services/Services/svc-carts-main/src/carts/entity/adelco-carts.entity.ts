import { CartsEntity } from './carts.entity';
import { TotalDetailsEntity } from '@/common/entity/total-details.entity';
import { AdelcoLineItem, TotalDetails } from '@adelco/price-calc';
import { ApiProperty } from '@nestjs/swagger';
import { AdelcoLineItemEntity } from './adelco-line-item.entity';

export class AdelcoCartsEntity extends CartsEntity {
  @ApiProperty({
    description: 'Line items added to the Cart.',
    type: () => AdelcoLineItemEntity,
    required: true,
    isArray: true
  })
  lineItems: AdelcoLineItem[];

  @ApiProperty({
    description: 'Total details.',
    type: () => TotalDetailsEntity,
    required: true
  })
  totalDetails: TotalDetails;
}
