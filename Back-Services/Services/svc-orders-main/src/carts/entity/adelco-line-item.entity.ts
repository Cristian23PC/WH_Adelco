import { LineDetailsEntity } from '@/common/entity/line-details.entity';
import { LineItemEntity } from '@/common/entity/product/line-item.entity';
import { LineItemDetails } from '@adelco/price-calc';
import { ApiProperty } from '@nestjs/swagger';

export class AdelcoLineItemEntity extends LineItemEntity {
  @ApiProperty({
    description: 'Line item details.',
    type: () => LineDetailsEntity,
    required: false
  })
  lineDetails?: LineItemDetails;
}
