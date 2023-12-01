export interface Product {
  brandName: string;
  name: string;
  imageUrl: string;
  sku: string;
  outOfStock?: boolean;
  price?: string;
  unitSize?: string;
  unitPrice?: string;
  packUnits?: number;
  discount?: string;
  discountPrice?: string;
  availableQuantity?: number;
  calculatedPrice?: string;
}
