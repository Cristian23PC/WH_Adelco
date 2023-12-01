import { type Money } from '../general';

type CtSubTaxRate = {
  name: string;
  amount: number;
};

export type CtTaxRate = {
  name: string;
  amount: number;
  includedInPrice: boolean;
  country: string;
  subRates: CtSubTaxRate[] | [];
};

export type CtTax = {
  description: string;
  amount: number;
};

export type CtTaxPortion = {
  name: string;
  rate: number;
  amount: Money;
};