import { ConvertedBusinessUnit } from '../svc-business-units.interface';

export const mockGetById: ConvertedBusinessUnit = {
  id: 'd22b16d1-a64f-4ffd-8eb3-d26220552fc3',
  version: 17,
  createdAt: '2023-07-20T11:41:36.558Z',
  lastModifiedAt: '2023-08-18T09:30:14.233Z',
  lastModifiedBy: {
    isPlatformClient: true,
    user: {
      typeId: 'user',
      id: 'b729ba8c-4b28-4b7f-9746-6ba8e79e97dc'
    }
  },
  key: 'company-771134637',
  name: 'STARTER LIMITADA',
  addresses: [
    {
      id: '7yG61XHi',
      streetName: 'Test',
      streetNumber: '',
      city: 'La Calera',
      region: 'De Valparaíso',
      country: 'CL',
      department: 'La Calera',
      apartment: '',
      key: 'billing-address',
      custom: {
        type: {
          typeId: 'type',
          id: '325861c1-3138-4c0a-8a1d-32d8a45b96f7'
        },
        fields: {
          lat: -32.7873428,
          long: -71.20732
        }
      }
    },
    {
      id: 'xkSkgioa',
      streetName: 'Test',
      streetNumber: '',
      city: 'La Calera',
      region: 'De Valparaíso',
      country: 'CL',
      department: 'La Calera',
      apartment: '',
      key: 'shipping-address',
      custom: {
        type: {
          typeId: 'type',
          id: '325861c1-3138-4c0a-8a1d-32d8a45b96f7'
        },
        fields: {
          lat: -32.7873428,
          long: -71.20732
        }
      }
    }
  ],
  shippingAddressIds: ['xkSkgioa'],
  billingAddressIds: ['7yG61XHi'],
  defaultShippingAddressId: 'xkSkgioa',
  defaultBillingAddressId: '7yG61XHi',
  status: 'Active',
  storeMode: 'Explicit',
  stores: [],
  unitType: 'Company',
  associates: [
    {
      customer: {
        typeId: 'customer',
        id: '2043f427-2154-4678-ac80-8ea8da5eaa1d',
        obj: {
          id: '2043f427-2154-4678-ac80-8ea8da5eaa1d',
          version: 1,
          versionModifiedAt: '2023-07-20T11:41:36.328Z',
          lastMessageSequenceNumber: 1,
          createdAt: '2023-07-20T11:41:36.328Z',
          lastModifiedAt: '2023-07-20T11:41:36.328Z',
          lastModifiedBy: {
            clientId: 'BOklLvaKYxZx64jUT6B1Y3Fj',
            isPlatformClient: false
          },
          createdBy: {
            clientId: 'BOklLvaKYxZx64jUT6B1Y3Fj',
            isPlatformClient: false
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
      associateRoleAssignments: [
        {
          associateRole: {
            typeId: 'associate-role',
            key: 'admin-role'
          },
          inheritance: 'Disabled'
        }
      ]
    }
  ],
  topLevelUnit: {
    typeId: 'business-unit',
    key: 'company-771134637'
  },
  minimumOrderAmount: {
    type: 'string',
    currencyCode: 'CLP',
    centAmount: 1000,
    fractionDigits: 0
  },
  distributionChannelId: '737f492d-56f7-4ced-ac49-2957aca407e5',
  deliveryZoneKey: 'la-calera',
  rut: '771134637',
  taxProfile: '1',
  shouldApplyT2Rate: true,
  isCreditBlocked: true
};
