import { LocalizedField, Money, Image } from './general';
import { CtTax, CtTaxRate, CtTaxPortion } from './general';
import { CTAttribute, CtDiscount } from './product';

type State = {
  quantity: number;
  state: {
    typeId: string;
    id: string;
  };
};

type PriceObject = {
  id: string;
  key?: string;
  value: Money;
  country?: string;
  customerGroup?: object;
  channel?: number;
  validFrom?: string;
  validUntil?: string;
  discounted?: CtDiscount | object;
  tiers?: any[];
  custom?: object;
};

type ShippingRate = {
  price?: Money;
  freeAbove?: Money;
  isMatching?: boolean;
};

type Shipping = {
  shippingKey: string;
  shippingInfo: {
    shippingMethodName: string;
    price: Money;
    shippingRate: ShippingRate;
    taxedPrice?: {
      totalNet: Money;
      totalGross: Money;
      totalTax?: Money;
    };
    taxRate?: CtTaxRate;
    taxCategory?: {
      typeId: string;
      id: string;
    };
    shippingMethod?: {
      typeId: string;
      id: string;
    };
    deliveries?: any[];
    discountedPrice?: {
      value: Money;
      includedDiscounts: any[];
    };
    shippingMethodState?: string;
  };
  shippingAddress: object;
  shippingCustomFields?: object;
};

type ProductVariant = {
  id: number;
  sku?: string;
  key?: string;
  attributes: CTAttribute[] | any[];
  availability?: {
    channels: {
      [channelId: string]: {
        isOnStock: boolean;
        availableQuantity: number;
        version: number;
        id: string;
      };
    };
  };
  prices: PriceObject[] | any[];
  images: Image[] | any[];
  assets: any[];
  calculatedPrice?: {
    price: Money;
    discountedPrice: Money;
    unitPrice: Money;
    unitDiscountedPrice: Money;
    discountRate: Money;
  };
  isMatchingVariant?: {
    channels: object;
    isOnStock?: boolean;
    restockableInDays?: number;
    availableQuantity?: number;
  };
  scopedPrice?: object | any[];
  scopedPriceDiscounted?: boolean;
};

export interface LineItem {
  id: string;
  productId: string;
  productKey?: string;
  name: LocalizedField;
  productType: {
    typeId: string;
    id: string;
    version: number;
  };
  productSlug?: LocalizedField;
  variant: ProductVariant | any[];
  price: PriceObject;
  quantity: number;
  discountedPricePerQuantity: any[];
  taxRate?: CtTaxRate;
  perMethodTaxRate: any[];
  addedAt: string;
  lastModifiedAt: string;
  state: State[] | any[];
  priceMode: string;
  lineItemMode: string;
  inventoryMode?: string;
  totalPrice: {
    type: string;
    currencyCode: string;
    centAmount: number;
    fractionDigits: number;
  };
  taxedPrice?: {
    totalNet: Money;
    totalGross: Money;
    totalTax?: Money;
  };
  taxedPricePortions: any[];
  lineDetails: {
    lineSubtotalPrice: number;
    discounts: CtDiscount[];
    lineNetPrice: number;
    taxes: CtTax[] | any[];
    lineGrossPrice: number;
    unitPrice: number;
    discountRate: number;
  };
  supplyChannel?: {
    typeId: string;
    id: string;
  };
  custom?: {
    type: {
      typeId: string;
      id: string;
    };
    fields: object;
  };
  shippingDetails?: {
    target: any[];
    valid: boolean;
  };
}

export interface Cart {
  type?: string;
  id: string;
  key?: string;
  version: number;
  versionModifiedAt?: string;
  lastMessageSequenceNumber?: number;
  createdAt?: string;
  lastModifiedAt?: string;
  lastModifiedBy?: {
    clientId: string;
    isPlatformClient: boolean;
  };
  createdBy?: {
    clientId: string;
    isPlatformClient: boolean;
  };
  customerId?: string;
  customerEmail?: string;
  customerGroup?: {
    typeId: string;
    id: string;
  };
  anonymousId?: string;
  businessUnit?: {
    typeId: string;
    key: string;
  };
  store?: {
    typeId: string;
    key: string;
  };
  lineItems: LineItem[] | any[];
  customLineItems: any[];
  totalLineItemQuantity?: number;
  totalPrice: {
    type: string;
    currencyCode: string;
    centAmount: number;
    fractionDigits: number;
  };
  taxedPrice?: {
    totalNet: Money;
    totalGross: Money;
    totalTax?: Money;
    taxPortions?: CtTaxPortion[];
  };
  taxedShippingPrice?: {
    totalNet: Money;
    totalGross: Money;
    totalTax?: Money;
    taxPortions?: CtTaxPortion[];
  };
  taxMode: string;
  taxRoundingMode: string;
  taxCalculationMode: string;
  inventoryMode: string;
  cartState: string;
  billingAddress?: object;
  shippingAddress?: object;
  shippingMode: string;
  shippingInfo?: {
    shippingMethodName: string;
    price: Money;
    shippingRate: ShippingRate;
  };
  shipping: Shipping | any[];
  itemShippingAddresses: string | any[];
  discountCodes: any[];
  directDiscounts: any[];
  refusedGifts: any[];
  paymentInfo?: {
    payments: any[];
  };
  country?: string;
  locale?: string;
  origin: string;
  custom?: {
    type: {
      typeId: string;
      id: string;
    };
    fields: object;
  };
  deleteDaysAfterLastModification?: number;
  totalDetails: {
    subtotalPrice: number;
    discounts: CtDiscount[] | any[];
    netPrice: number;
    taxes: CtTax[] | any[];
    grossPrice: number;
  };
}
