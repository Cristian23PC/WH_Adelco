import { CreateDivisionRequestDto } from '@/business-units/dto/division.dto';
import { CompanyDraft, CustomerDraft, DivisionDraft } from '@commercetools/platform-sdk';

export const mockCustomerDraft: CustomerDraft = {
  addresses: [{ country: 'CL', phone: '11111111111' }],
  authenticationMode: 'ExternalAuth',
  custom: {
    fields: {
      isFake: false
    },
    type: {
      key: 'adelco-customer-type',
      typeId: 'type'
    }
  },
  email: 'example@email.com',
  firstName: 'firstName',
  isEmailVerified: true,
  lastName: 'lastName'
};

export const mockBusinessUnitCompanyDraft: CompanyDraft = {
  associates: [
    { associateRoleAssignments: [{ associateRole: { key: 'admin-role', typeId: 'associate-role' }, inheritance: 'Enabled' }], customer: { id: 'customer-id', typeId: 'customer' } }
  ],
  addresses: [],
  custom: {
    fields: {
      rut: 'ruT',
      customerGroupCode: '01',
      deliveryZone: { id: 'delivery-zone-id', typeId: 'key-value-document' },
      isCreditBlocked: false,
      isCreditEnabled: false,
      shouldApplyT2Rate: true,
      taxProfile: '1',
      tradeName: 'trade-name'
    },
    type: { key: 'adelco-business-unit-type', typeId: 'type' }
  },
  key: '600001',
  name: 'Company rut',
  status: 'Inactive',
  unitType: 'Company',
  defaultBillingAddress: undefined,
  defaultShippingAddress: undefined
};

export const mockBusinessUnitCompanyDraftWithUpdatedRUT: CompanyDraft = {
  associates: [
    { associateRoleAssignments: [{ associateRole: { key: 'admin-role', typeId: 'associate-role' }, inheritance: 'Enabled' }], customer: { id: 'customer-id', typeId: 'customer' } }
  ],
  addresses: [],
  custom: {
    fields: {
      rut: 'ru-T',
      customerGroupCode: '01',
      deliveryZone: { id: 'delivery-zone-id', typeId: 'key-value-document' },
      isCreditBlocked: false,
      isCreditEnabled: false,
      shouldApplyT2Rate: true,
      taxProfile: '1',
      tradeName: 'trade-name'
    },
    type: { key: 'adelco-business-unit-type', typeId: 'type' }
  },
  key: '600001',
  name: 'Company ru-T',
  status: 'Inactive',
  unitType: 'Company',
  defaultBillingAddress: undefined,
  defaultShippingAddress: undefined
};

export const mockDivisionDraft: DivisionDraft = {
  addresses: [
    {
      apartment: 'string',
      city: 'Algarrobo',
      country: 'CL',
      department: 'string',
      email: 'email@email.com',
      firstName: 'John',
      lastName: 'Doe',
      additionalAddressInfo: 'string',
      phone: '563009000000',
      region: 'string',
      streetName: 'string',
      streetNumber: 'string'
    },
    {
      apartment: 'string',
      city: 'Algarrobo',
      country: 'CL',
      additionalAddressInfo: 'string',
      department: 'string',
      region: 'string',
      streetName: 'string',
      streetNumber: 'string'
    }
  ],
  associates: [
    {
      associateRoleAssignments: [
        {
          associateRole: {
            key: 'admin-role',
            typeId: 'associate-role'
          },
          inheritance: 'Enabled'
        }
      ],
      customer: {
        id: 'customerId',
        typeId: 'customer'
      }
    }
  ],
  custom: {
    fields: {
      deliveryZone: {
        id: 'delivery-zone-id',
        typeId: 'key-value-document'
      },
      isCreditEnabled: true,
      isCreditBlocked: true,
      creditLimit: 1000,
      creditExcessTolerance: 500,
      creditTermDays: 30,
      rut: '123456789',
      customerGroupCode: 'TRADICIONAL',
      shouldApplyT2Rate: true,
      taxProfile: '1',
      tradeName: 'TRADE NAME'
    },
    type: {
      key: 'adelco-business-unit-type',
      typeId: 'type'
    }
  },
  defaultBillingAddress: 1,
  defaultShippingAddress: 0,
  key: '600001',
  name: 'Division 123456789',
  parentUnit: {
    id: 'id',
    typeId: 'business-unit'
  },
  status: 'Active',
  unitType: 'Division'
};

export const divisionRequest: CreateDivisionRequestDto = {
  tradeName: 'TRADE NAME',
  address: {
    country: 'CL',
    region: 'string',
    commune: 'string',
    city: 'Algarrobo',
    streetName: 'string',
    streetNumber: 'string',
    apartment: 'string',
    otherInformation: 'string'
  },
  billingAddress: {
    country: 'CL',
    region: 'string',
    commune: 'string',
    city: 'Algarrobo',
    streetName: 'string',
    streetNumber: 'string',
    apartment: 'string',
    otherInformation: 'string'
  },
  contactInfo: {
    firstName: 'John',
    lastName: 'Doe',
    phone: '563009000000',
    email: 'email@email.com'
  }
};
