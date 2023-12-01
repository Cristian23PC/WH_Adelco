import { BusinessUnit, Company } from '@commercetools/platform-sdk';
import { BusinessUnitList, MinimumOrderAmountDto } from '../models';
import { FilterGetAllBusinessUnits } from '../dto/business-units.dto';
import { EBusinessUnitsSort } from '../enum/business-units-sort.enum';
import { EBusinessUnitsSortField } from '../enum/business-units-sort-field.enum';

export const ADMIN_ROLE = 'admin-role';
export const BUYER_ROLE = 'buyer-role';

export const mockCompanyBusinessUnit: Partial<BusinessUnit & { minimumOrderAmount: MinimumOrderAmountDto }> = {
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
      associateRoleAssignments: [{ associateRole: { key: ADMIN_ROLE, typeId: 'associate-role' }, inheritance: 'Disabled' }],
      roles: ['Admin']
    }
  ],
  custom: {
    type: {
      typeId: 'type',
      id: '8c93a24a-79c0-4c00-b857-5cfbf966e224'
    },
    fields: {
      externalId: 'sap_buid',
      rut: '123456789',
      isCreditEnabled: true,
      isCreditBlocked: true,
      creditLimit: 1000,
      creditExcessTolerance: 500,
      creditTermDays: 30,
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
  minimumOrderAmount: {
    centAmount: 5000,
    currencyCode: 'CLP',
    fractionDigits: 0,
    type: 'string'
  }
};

export const mockCompanyBusinessUnitWithAssociatesExpanded: Partial<BusinessUnit> = {
  ...mockCompanyBusinessUnit,
  associates: [
    {
      customer: {
        typeId: 'customer',
        id: 'customerId',
        obj: {
          email: 'not-the-user@user.com',
          id: '',
          version: 0,
          createdAt: '',
          lastModifiedAt: '',
          addresses: [],
          isEmailVerified: false,
          authenticationMode: ''
        }
      },
      associateRoleAssignments: [{ associateRole: { key: ADMIN_ROLE, typeId: 'associate-role' }, inheritance: 'Disabled' }],
      roles: ['Admin']
    },
    {
      customer: {
        typeId: 'customer',
        id: 'customerId',
        obj: {
          email: 'user@user.com',
          id: '',
          version: 0,
          createdAt: '',
          lastModifiedAt: '',
          addresses: [],
          isEmailVerified: false,
          authenticationMode: ''
        }
      },
      associateRoleAssignments: [{ associateRole: { key: ADMIN_ROLE, typeId: 'associate-role' }, inheritance: 'Disabled' }],
      roles: ['Admin']
    }
  ]
};

export const mockDivisionBusinessUnit: Partial<BusinessUnit> = {
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
      associateRoleAssignments: [{ associateRole: { key: BUYER_ROLE, typeId: 'associate-role' }, inheritance: 'Disabled' }],
      roles: ['Buyer']
    }
  ],
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
  }
};

export const mockBusinessUnitSubchannel: Partial<BusinessUnit> = {
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
      associateRoleAssignments: [{ associateRole: { key: ADMIN_ROLE, typeId: 'associate-role' }, inheritance: 'Disabled' }],
      roles: ['Admin']
    }
  ],
  custom: {
    type: {
      typeId: 'type',
      id: '8c93a24a-79c0-4c00-b857-5cfbf966e224'
    },
    fields: {
      externalId: 'sap_buid',
      isCreditEnabled: true,
      isCreditBlocked: true,
      creditLimit: 1000,
      creditExcessTolerance: 500,
      creditTermDays: 30,
      customerGroupCode: 'INSTITUCIONES',
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
  }
};

export const mockBusinessUnitDifferentSubchannel: Partial<BusinessUnit> = {
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
      associateRoleAssignments: [{ associateRole: { key: ADMIN_ROLE, typeId: 'associate-role' }, inheritance: 'Disabled' }],
      roles: ['Admin']
    }
  ],
  custom: {
    type: {
      typeId: 'type',
      id: '8c93a24a-79c0-4c00-b857-5cfbf966e224'
    },
    fields: {
      externalId: 'sap_buid',
      isCreditEnabled: true,
      isCreditBlocked: true,
      creditLimit: 1000,
      creditExcessTolerance: 500,
      creditTermDays: 30,
      customerGroupCode: 'INSTITUCIONES',
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
  }
};

export const mockBusinessUnitByGroup: Partial<BusinessUnit> = {
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
      associateRoleAssignments: [{ associateRole: { key: ADMIN_ROLE, typeId: 'associate-role' }, inheritance: 'Disabled' }],
      roles: ['Admin']
    }
  ],
  custom: {
    type: {
      typeId: 'type',
      id: '8c93a24a-79c0-4c00-b857-5cfbf966e224'
    },
    fields: {
      externalId: 'sap_buid2',
      isCreditEnabled: true,
      isCreditBlocked: true,
      creditLimit: 1000,
      creditExcessTolerance: 500,
      creditTermDays: 30,
      taxProfile: '1',
      shouldApplyT2Rate: false,
      customerGroupCode: 'TRADICIONAL',
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
  }
};

export const mockBusinessUnitMissingDC: Partial<BusinessUnit> = {
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
      associateRoleAssignments: [{ associateRole: { key: ADMIN_ROLE, typeId: 'associate-role' }, inheritance: 'Disabled' }],
      roles: ['Admin']
    }
  ],
  custom: {
    type: {
      typeId: 'type',
      id: '8c93a24a-79c0-4c00-b857-5cfbf966e224'
    },
    fields: {
      externalId: 'sap_buid',
      isCreditEnabled: true,
      isCreditBlocked: true,
      creditLimit: 1000,
      creditExcessTolerance: 500,
      creditTermDays: 30,
      taxProfile: '1',
      shouldApplyT2Rate: false,
      customerGroupCode: 'TRADICIONAL',
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
  }
};

export const responseBusinessUnitActions = [
  { action: 'changeName', name: 'name' },
  { action: 'setCustomField', name: 'deliveryZone', value: { id: 'id', typeId: 'key-value-document' } },
  { action: 'setCustomField', name: 'tradeName', value: 'trade-name' },
  { action: 'setCustomField', name: 'customerGroupCode', value: '01' },
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
      streetNumber: 'streetNumber',
      custom: {
        fields: {
          lat: 1,
          long: 1
        },
        type: {
          key: 'adelco-address-type',
          typeId: 'type'
        }
      }
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
      streetNumber: 'streetNumber',
      custom: {
        fields: {
          lat: 1,
          long: 1
        },
        type: {
          key: 'adelco-address-type',
          typeId: 'type'
        }
      }
    }
  },
  { action: 'addBillingAddressId', addressKey: 'billing-address' },
  { action: 'setDefaultBillingAddress', addressKey: 'billing-address' }
];

export const responseMinimumBusinessUnitActions = [
  { action: 'setCustomField', name: 'deliveryZone', value: { id: 'id', typeId: 'key-value-document' } },
  { action: 'setCustomField', name: 'customerGroupCode', value: '01' },
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
      department: 'commune',
      key: 'shipping-address',
      region: 'region',
      streetName: 'streetName',
      streetNumber: 'streetNumber',
      custom: undefined
    }
  },
  { action: 'addShippingAddressId', addressKey: 'shipping-address' },
  { action: 'setDefaultShippingAddress', addressKey: 'shipping-address' }
];

export const requestBusinessUnitMock = {
  name: 'name',
  tradeName: 'trade-name',
  address: {
    country: 'CL',
    city: 'locality',
    streetName: 'streetName',
    streetNumber: 'streetNumber',
    commune: 'commune',
    region: 'region',
    apartment: 'apartment',
    otherInformation: 'otherInformation',
    coordinates: {
      lat: 1,
      long: 1
    }
  },
  billingAddress: {
    country: 'CL',
    city: 'locality',
    streetName: 'streetName',
    streetNumber: 'streetNumber',
    commune: 'commune',
    region: 'region',
    apartment: 'apartment',
    otherInformation: 'otherInformation',
    coordinates: {
      lat: 1,
      long: 1
    }
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
  key: '60001',
  status: 'Inactive',
  associateMode: 'Explicit',
  associates: [
    {
      roles: ['Admin'],
      associateRoleAssignments: [{ associateRole: { key: ADMIN_ROLE, typeId: 'associate-role' }, inheritance: 'Disabled' }],
      customer: { typeId: 'customer', id: '88b72a5c-b238-4dea-9196-74ce3b8b04e9' }
    }
  ],
  custom: {
    type: { typeId: 'type', id: 'adelco-business-unit-type' },
    fields: { rut: '123456789' }
  }
};

export const divisionExpected = {
  addresses: [],
  associates: [
    {
      associateRoleAssignments: [
        {
          associateRole: {
            key: 'admin-role',
            typeId: 'associate-role'
          },
          inheritance: 'Disabled'
        }
      ],
      customer: {
        id: 'customerId',
        typeId: 'customer'
      },
      roles: ['Admin']
    }
  ],
  billingAddressIds: [],
  custom: undefined,
  deliveryZoneKey: 'company-city',
  distributionCenter: 'COMPANY_DC',
  distributionChannelId: '001eed74-f30a-4be6-9bf2-93af3d1ed35e',
  externalId: 'sap_buid',
  id: 'id',
  key: 'key',
  name: 'Name',
  rut: '123456789',
  customerGroupCode: 'TRADICIONAL',
  shippingAddressIds: [],
  shouldApplyT2Rate: true,
  status: 'Active',
  storeMode: 'Explicit',
  stores: [],
  t2Rate: '0.12',
  taxProfile: '1',
  topLevelUnit: {
    key: 'key',
    typeId: 'business-unit'
  },
  tradeName: undefined,
  unitType: 'Company',
  version: 2,
  isCreditEnabled: true,
  isCreditBlocked: true,
  creditLimit: 1000,
  creditExcessTolerance: 500,
  creditTermDays: 30
};

export const mockBusinessUnitList: BusinessUnitList[] = [
  {
    id: 'test',
    name: 'test',
    rut: '1234567890',
    addresses: [],
    email: 'test'
  }
];

export const filterGetAllBusinessUnitsMock: FilterGetAllBusinessUnits = {
  sortField: EBusinessUnitsSortField.name,
  sort: EBusinessUnitsSort.asc,
  limit: 10,
  offset: 0
};

export const mocktFindBusinessUnit: Partial<BusinessUnit> = {
  id: 'test',
  version: 1,
  key: 'test',
  name: 'test',
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
        id: 'test',
        obj: {
          email: 'test',
          id: '',
          version: 0,
          createdAt: '',
          lastModifiedAt: '',
          addresses: [],
          isEmailVerified: false,
          authenticationMode: ''
        }
      },
      associateRoleAssignments: [{ associateRole: { key: ADMIN_ROLE, typeId: 'associate-role' }, inheritance: 'test' }],
      roles: ['test']
    }
  ],
  custom: {
    type: {
      typeId: 'type',
      id: 'test'
    },
    fields: {
      externalId: 'test',
      rut: '1234567890',
      isCreditEnabled: true,
      isCreditBlocked: true,
      creditLimit: 0,
      creditExcessTolerance: 0,
      creditTermDays: 0,
      taxProfile: '2',
      shouldApplyT2Rate: true,
      customerGroupCode: 'test',
      deliveryZone: {
        typeId: 'test',
        id: 'test',
        obj: {
          id: 'test',
          version: 1,
          container: 'test',
          key: 'test',
          value: {
            label: 'test',
            t2Rate: '0.11',
            commune: 'test',
            dcCode: 'test',
            dcLabel: 'test'
          }
        }
      }
    }
  },
  topLevelUnit: {
    typeId: 'business-unit',
    key: 'key'
  }
};

export const mocktFindBusinessUnitCustomNull: Partial<BusinessUnit> = {
  id: 'test2',
  name: 'test2',
  addresses: [],
  associates: [],
  custom: null
};
