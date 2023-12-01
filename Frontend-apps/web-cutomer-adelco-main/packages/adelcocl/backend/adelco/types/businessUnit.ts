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
}

export type CtDeliveryZone = CtDeliveryZoneItem[];

export interface CtAddress {
  city: string;
  region: string;
  department: string;
  key: 'billing-address' | 'shipping-address';
}

interface CtBusinessUnit {
  addresses: CtAddress[];
  distributionChannelId?: string;
  deliveryZoneKey?: string;
  id: string;
}

export interface CtBusinessUnits {
  businessUnits: CtBusinessUnit[];
}
