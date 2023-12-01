import { Associate, BusinessUnit, Company, Division } from '@commercetools/platform-sdk';
import { ConvertedBusinessUnit } from '@/business-unit/business-units.interface';

export const mockCompanyBusinessUnit: Partial<ConvertedBusinessUnit> = {
  id: 'id',
  version: 2,
  key: 'key',
  name: 'Name',
  addresses: [],
  shippingAddressIds: [],
  billingAddressIds: [],
  status: 'Active',
  storeMode: 'Explicit',
  stores: [],
  unitType: 'Company',
  creditTermDays: 30,
  associates: [
    {
      customer: {
        typeId: 'customer',
        id: 'customerId',
        obj: {
          id: '2043f427-2154-4678-ac80-8ea8da5eaa1d',
          version: 1,
          createdAt: '2023-07-20T11:41:36.328Z',
          lastModifiedAt: '2023-07-20T11:41:36.328Z',
          lastModifiedBy: {
            clientId: 'BOklLvaKYxZx64jUT6B1Y3Fj'
          },
          createdBy: {
            clientId: 'BOklLvaKYxZx64jUT6B1Y3Fj'
          },
          email: 'Gssghd@hdhd.com',
          firstName: 'Geysgs',
          lastName: 'Hdhdhd',
          addresses: [
            {
              id: 'x_9ShL0v',
              country: 'CL',
              phone: '56613467994'
            }
          ],
          shippingAddressIds: [],
          billingAddressIds: [],
          isEmailVerified: true,
          stores: [],
          authenticationMode: 'ExternalAuth'
        }
      },
      roles: ['Admin']
    }
  ] as unknown as Associate[],
  custom: {
    type: {
      typeId: 'type',
      id: '8c93a24a-79c0-4c00-b857-5cfbf966e224'
    },
    fields: {
      isCreditEnabled: false,
      isCreditBlocked: false,
      salesChannelCode: 'TRADICIONAL',
      taxProfile: '1',
      shouldApplyT2Rate: true,
      deliveryZone: {
        typeId: 'key-value-document',
        id: '82bb73f9-19d1-4486-a6c7-111111111111',
        obj: {
          id: '82bb73f9-19d1-4486-a6c7-111111111111',
          version: 1,
          container: 'delivery-zone',
          key: 'company-city',
          value: {
            label: 'Company City',
            t2Rate: '0.12',
            commune: 'company-commune',
            dcCode: 'COMPANY_DC',
            dcLabel: 'Company Distribution Center'
          }
        }
      }
    }
  },
  topLevelUnit: {
    typeId: 'business-unit',
    key: 'key'
  },
  createdAt: '',
  lastModifiedAt: '',
  associateMode: ''
};

export const mockDivisionBusinessUnit: Division = {
  id: 'div-id',
  version: 2,
  key: 'div-key',
  name: 'Division Name',
  addresses: [],
  shippingAddressIds: [],
  billingAddressIds: [],
  status: 'Active',
  storeMode: 'Explicit',
  stores: [],
  unitType: 'Division',
  associates: [
    {
      customer: {
        typeId: 'customer',
        id: 'anotherCustomerId'
      },
      roles: ['Buyer']
    }
  ] as unknown as Associate[],
  parentUnit: {
    typeId: 'business-unit',
    key: 'key'
  },
  topLevelUnit: {
    typeId: 'business-unit',
    key: 'key'
  },
  custom: {
    type: {
      typeId: 'type',
      id: 'id'
    },
    fields: {
      rut: 'rut'
    }
  },
  createdAt: '',
  lastModifiedAt: '',
  associateMode: ''
};

export const mockBusinessUnitSubchannel: Company = {
  id: 'id',
  version: 2,
  key: 'key',
  name: 'Name',
  addresses: [],
  shippingAddressIds: [],
  billingAddressIds: [],
  status: 'Active',
  storeMode: 'Explicit',
  stores: [],
  unitType: 'Company',
  associates: [
    {
      customer: {
        typeId: 'customer',
        id: 'customerId'
      },
      roles: ['Admin']
    }
  ] as unknown as Associate[],
  custom: {
    type: {
      typeId: 'type',
      id: '8c93a24a-79c0-4c00-b857-5cfbf966e224'
    },
    fields: {
      isCreditEnabled: false,
      isCreditBlocked: false,
      salesChannelCode: 'INSTITUCIONES',
      salesSubchannel: 'GOBIERNO',
      taxProfile: '1',
      shouldApplyT2Rate: true,
      deliveryZone: {
        typeId: 'key-value-document',
        id: '82bb73f9-19d1-4486-a6c7-111111111111',
        obj: {
          id: '82bb73f9-19d1-4486-a6c7-111111111111',
          version: 1,
          container: 'delivery-zone',
          key: 'company-city',
          value: {
            label: 'Company City',
            t2Rate: '0.12',
            commune: 'company-commune',
            dcCode: 'CHANNEL_SUBCHANNEL',
            dcLabel: 'Company Distribution Center'
          }
        }
      }
    }
  },
  topLevelUnit: {
    typeId: 'business-unit',
    key: 'key'
  },
  createdAt: '',
  lastModifiedAt: '',
  associateMode: ''
};

export const mockBusinessUnitDifferentSubchannel: Company = {
  id: 'id',
  version: 2,
  key: 'key',
  name: 'Name',
  addresses: [],
  shippingAddressIds: [],
  billingAddressIds: [],
  status: 'Active',
  storeMode: 'Explicit',
  stores: [],
  unitType: 'Company',
  associates: [
    {
      customer: {
        typeId: 'customer',
        id: 'customerId'
      },
      roles: ['Admin']
    }
  ] as unknown as Associate[],
  custom: {
    type: {
      typeId: 'type',
      id: '8c93a24a-79c0-4c00-b857-5cfbf966e224'
    },
    fields: {
      isCreditEnabled: false,
      isCreditBlocked: false,
      salesChannelCode: 'INSTITUCIONES',
      salesSubchannel: 'SINDICATOS',
      taxProfile: '1',
      shouldApplyT2Rate: true,
      deliveryZone: {
        typeId: 'key-value-document',
        id: '82bb73f9-19d1-4486-a6c7-111111111111',
        obj: {
          id: '82bb73f9-19d1-4486-a6c7-111111111111',
          version: 1,
          container: 'delivery-zone',
          key: 'company-city',
          value: {
            label: 'Company City',
            t2Rate: '0.12',
            commune: 'company-commune',
            dcCode: 'CHANNEL_SUBCHANNEL',
            dcLabel: 'Company Distribution Center'
          }
        }
      }
    }
  },
  topLevelUnit: {
    typeId: 'business-unit',
    key: 'key'
  },
  createdAt: '',
  lastModifiedAt: '',
  associateMode: ''
};

export const mockBusinessUnitByGroup: Company = {
  id: 'id',
  version: 2,
  key: 'key',
  name: 'Name',
  addresses: [],
  shippingAddressIds: [],
  billingAddressIds: [],
  status: 'Active',
  storeMode: 'Explicit',
  stores: [],
  unitType: 'Company',
  associates: [
    {
      customer: {
        typeId: 'customer',
        id: 'customerId'
      },
      roles: ['Admin']
    }
  ] as unknown as Associate[],
  custom: {
    type: {
      typeId: 'type',
      id: '8c93a24a-79c0-4c00-b857-5cfbf966e224'
    },
    fields: {
      isCreditEnabled: false,
      isCreditBlocked: false,
      taxProfile: '1',
      shouldApplyT2Rate: false,
      businessUnitGroup: 'MY-GROUP',
      salesChannelCode: 'TRADICIONAL',
      deliveryZone: {
        typeId: 'key-value-document',
        id: '82bb73f9-19d1-4486-a6c7-111111111111',
        obj: {
          id: '82bb73f9-19d1-4486-a6c7-111111111111',
          version: 1,
          container: 'delivery-zone',
          key: 'company-city',
          value: {
            label: 'Company City',
            t2Rate: '0.12',
            commune: 'company-commune',
            dcCode: 'COMPANY_DC',
            dcLabel: 'Company Distribution Center'
          }
        }
      }
    }
  },
  topLevelUnit: {
    typeId: 'business-unit',
    key: 'key'
  },
  createdAt: '',
  lastModifiedAt: '',
  associateMode: ''
};

export const mockBusinessUnitMissingDC: Company = {
  id: 'id',
  version: 2,
  key: 'key',
  name: 'Name',
  addresses: [],
  shippingAddressIds: [],
  billingAddressIds: [],
  status: 'Active',
  storeMode: 'Explicit',
  stores: [],
  unitType: 'Company',
  associates: [
    {
      customer: {
        typeId: 'customer',
        id: 'customerId'
      },
      roles: ['Admin']
    }
  ] as unknown as Associate[],
  custom: {
    type: {
      typeId: 'type',
      id: '8c93a24a-79c0-4c00-b857-5cfbf966e224'
    },
    fields: {
      isCreditEnabled: false,
      isCreditBlocked: false,
      taxProfile: '1',
      shouldApplyT2Rate: false,
      businessUnitGroup: 'MY-GROUP',
      salesChannelCode: 'TRADICIONAL',
      deliveryZone: {
        typeId: 'key-value-document',
        id: '82bb73f9-19d1-4486-a6c7-111111111111',
        obj: {
          id: '82bb73f9-19d1-4486-a6c7-111111111111',
          version: 1,
          container: 'delivery-zone',
          key: 'company-city',
          value: {
            label: 'Company City',
            t2Rate: '0.12',
            commune: 'company-commune',
            dcCode: 'MISSING_DC',
            dcLabel: 'Missing Distribution Center'
          }
        }
      }
    }
  },
  topLevelUnit: {
    typeId: 'business-unit',
    key: 'key'
  },
  createdAt: '',
  lastModifiedAt: '',
  associateMode: ''
};

export const responseBusinessUnitActions = [
  { action: 'changeName', name: 'name' },
  { action: 'setCustomField', name: 'deliveryZone', value: { id: 'id', typeId: 'key-value-document' } },
  { action: 'setCustomField', name: 'tradeName', value: 'trade-name' },
  { action: 'setCustomField', name: 'salesChannelCode', value: '1' },
  { action: 'setCustomField', name: 'shouldApplyT2Rate', value: true },
  { action: 'setCustomField', name: 'isCreditEnabled', value: false },
  { action: 'setCustomField', name: 'isCreditBlocked', value: false },
  { action: 'setCustomField', name: 'taxProfile', value: '1' },
  {
    action: 'addAddress',
    address: {
      additionalAddressInfo: 'otherInformation',
      apartment: 'apartment',
      city: 'locality',
      country: 'CL',
      department: 'commune',
      key: 'shipping-address',
      region: 'region',
      streetName: 'streetName',
      streetNumber: 'streetNumber'
    }
  },
  { action: 'addShippingAddressId', addressKey: 'shipping-address' },
  { action: 'setDefaultShippingAddress', addressKey: 'shipping-address' },
  {
    action: 'addAddress',
    address: {
      additionalAddressInfo: 'otherInformation',
      apartment: 'apartment',
      city: 'locality',
      country: 'CL',
      department: 'commune',
      key: 'billing-address',
      region: 'region',
      streetName: 'streetName',
      streetNumber: 'streetNumber'
    }
  },
  { action: 'addBillingAddressId', addressKey: 'billing-address' },
  { action: 'setDefaultBillingAddress', addressKey: 'billing-address' },
  { action: 'changeStatus', status: 'Active' }
];

export const responseMinimumBusinessUnitActions = [
  { action: 'setCustomField', name: 'deliveryZone', value: { id: 'id', typeId: 'key-value-document' } },
  { action: 'setCustomField', name: 'salesChannelCode', value: '1' },
  { action: 'setCustomField', name: 'shouldApplyT2Rate', value: true },
  { action: 'setCustomField', name: 'isCreditEnabled', value: false },
  { action: 'setCustomField', name: 'isCreditBlocked', value: false },
  { action: 'setCustomField', name: 'taxProfile', value: '1' },
  {
    action: 'addAddress',
    address: {
      additionalAddressInfo: undefined,
      apartment: undefined,
      city: 'locality',
      country: 'CL',
      department: undefined,
      key: 'shipping-address',
      region: undefined,
      streetName: 'streetName',
      streetNumber: 'streetNumber'
    }
  },
  { action: 'addShippingAddressId', addressKey: 'shipping-address' },
  { action: 'setDefaultShippingAddress', addressKey: 'shipping-address' },
  { action: 'changeStatus', status: 'Active' }
];

export const requestBusinessUnitMock = {
  name: 'name',
  tradeName: 'trade-name',
  address: {
    country: 'CL',
    locality: 'locality',
    streetName: 'streetName',
    streetNumber: 'streetNumber',
    commune: 'commune',
    region: 'region',
    apartment: 'apartment',
    otherInformation: 'otherInformation'
  },
  billingAddress: {
    country: 'CL',
    locality: 'locality',
    streetName: 'streetName',
    streetNumber: 'streetNumber',
    commune: 'commune',
    region: 'region',
    apartment: 'apartment',
    otherInformation: 'otherInformation'
  }
};

export const mockBusinessUnitCreated: Company = {
  id: 'business-unit-id',
  version: 1,
  createdAt: '',
  lastModifiedAt: '',
  storeMode: 'store',
  addresses: [],
  topLevelUnit: undefined,
  unitType: 'Company',
  name: 'Company 123456789',
  key: 'company-123456789',
  status: 'Inactive',
  associates: [{ roles: ['Admin'], customer: { typeId: 'customer', id: '88b72a5c-b238-4dea-9196-74ce3b8b04e9' } }] as unknown as Associate[],
  custom: {
    type: { typeId: 'type', id: 'adelco-business-unit-type' },
    fields: { rut: '123456789' }
  },
  associateMode: ''
};

export const mockConvertedBusinessUnit: ConvertedBusinessUnit = {
  deliveryZoneKey: 'delivery-zone',
  distributionChannelId: 'distributionChannelId',
  rut: 'rut',
  taxProfile: 'taxProfile',
  shouldApplyT2Rate: true,
  externalId: 'externalId',
  distributionCenter: 'distributionCenter',
  salesChannelCode: 'salesChannelCode',
  t2Rate: 't2Rate',
  tradeName: 'tradeName',
  minimumOrderAmount: {
    type: 'type',
    currencyCode: 'currencyCode',
    centAmount: 123,
    fractionDigits: 123
  },
  creditLimit: 123,
  creditTermDays: 123,
  creditExcessTolerance: 123,
  isCreditBlocked: false,
  isCreditEnabled: true
};

export const mockCompanyBusinessUnitWithFullDeliveryZone: Partial<BusinessUnit> = {
  ...mockCompanyBusinessUnit,
  custom: {
    type: {
      typeId: 'type',
      id: '8c93a24a-79c0-4c00-b857-5cfbf966e224'
    },
    fields: {
      externalId: 'sap_buid',
      rut: '123456789',
      isCreditEnabled: false,
      isCreditBlocked: false,
      customerGroupCode: 'TRADICIONAL',
      taxProfile: '1',
      shouldApplyT2Rate: true,
      deliveryZone: {
        typeId: 'key-value-document',
        id: '82bb73f9-19d1-4486-a6c7-111111111111',
        obj: {
          id: '82bb73f9-19d1-4486-a6c7-111111111111',
          version: 1,
          container: 'delivery-zone',
          key: 'company-city',
          value: {
            label: 'Company City',
            t2Rate: '0.12',
            commune: 'company-commune',
            dcCode: 'COMPANY_DC',
            dcLabel: 'Company Distribution Center',
            cutoffTime: ['23:59'],
            deliveryDays: [5],
            deliveryRange: 0,
            preparationTime: 2,
            frequency: 'W',
            isAvailable: true,
            method: 'Delivery'
          }
        }
      }
    }
  }
};
