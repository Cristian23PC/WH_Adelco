import { Money } from '@Types/adelco/general';
export interface CtRegion {
  key: string;
  label: string;
}

export interface CtCommune extends CtRegion {
  region: string;
}

interface CtDeliveryZoneItem extends CtRegion {
  id: string;
  commune: string;
  dcCode: string;
  dcLabel: string;
  dchDefault?: string;
  minimumOrderAmount?: Money;
}

export type CtDeliveryZone = CtDeliveryZoneItem[];

export interface CtAddress {
  id: string;
  city: string;
  region: string;
  department: string;
  streetName?: string;
  streetNumber?: string;
  key: 'billing-address' | 'shipping-address';
}

export interface CtBusinessUnit {
  status: string;
  addresses: CtAddress[];
  distributionChannelId?: string;
  deliveryZoneKey?: string;
  id: string;
  shippingAddressIds?: string[];
  unitType: UnitType;
  shouldApplyT2Rate?: boolean;
  taxProfile?: string;
  minimumOrderAmount?: Money;
}

export type UnitType = 'Company' | 'Division';
export interface CtBusinessUnits {
  businessUnits: CtBusinessUnit[];
}
