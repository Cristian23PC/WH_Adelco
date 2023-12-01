import { ApiProperty } from '@nestjs/swagger';
import { AttributeEntity } from '../attribute.entity';
import { PriceEntity } from '../price/price.entity';
import { ImageEntity } from '../image.entity';
import { AssetEntity } from '../asset.entity';

class MoneyValueEntity {
  @ApiProperty({ description: 'Type of the Money' })
  type: string;

  @ApiProperty({ description: 'Currency code of the Money' })
  currencyCode: string;

  @ApiProperty({ description: 'Cent amount of the Money' })
  centAmount: number;

  @ApiProperty({ description: 'Fraction digits of the Money' })
  fractionDigits: number;
}

class calculatedPriceEntity {
  @ApiProperty({ description: 'Price of the Product Variant.', type: MoneyValueEntity })
  price: MoneyValueEntity;

  @ApiProperty({ description: 'Discounted price of the Product Variant.', type: MoneyValueEntity })
  discountedPrice: MoneyValueEntity;

  @ApiProperty({ description: 'Unit price of the Product Variant.', type: MoneyValueEntity })
  unitPrice: MoneyValueEntity;

  @ApiProperty({ description: 'Unit discounted price of the Product Variant.', type: MoneyValueEntity })
  unitDiscountedPrice: MoneyValueEntity;

  @ApiProperty({ description: 'Discounte rate of the Product Variant.', type: MoneyValueEntity })
  discountRate: number;
}

class ProductVariantChannelAvailabilityEntity {
  @ApiProperty({ description: '' })
  isOnStock: boolean;

  @ApiProperty({ description: '' })
  restockableInDays: number;

  @ApiProperty({ description: '' })
  availableQuantity: number;

  @ApiProperty({ description: '' })
  version: number;

  @ApiProperty({ description: '' })
  id: string;
}

class ProductVariantAvabilitiyTypeEntity {
  [x: string]: ProductVariantChannelAvailabilityEntity;
}
class ProductVariantAvabilitiyEntity {
  @ApiProperty({ description: 'For each InventoryEntry with a supply Channel, an entry is added to channels.', type: ProductVariantAvabilitiyTypeEntity })
  channels: ProductVariantAvabilitiyTypeEntity;

  @ApiProperty({ description: 'Indicates whether a Product Variant is in stock.', required: false })
  isOnStock: boolean;

  @ApiProperty({ description: 'Number of days to restock a Product Variant once it is out of stock.', required: false })
  restockableInDays: number;

  @ApiProperty({ description: 'Number of items of the Product Variant that are in stock.', required: false })
  availableQuantity: number;
}

export class VariantEntity {
  @ApiProperty({ description: 'A unique, sequential identifier of the Product Variant within the Product.' })
  id: number;

  @ApiProperty({ description: 'User-defined unique identifier of the ProductVariant.This is different from Product key.', required: false })
  key: string;

  @ApiProperty({ description: 'User-defined unique SKU of the Product Variant.', required: false })
  sku: string;

  @ApiProperty({
    description: 'The Embedded Prices of the Product Variant.',
    required: false,
    type: PriceEntity,
    isArray: true
  })
  prices: PriceEntity[];

  @ApiProperty({
    description: 'Attributes of the Product Variant.',
    required: false,
    type: AttributeEntity,
    default: [],
    isArray: true
  })
  attributes: AttributeEntity[];

  @ApiProperty({
    description: 'Only available when Price selection is used. Cannot be used in a Query Predicate.',
    required: false,
    isArray: true,
    type: ImageEntity
  })
  images: ImageEntity[];

  @ApiProperty({ description: 'Media assets of the Product Variant.', required: false, isArray: true, type: AssetEntity })
  assets: AssetEntity[];

  @ApiProperty({ description: 'Calculated price of the Product Variant.', required: false, type: calculatedPriceEntity })
  calculatedPrice: calculatedPriceEntity[];

  @ApiProperty({ description: 'Set if the Product Variant is tracked by Inventory.', required: false })
  availability: ProductVariantAvabilitiyEntity[];

  @ApiProperty({ description: 'true if the Product Variant matches the search query.', required: false, isArray: true, type: ProductVariantAvabilitiyEntity })
  isMatchingVariant: boolean;

  @ApiProperty({ description: 'Only available in response to a Product Projection Search request with price selection.', required: false })
  scopedPrice: any;

  @ApiProperty({ description: 'Only available in response to a Product Projection Search request with price selection.', required: false })
  scopedPriceDiscounted: boolean;
}
