import { AdelcoLineItem, TotalDetails } from '@adelco/price-calc';
import { ApiProperty } from '@nestjs/swagger';
import { OrdersEntity } from './orders.entity';
import { AdelcoLineItemEntity } from '@/carts/entity/adelco-line-item.entity';
import { TotalDetailsEntity } from '@/common/entity/total-details.entity';

export class AdelcoOrdersEntity extends OrdersEntity {
  @ApiProperty({
    description: 'Line items added to the Order.',
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
