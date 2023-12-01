import { LocalizedField, Money, Image } from '../general';
import { CTAttribute } from './CtAttribute';

export type CtProduct = {
  id: string;
  description: LocalizedField;
  slug: LocalizedField;
  masterVariant: {
    attributes: CTAttribute[];
    images: Image[];
    sku: string;
    calculatedPrice?: {
      price: Money;
      discountedPrice: Money;
      unitPrice: Money;
      unitDiscountedPrice: Money;
      discountRate: number;
    };
    availability?: {
      channels: {
        [channelId: string]: {
          isOnStock: boolean;
          availableQuantity: number;
          version: number;
          id: string;
        };
      },
      isOnStock?: boolean;
    };
  };
};
