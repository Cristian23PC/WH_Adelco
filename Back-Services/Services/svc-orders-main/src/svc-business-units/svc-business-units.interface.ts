import { BusinessUnitKeyReference } from '@commercetools/platform-sdk';

type Frequency = 'W' | 'B1' | 'B2' | 'TR1' | 'TR2' | 'TR3' | 'M1' | 'M2' | 'M3' | 'M4';

type DeliveryDays = Array<0 | 1 | 2 | 3 | 4 | 5 | 6>;

interface MinimumOrderAmountDto {
  type: string;
  currencyCode: string;
  centAmount: number;
  fractionDigits: number;
}

interface BusinessUnit {
  id: string;
  version: number;
  key: string;
  status: string;
  stores: object[];
  storeMode: string;
  unitType: string;
  name: string;
  contactEmail: string;
  addresses: object[];
  shippingAddressIds: string[];
  defaultShippingAddressId: string;
  billingAddressIds: string[];
  defaultBillingAddressId: string;
  associates: object[];
  parentUnit: BusinessUnitKeyReference;
  topLevelUnit: object;
  custom: object;
  createdAt: string;
  lastModifiedAt: string;
  lastModifiedBy: object;
  minimumOrderAmount: MinimumOrderAmountDto;
}

export interface IDeliveryZoneCustomObjectValue {
  label: string;
  t2Rate: string;
  commune: string;
  dcCode: string;
  dcLabel: string;
  isAvailable: boolean;
  preparationTime: number;
  cutoffTime: string[];
  deliveryDays: DeliveryDays;
  deliveryRange: number;
  frequency: Frequency;
}

export interface ConvertedBusinessUnit extends Partial<BusinessUnit> {
  distributionChannelId?: string;
  deliveryZoneKey: string;
  rut?: string;
  taxProfile?: string;
  shouldApplyT2Rate?: boolean;
  externalId?: string;
  distributionCenter?: string;
  customerGroupCode?: string;
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
}
