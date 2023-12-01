import { ProductProjectionDto } from '@/products/dto/productProjection.dto';
import { ApiProperty } from '@nestjs/swagger';
import ProductJson from '../__tests__/__mocks__/product.json';
import { CommonProjectionPagedResponseDto } from '@/dto/CommonProjectionPagedResponse.dto';

const moneyMock = {
  type: 'string',
  currencyCode: 'string',
  centAmount: 0,
  fractionDigits: 0
};

const calculatedPriceMock = {
  price: moneyMock,
  discountedPrice: moneyMock,
  unitPrice: moneyMock,
  unitDiscountedPrice: moneyMock,
  discountRate: 0
};

const ProductMock = {
  ...ProductJson,
  masterVariant: {
    ...ProductJson.masterVariant,
    price: undefined,
    calculatedPrice: calculatedPriceMock
  },
  variants: ProductJson.variants?.map(variant => ({ ...variant, price: undefined, calculatedPrice: calculatedPriceMock })),
  taxCategory: undefined
};

export class ProductProjectionPagedResponseDto extends CommonProjectionPagedResponseDto {
  @ApiProperty({
    description: 'ProductProjections matching the query.',
    required: true,
    default: [],
    type: ProductProjectionDto,
    isArray: true,
    example: [ProductMock]
  })
  results: ProductProjectionDto[];
}
