import { CartDiscountReference, DiscountCodeReference, DiscountCodeState, DiscountedLineItemPortion, DiscountedLineItemPrice, TypedMoney } from '@commercetools/platform-sdk';
import { ApiProperty } from '@nestjs/swagger';
import { TypedMoneyEntity } from '../price/typed-money.entity';
import { DiscountCodeReferenceEntity } from './discount-code-reference.entity';
import { CartDiscountReferenceEntity } from '@/carts/entity/cart-discount-reference.entity';

export class DiscountedLineItemPriceForQuantityEntity {
  @ApiProperty({
    description: 'Number of Line Items or Custom Line Items in the Cart.',
    type: Number,
    required: true
  })
  quantity: number;

  @ApiProperty({
    description: 'Discounted price of the Line Item or Custom Line Item.',
    type: () => DiscountedLineItemPriceEntity,
    required: true
  })
  discountedPrice: DiscountedLineItemPrice;
}

export class DiscountedLineItemPriceEntity {
  @ApiProperty({
    description: 'Money value of the discounted Line Item or Custom Line Item.',
    type: () => TypedMoneyEntity,
    required: true
  })
  value: TypedMoney;

  @ApiProperty({
    description: 'Discount applicable on the Line Item or Custom Line Item.',
    type: () => DiscountedLineItemPortionEntity,
    required: true
  })
  includedDiscounts: DiscountedLineItemPortion;
}

export class DiscountedLineItemPortionEntity {
  @ApiProperty({
    description: 'Cart Discount applicable on the Line Item.',
    type: () => CartDiscountReferenceEntity,
    required: true
  })
  discount: CartDiscountReference;

  @ApiProperty({
    description: 'Money value of the discount applicable.',
    type: () => TypedMoneyEntity,
    required: true
  })
  discountedAmount: TypedMoney;
}

export class DiscountCodeInfoEntity {
  @ApiProperty({
    description: 'Discount Code associated with the Cart or Order.',
    type: () => DiscountCodeReferenceEntity,
    required: true
  })
  discountCode: DiscountCodeReference;

  @ApiProperty({
    description: 'Indicates the state of the Discount Code applied to the Cart or Order.',
    type: String,
    required: true
  })
  state: DiscountCodeState;
}

export class DirectDiscountEntity {
  @ApiProperty({
    description: 'Unique identifier of the Direct Discount.',
    type: String,
    required: true
  })
  id: string;
}
