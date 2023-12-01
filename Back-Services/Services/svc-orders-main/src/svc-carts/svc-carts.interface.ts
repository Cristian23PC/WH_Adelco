import { AdelcoCart } from '@adelco/price-calc';

export interface IGetActiveCartResponse extends AdelcoCart {
  isCartAdjusted: boolean;
}
