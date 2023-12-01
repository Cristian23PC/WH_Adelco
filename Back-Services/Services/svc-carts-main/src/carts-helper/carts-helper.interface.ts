import { Cart, Channel, LineItemDraft, ProductProjection } from '@commercetools/platform-sdk';

export interface IGetProductsDraftAndLineItemsIdsToDeleteResponse {
  productsDraft: LineItemDraft[];
  lineItemsIdsToDelete: string[];
  isQuantityUpdated?: boolean;
  isPriceUpdated?: boolean;
}

export interface IGetProductsDraftAndLineItemsIdsToDeleteRequest {
  lineItemsDraft: LineItemDraft[];
  cart?: Cart;
  distributionChannelId?: string;
  taxProfile?: string;
  isSyncCart?: boolean;
  shouldApplyT2Rate?: boolean;
  dcCode: string;
  t2Rate: string;
  isUpdateLastVerificationTime?: boolean;
}

export interface IGetProductForCartRequest {
  sku: string;
  products: ProductProjection[];
  dcCode: string;
  t2Rate: string;
  newQuantity: number;
  oldQuantity: number;
  supplyChannels: Channel[];
  taxProfile?: string;
  distributionChannelId?: string;
  isSyncCart?: boolean;
  shouldApplyT2Rate?: boolean;
}
