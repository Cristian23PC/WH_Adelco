import {
  CentPrecisionMoney,
  ChannelReference,
  CustomFields,
  CustomLineItemPriceMode,
  DiscountedLineItemPriceForQuantity,
  InventoryMode,
  ItemShippingDetails,
  ItemState,
  LineItemMode,
  LineItemPriceMode,
  LocalizedString,
  MethodTaxRate,
  MethodTaxedPrice,
  Price,
  ProductTypeReference,
  ProductVariant,
  TaxCategoryReference,
  TaxRate,
  TaxedItemPrice,
  TypedMoney
} from '@commercetools/platform-sdk';
import { ApiProperty } from '@nestjs/swagger';
import { ProductTypeReferenceEntity } from './product-type-reference.entity';
import { LocalizedStringEntity } from '../localized-string.entity';
import { VariantEntity } from './variant.entity';
import { PriceEntity } from '../price/price.entity';
import { CentPrecisionMoneyEntity } from '../price/cent-precision-money.entity';
import { DiscountedLineItemPriceForQuantityEntity } from '../discount/discounted-line-item-price-for-quantity.entity';
import { TaxedItemPriceEntity } from '../price/taxed-item-price.entity';
import { MethodTaxedPriceEntity } from '../price/method-taxed-price.entity';
import { ItemStateEntity } from './item-state.entity';
import { TaxRateEntity } from '../price/tax-rate.entity';
import { CustomFieldsEntity } from '../custom-fields.entity';
import { MethodTaxRateEntity } from '../price/method-tax-rate.entity';
import { ChannelReferenceEntity } from '../channel/channel-reference.entity';
import { ItemShippingDetailsEntity } from './item-shipping-details.entity';
import { TypedMoneyEntity } from '../price/typed-money.entity';
import { TaxCategoryReferenceEntity } from '../price/tax-category-reference.entity';

export class LineItemEntity {
  @ApiProperty({
    description: 'Unique identifier of the Line Item.',
    type: String,
    required: true
  })
  id: string;

  @ApiProperty({
    description: 'ID of the Product.',
    type: String,
    required: true
  })
  productId: string;

  @ApiProperty({
    description: 'KEY of the Product.',
    type: String,
    required: false
  })
  productKey?: string;

  @ApiProperty({
    description: 'Name of the Product.',
    type: () => LocalizedStringEntity,
    required: true
  })
  name: LocalizedString;

  @ApiProperty({
    description: 'Slug of the current version of the Product.',
    type: () => LocalizedStringEntity,
    required: false
  })
  productSlug?: LocalizedString;

  @ApiProperty({
    description: 'Product Type reference of the Product.',
    type: () => ProductTypeReferenceEntity,
    required: true
  })
  productType: ProductTypeReference;

  @ApiProperty({
    description: 'Additional Product Variants.',
    required: true,
    default: [],
    isArray: true,
    type: VariantEntity
  })
  variant: ProductVariant;

  @ApiProperty({
    description: 'Price of a Line Item selected from the Product Variant.',
    type: () => PriceEntity,
    required: true
  })
  price: Price;

  @ApiProperty({
    description: 'Number of Line Items of the given Product Variant present in the Cart.',
    type: Number,
    required: true
  })
  quantity: number;
  @ApiProperty({
    description: 'Total price of this Line Item equalling `price` multiplied by `quantity`.',
    type: () => CentPrecisionMoneyEntity,
    required: true
  })
  totalPrice: CentPrecisionMoney;

  @ApiProperty({
    description: 'Discounted price of a single quantity of the Line Item.',
    type: () => DiscountedLineItemPriceForQuantityEntity,
    required: true,
    isArray: true
  })
  discountedPricePerQuantity: DiscountedLineItemPriceForQuantity[];

  @ApiProperty({
    description: 'Automatically set after `taxRate` is set.',
    type: () => TaxedItemPriceEntity,
    required: false
  })
  taxedPrice?: TaxedItemPrice;

  @ApiProperty({
    description: 'Taxed price of the Shipping Method that is automatically set after `perMethodTaxRate` is set.',
    type: () => MethodTaxedPriceEntity,
    required: true,
    isArray: true
  })
  taxedPricePortions: MethodTaxedPrice[];

  @ApiProperty({
    description: 'State of the Line Item in the Cart.',
    type: () => ItemStateEntity,
    required: true,
    isArray: true
  })
  state: ItemState[];

  @ApiProperty({
    description: 'Tax Rate of Line Items is set automatically once a shipping address is set.',
    type: () => TaxRateEntity,
    required: false
  })
  taxRate?: TaxRate;

  @ApiProperty({
    description: 'Tax Rate per Shipping Method for a Cart with `Multiple`.',
    type: () => MethodTaxRateEntity,
    required: true,
    isArray: true
  })
  perMethodTaxRate: MethodTaxRate[];

  @ApiProperty({
    description: 'Identifies Inventory entries that are reserved.',
    type: () => ChannelReferenceEntity,
    required: false
  })
  supplyChannel?: ChannelReference;

  @ApiProperty({
    description: 'Used to select a Product Price.',
    type: () => ChannelReferenceEntity,
    required: false
  })
  distributionChannel?: ChannelReference;

  @ApiProperty({
    description: 'Indicates how the Price for the Line Item is set.',
    type: String,
    required: true
  })
  priceMode: LineItemPriceMode;

  @ApiProperty({
    description: 'Indicates how the Line Item is added to the Cart.',
    type: String,
    required: true
  })
  lineItemMode: LineItemMode;

  @ApiProperty({
    description: 'Inventory mode specific to this Line Item only, and valid for the entire `quantity` of the Line Item.',
    type: String,
    required: false
  })
  inventoryMode?: InventoryMode;

  @ApiProperty({
    description: 'Container for Line Item-specific addresses.',
    type: () => ItemShippingDetailsEntity,
    required: false
  })
  shippingDetails?: ItemShippingDetails;

  @ApiProperty({
    description: 'Custom Fields of the Line Item.',
    type: () => CustomFieldsEntity,
    required: false
  })
  custom?: CustomFields;

  @ApiProperty({
    description: 'Date and time (UTC) the Line Item was added to the Cart.',
    type: String,
    required: false
  })
  addedAt?: string;

  @ApiProperty({
    description: 'Date and time (UTC) the Line Item was last updated.',
    type: String,
    required: false
  })
  lastModifiedAt?: string;
}

export class CustomLineItemEntity {
  @ApiProperty({
    description: 'Unique identifier of the Custom Line Item.',
    type: String,
    required: true
  })
  id: string;

  @ApiProperty({
    description: 'Name of the Custom Line Item.',
    type: String,
    required: true
  })
  name: LocalizedString;

  @ApiProperty({
    description: 'Money value of the Custom Line Item.',
    type: () => TypedMoneyEntity,
    required: true
  })
  money: TypedMoney;

  @ApiProperty({
    description: 'Automatically set after the `taxRate` is set.',
    type: () => TaxedItemPriceEntity,
    required: false
  })
  taxedPrice?: TaxedItemPrice;

  @ApiProperty({
    description: 'Total price of the Custom Line Item (`money` multiplied by `quantity`).',
    type: () => CentPrecisionMoneyEntity,
    required: true
  })
  totalPrice: CentPrecisionMoney;

  @ApiProperty({
    description: 'User-defined identifier used in a deep-link URL for the Custom Line Item.',
    type: String,
    required: true
  })
  slug: string;

  @ApiProperty({
    description: 'Number of Custom Line Items in the Cart.',
    type: String,
    required: true
  })
  quantity: number;

  @ApiProperty({
    description: 'State of the Custom Line Item in the Cart.',
    type: () => ItemStateEntity,
    required: true
  })
  state: ItemState[];

  @ApiProperty({
    description: 'Used to select a Tax Rate when a Cart has the `Platform`.',
    type: () => TaxCategoryReferenceEntity,
    required: false
  })
  taxCategory?: TaxCategoryReference;

  @ApiProperty({
    description: 'Tax Rate of Custom Line Items is set automatically once a shipping address is set.',
    type: () => TaxRateEntity,
    required: false
  })
  taxRate?: TaxRate;

  @ApiProperty({
    description: 'Discounted price of a single quantity of the Custom Line Item.',
    type: () => DiscountedLineItemPriceForQuantityEntity,
    required: true
  })
  discountedPricePerQuantity: DiscountedLineItemPriceForQuantity[];

  @ApiProperty({
    description: 'Custom Fields of the Custom Line Item.',
    type: () => CustomFieldsEntity,
    required: false
  })
  custom?: CustomFields;

  @ApiProperty({
    description: 'Container for Custom Line Item-specific addresses.',
    type: () => ItemShippingDetailsEntity,
    required: false
  })
  shippingDetails?: ItemShippingDetails;

  @ApiProperty({
    description: 'Indicates whether Cart Discounts with a matching are applied to the Custom Line Item with a match.',
    type: String,
    required: true
  })
  priceMode: CustomLineItemPriceMode;
}
