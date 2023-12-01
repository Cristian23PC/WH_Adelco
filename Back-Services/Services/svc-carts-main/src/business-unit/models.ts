import { ApiProperty } from '@nestjs/swagger';

export class BusinessUnit {
  constructor(
    id: string,
    version: number,
    key: string,
    status: string,
    stores: object[],
    storeMode: string,
    unitType: string,
    name: string,
    contactEmail: string,
    addresses: object[],
    shippingAddressIds: string[],
    defaultShippingAddressId: string,
    billingAddressIds: string[],
    defaultBillingAddressId: string,
    associates: object[],
    parentUnit: object,
    topLevelUnit: object,
    custom: object,
    createdAt: string,
    lastModifiedAt: string,
    lastModifiedBy: object,
    creditLimit: number,
    creditTermDays: number,
    creditExcessTolerance: number,
    isCreditBlocked: boolean
  ) {
    this.id = id;
    this.version = version;
    this.key = key;
    this.status = status;
    this.stores = stores;
    this.storeMode = storeMode;
    this.unitType = unitType;
    this.name = name;
    this.contactEmail = contactEmail;
    this.addresses = addresses;
    this.shippingAddressIds = shippingAddressIds;
    this.defaultShippingAddressId = defaultShippingAddressId;
    this.billingAddressIds = billingAddressIds;
    this.defaultBillingAddressId = defaultBillingAddressId;
    this.associates = associates;
    this.parentUnit = parentUnit;
    this.topLevelUnit = topLevelUnit;
    this.custom = custom;
    this.createdAt = createdAt;
    this.lastModifiedAt = lastModifiedAt;
    this.lastModifiedBy = lastModifiedBy;
    this.creditLimit = creditLimit;
    this.creditTermDays = creditTermDays;
    this.creditExcessTolerance = creditExcessTolerance;
    this.isCreditBlocked = isCreditBlocked;
  }

  @ApiProperty({ description: 'Business Unit ID' })
  id: string;

  @ApiProperty({ description: 'Business Unit Version' })
  version: number;

  @ApiProperty({ description: 'Business Unit Key' })
  key: string;

  @ApiProperty({ description: 'Business Unit Status' })
  status: string;

  @ApiProperty({ required: false, description: 'Business Unit Stores' })
  stores: object[];

  @ApiProperty({ description: 'Business Unit Store Mode' })
  storeMode: string;

  @ApiProperty({ description: 'Business Unit Unit Type' })
  unitType: string;

  @ApiProperty({ description: 'Business Unit Name' })
  name: string;

  @ApiProperty({ required: false, description: 'Business Unit Contact Email' })
  contactEmail: string;

  @ApiProperty({ description: 'Business Unit Addresses' })
  addresses: object[];

  @ApiProperty({ required: false, description: 'Business Unit Shipping Address IDs' })
  shippingAddressIds: string[];

  @ApiProperty({ required: false, description: 'Business Unit Default Shipping Address ID' })
  defaultShippingAddressId: string;

  @ApiProperty({ required: false, description: 'Business Unit Billing Address IDs' })
  billingAddressIds: string[];

  @ApiProperty({ required: false, description: 'Business Unit Default Billing Address ID' })
  defaultBillingAddressId: string;

  @ApiProperty({ description: 'Business Unit Associates' })
  associates: object[];

  @ApiProperty({ required: false, description: 'Business Unit Parent Unit' })
  parentUnit: object;

  @ApiProperty({ description: 'Business Unit Top Level Unit' })
  topLevelUnit: object;

  @ApiProperty({ description: 'Business Unit Custom Fields' })
  custom: object;

  @ApiProperty({ description: 'Business Unit Creation Time' })
  createdAt: string;

  @ApiProperty({ description: 'Business Unit Last Modification Time' })
  lastModifiedAt: string;

  @ApiProperty({ description: 'Business Unit Last Modified By' })
  lastModifiedBy: object;

  @ApiProperty({ description: 'Business Unit Credit Limit' })
  creditLimit: number;

  @ApiProperty({ description: 'Business Unit Credit Term in Days' })
  creditTermDays: number;

  @ApiProperty({ description: 'Business Unit Credit Excess Tolerance' })
  creditExcessTolerance: number;

  @ApiProperty({ description: 'Business Unit Credit Blocked Flag' })
  isCreditBlocked: boolean;
}

export interface ConvertedBusinessUnit {
  id: string;
  version: number;
  key?: string;
  status?: string;
  stores?: object[];
  storeMode?: string;
  unitType?: string;
  name?: string;
  distributionChannelId?: string;
  deliveryZoneKey: string;
  rut?: string;
  custom: undefined;
  contactEmail?: string;
  addresses?: object[];
  shippingAddressIds?: string[];
  defaultShippingAddressId?: string;
  billingAddressIds?: string[];
  defaultBillingAddressId?: string;
  associates?: object[];
  parentUnit?: object;
  topLevelUnit?: object;
  createdAt: string;
  lastModifiedAt?: string;
  lastModifiedBy?: object;
  creditLimit?: number;
  creditTermDays?: number;
  creditExcessTolerance?: number;
  isCreditBlocked?: boolean;
}
