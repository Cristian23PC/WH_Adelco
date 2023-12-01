import { PaymentReference } from '@commercetools/platform-sdk';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentReferenceEntity } from './payment-reference.entity';

export class PaymentInfoEntity {
  @ApiProperty({
    type: () => PaymentReferenceEntity,
    required: true,
    isArray: true
  })
  payments: PaymentReference;
}
