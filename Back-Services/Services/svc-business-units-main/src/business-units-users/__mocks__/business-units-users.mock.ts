import { MinimumOrderAmountDto } from '@/business-units/models';
import { BusinessUnit } from '@commercetools/platform-sdk';
export const ADMIN_ROLE = 'admin-role';

export const mockCommercetoolsErrorMalformed = {
  statusCode: 400,
  message: `Malformed parameter: where: Syntax error while parsing 'where'. Unexpected end of input, expected SphereIdentifierChar, comparison operator, not, in, contains, is, within or matches (line 1, column 8):invalid`,
  errors: [
    {
      code: 'InvalidInput',
      message: `Malformed parameter: where: Syntax error while parsing 'where'. Unexpected end of input, expected SphereIdentifierChar, comparison operator, not, in, contains, is, within or matches (line 1, column 8):invalid`
    }
  ]
};

export const mockCommercetoolsErrorNotFound = {
  statusCode: 409,
  message: `Not Found`
};

export const mockCommercetoolsCustomerResponse = {
  results: [
    {
      id: 'user-id'
    }
  ]
};

export const mockCommercetoolsCustomerErrorResponse = {
  id: 'errorUnits',
  email: 'error-units@mail.com',
  firstName: 'John',
  lastName: 'Doe',
  password: '****aGg=',
  addresses: [],
  shippingAddressIds: [],
  billingAddressIds: [],
  isEmailVerified: false,
  stores: [],
  authenticationMode: 'Password'
};

export const mockCommercetoolsCustomerNoUnitsResponse = {
  id: 'noUnitsId',
  email: 'no-units@mail.com',
  firstName: 'John',
  lastName: 'Doe',
  password: '****aGg=',
  addresses: [],
  shippingAddressIds: [],
  billingAddressIds: [],
  isEmailVerified: false,
  stores: [],
  authenticationMode: 'Password'
};

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
      roles: ['Buyer']
    }
  ],
  topLevelUnit: {
    typeId: 'business-unit',
    key: 'key'
  },
  minimumOrderAmount: {
    type: 'string',
    currencyCode: 'CLP',
    centAmount: 5000,
    fractionDigits: 0
  }
};

export const mockDivisionBusinessUnit: Partial<BusinessUnit & { minimumOrderAmount: MinimumOrderAmountDto }> = {
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
      associateRoleAssignments: [{ associateRole: { key: ADMIN_ROLE, typeId: 'associate-role' }, inheritance: 'Disabled' }],
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
  minimumOrderAmount: {
    type: 'string',
    currencyCode: 'CLP',
    centAmount: 5000,
    fractionDigits: 0
  }
};

export const mockCommercetoolsErrorTimeout = {
  statusCode: 400,
  message:
    'The query timed out. If your query constantly times out, please check that it follows the performance best practices (see https://docs.commercetools.com/api/predicates/query#performance-considerations).',
  errors: [
    {
      code: 'QueryTimedOut',
      message:
        'The query timed out. If your query constantly times out, please check that it follows the performance best practices (see https://docs.commercetools.com/api/predicates/query#performance-considerations).'
    }
  ]
};
