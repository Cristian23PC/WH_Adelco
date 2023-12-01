import { Address } from '@/carts/dto/orderContactRequest';
import { Company, Division } from '@commercetools/platform-sdk';

export type ICustomerBusinessUnits = {
  businessUnits: ConvertedBusinessUnit[];
};

type Converted<T> = T & {
  deliveryZoneKey: string;
  distributionChannelId: string;
  rut?: string;
  taxProfile?: string;
  shouldApplyT2Rate?: boolean;
  externalId?: string;
  distributionCenter?: string;
  salesChannelCode?: string;
  t2Rate?: string;
  tradeName?: string;
  minimumOrderAmount?: {
    type: string;
    currencyCode: string;
    centAmount: number;
    fractionDigits: number;
  };
  creditLimit?: number;
  creditTermDays?: number;
  creditExcessTolerance?: number;
  isCreditBlocked?: boolean;
  isCreditEnabled?: boolean;
};

interface PartialCompany extends Converted<Partial<Company>> {}
interface PartialDivision extends Converted<Partial<Division>> {}

export type ConvertedBusinessUnit = PartialCompany | PartialDivision;

export interface RepRegistrationRequest {
  username?: string;
  rut: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  tradeName?: string;
  address: Address;
  billingAddress?: Address;
  isFakeCustomer?: boolean;
}
