import { Zone } from '../user';

export interface BusinessUnitPayload {
  id: string;
  address: any;
  name: string;
  tradeName: string;
}

interface BusinessUnitAddress {
  id: string;
  city: string;
  region: string;
  department: string;
  key: 'billing-address' | 'shipping-address';
}

export interface CtBusinessUnit {
  addresses: BusinessUnitAddress[];
  billingAddressIds: string[];
  distributionChannelId?: string;
  deliveryZoneKey?: string;
  id: string;
  rut: string;
  name: string;
  status: string;
  associates: BUAssociate[];
}

export type BUAssociate = {
  customer: BUCustomer;
  roles: string[];
};

export type BUCustomer = {
  typeId: string;
  id: string;
  obj: BUCustomerObj;
};

export type BUCustomerObj = {
  id: string;
  version: number;
  versionModifiedAt: Date;
  lastMessageSequenceNumber: number;
  createdAt: Date;
  lastModifiedAt: Date;
  lastModifiedBy: BUEditedBy;
  createdBy: BUEditedBy;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  addresses: any[];
  shippingAddressIds: any[];
  billingAddressIds: any[];
  isEmailVerified: boolean;
  stores: any[];
  authenticationMode: string;
  customerNumber?: string;
  middleName?: string;
  title?: string;
  salutation?: string;
  companyName?: string;
};

export type BUEditedBy = {
  clientId?: string;
  isPlatformClient: boolean;
};

export interface CtAddress {
  id: string;
  city: string;
  region: string;
  department: string;
  streetName?: string;
  streetNumber?: string;
  key: 'billing-address' | 'shipping-address';
}

export interface AddressZone {
  shippingAddress: CtAddress;
  zone: Zone;
}

export interface DeliveryAddressFormFormatedValues {
  tradeName: string;
  address: {
    country: string;
    region: string;
    commune: string;
    city?: string;
    streetName: string;
    streetNumber?: string;
    apartment?: string;
    otherInformation?: string;
    coordinates: {
      lat: number;
      long: number;
    };
  };
  contactInfo: {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
  };
}

export interface AddDeliveryAddressResponse {
  id: string;
  version: 0;
  key: string;
  status: string;
  stores: string[];
  storeMode: string;
  unitType: string;
  name: string;
  contactEmail: string;
  addresses: string[];
  shippingAddressIds: string[];
  defaultShippingAddressId: string;
  billingAddressIds: string[];
  defaultBillingAddressId: string;
  associates: string[];
  parentUnit: any;
  topLevelUnit: any;
  custom: any;
  createdAt: string;
  lastModifiedAt: string;
  lastModifiedBy: any;
}
