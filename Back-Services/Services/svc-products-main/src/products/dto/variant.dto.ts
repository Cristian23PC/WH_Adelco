import { ApiProperty } from '@nestjs/swagger';
import { AttributeDto } from './attribute.dto';
import { PriceDto } from './price.dto';
import { ImageDto } from './image.dto';
import { AssetDto } from '../../dto/asset.dto';

class MoneyValueDto {
  @ApiProperty({ description: 'Type of the Money' })
  type: string;

  @ApiProperty({ description: 'Currency code of the Money' })
  currencyCode: string;

  @ApiProperty({ description: 'Cent amount of the Money' })
  centAmount: number;

  @ApiProperty({ description: 'Fraction digits of the Money' })
  fractionDigits: number;
}

class calculatedPriceDto {
  @ApiProperty({ description: 'Price of the Product Variant.', type: MoneyValueDto })
  price: MoneyValueDto;

  @ApiProperty({ description: 'Discounted price of the Product Variant.', type: MoneyValueDto })
  discountedPrice: MoneyValueDto;

  @ApiProperty({ description: 'Unit price of the Product Variant.', type: MoneyValueDto })
  unitPrice: MoneyValueDto;

  @ApiProperty({ description: 'Unit discounted price of the Product Variant.', type: MoneyValueDto })
  unitDiscountedPrice: MoneyValueDto;

  @ApiProperty({ description: 'Discounte rate of the Product Variant.', type: MoneyValueDto })
  discountRate: number;
}

class ProductVariantChannelAvailabilityDto {
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

class ProductVariantAvabilitiyTypeDto {
  [x: string]: ProductVariantChannelAvailabilityDto;
}
class ProductVariantAvabilitiyDto {
  @ApiProperty({ description: 'For each InventoryEntry with a supply Channel, an entry is added to channels.', type: ProductVariantAvabilitiyTypeDto })
  channels: ProductVariantAvabilitiyTypeDto;

  @ApiProperty({ description: 'Indicates whether a Product Variant is in stock.', required: false })
  isOnStock: boolean;

  @ApiProperty({ description: 'Number of days to restock a Product Variant once it is out of stock.', required: false })
  restockableInDays: number;

  @ApiProperty({ description: 'Number of items of the Product Variant that are in stock.', required: false })
  availableQuantity: number;
}

export class VariantDto {
  @ApiProperty({ description: 'A unique, sequential identifier of the Product Variant within the Product.' })
  id: number;

  @ApiProperty({ description: 'User-defined unique identifier of the ProductVariant.This is different from Product key.', required: false })
  key: string;

  @ApiProperty({ description: 'User-defined unique SKU of the Product Variant.', required: false })
  sku: string;

  @ApiProperty({
    description: 'The Embedded Prices of the Product Variant.',
    required: false,
    type: PriceDto,
    isArray: true
  })
  prices: PriceDto[];

  @ApiProperty({
    description: 'Attributes of the Product Variant.',
    required: false,
    type: AttributeDto,
    default: [],
    isArray: true
  })
  attributes: AttributeDto[];

  @ApiProperty({
    description: 'Only available when Price selection is used. Cannot be used in a Query Predicate.',
    required: false,
    isArray: true,
    type: ImageDto
  })
  images: ImageDto[];

  @ApiProperty({ description: 'Media assets of the Product Variant.', required: false, isArray: true, type: AssetDto })
  assets: AssetDto[];

  @ApiProperty({ description: 'Calculated price of the Product Variant.', required: false, type: calculatedPriceDto })
  calculatedPrice: calculatedPriceDto[];

  @ApiProperty({ description: 'Set if the Product Variant is tracked by Inventory.', required: false })
  availability: ProductVariantAvabilitiyDto[];

  @ApiProperty({ description: 'true if the Product Variant matches the search query.', required: false, isArray: true, type: ProductVariantAvabilitiyDto })
  isMatchingVariant: boolean;

  @ApiProperty({ description: 'Only available in response to a Product Projection Search request with price selection.', required: false })
  scopedPrice: any;

  @ApiProperty({ description: 'Only available in response to a Product Projection Search request with price selection.', required: false })
  scopedPriceDiscounted: boolean;
}
