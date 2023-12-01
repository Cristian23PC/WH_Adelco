import { BusinessUnitKeyReference } from '@commercetools/platform-sdk';

export const mockCompanyBusinessUnit = {
  id: 'fac42344-4b72-473e-8b29-2852439abb93',
  version: 1,
  versionModifiedAt: '2023-08-21T08:15:38.518Z',
  lastMessageSequenceNumber: 1,
  createdAt: '2023-08-21T08:15:38.518Z',
  lastModifiedAt: '2023-08-21T08:15:38.518Z',
  lastModifiedBy: {
    clientId: 'BOklLvaKYxZx64jUT6B1Y3Fj',
    isPlatformClient: false,
    externalUserId: 'test.4@mail.com'
  },
  createdBy: {
    clientId: 'BOklLvaKYxZx64jUT6B1Y3Fj',
    isPlatformClient: false,
    externalUserId: 'test.4@mail.com'
  },
  key: 'Company-1401246K-1692605738434',
  name: 'Company 1401246K',
  shippingAddressIds: ['4I_eQlfZ'],
  billingAddressIds: ['2ZWqkugv'],
  defaultShippingAddressId: '4I_eQlfZ',
  defaultBillingAddressId: '2ZWqkugv',
  status: 'Active',
  storeMode: 'FromParent',
  associateMode: 'ExplicitAndFromParent',
  unitType: 'Company',
  associates: [],
  parentUnit: {} as BusinessUnitKeyReference,
  topLevelUnit: {},
  minimumOrderAmount: {
    type: 'string',
    currencyCode: 'CLP',
    centAmount: 5000,
    fractionDigits: 0
  },
  distributionChannelId: '737f492d-56f7-4ced-ac49-2957aca407e5',
  deliveryZoneKey: 'chimbarongo',
  rut: '1401246K',
  taxProfile: '1',
  shouldApplyT2Rate: true,
  externalId: 'sapID',
  customerGroupCode: '01',
  distributionCenter: '1800',
  t2Rate: '0.076',
  tradeName: 'Pritty Division 2',
  isCreditBlocked: false,
  isCreditEnabled: false
};

export const mockDivisionBusinessUnit = {
  ...mockCompanyBusinessUnit,
  key: 'division-1401246K-1692605738434',
  name: 'Division 1401246K',
  unitType: 'Division',
  associates: [],
  parentUnit: { typeId: 'business-unit', key: 'pritty' } as BusinessUnitKeyReference
};

export const mockCompanyBusinessUnitCreditBlocked = {
  ...mockCompanyBusinessUnit,
  isCreditBlocked: true,
  custom: {
    fields: {
      isCreditBlocked: true
    }
  }
};

export const mockDivisionBusinessUnitCreditBlocked = {
  ...mockDivisionBusinessUnit,
  isCreditBlocked: true
};
