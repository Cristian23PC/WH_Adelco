export default {
  businessUnits: [
    {
      id: 'e3632193-e35e-452e-b56d-aa3f28d912fc',
      version: 6,
      versionModifiedAt: '2023-04-21T02:09:03.365Z',
      lastMessageSequenceNumber: 3,
      createdAt: '2023-04-04T19:48:14.423Z',
      lastModifiedAt: '2023-04-21T02:09:03.365Z',
      lastModifiedBy: {
        isPlatformClient: true,
        user: {
          typeId: 'user',
          id: 'b729ba8c-4b28-4b7f-9746-6ba8e79e97dc'
        }
      },
      createdBy: {
        clientId: 'LxrGJIxBJVGYb4O1hlVhqNlc',
        isPlatformClient: false
      },
      key: 'pritty',
      name: 'Pritty',
      addresses: [],
      shippingAddressIds: [],
      billingAddressIds: [],
      status: 'Active',
      storeMode: 'Explicit',
      stores: [],
      inheritedAssociates: [],
      unitType: 'Company',
      associates: [
        {
          customer: {
            typeId: 'customer',
            id: '88b72a5c-b238-4dea-9196-74ce3b8b04e9',
            obj: {
              id: '88b72a5c-b238-4dea-9196-74ce3b8b04e9',
              version: 1,
              versionModifiedAt: '2023-04-04T20:01:50.974Z',
              lastMessageSequenceNumber: 1,
              createdAt: '2023-04-04T20:01:50.974Z',
              lastModifiedAt: '2023-04-04T20:01:50.974Z',
              lastModifiedBy: {
                clientId: 'LxrGJIxBJVGYb4O1hlVhqNlc',
                isPlatformClient: false
              },
              createdBy: {
                clientId: 'LxrGJIxBJVGYb4O1hlVhqNlc',
                isPlatformClient: false
              },
              email: 'johndoe@mail.com',
              firstName: 'John',
              lastName: 'Doe',
              password: '****DBQ=',
              addresses: [],
              shippingAddressIds: [],
              billingAddressIds: [],
              isEmailVerified: false,
              stores: [],
              authenticationMode: 'Password'
            }
          },
          roles: ['Admin']
        },
        {
          customer: {
            typeId: 'customer',
            id: 'ed35b1d6-6547-419c-84cb-20c560e3c5c4',
            obj: {
              id: 'ed35b1d6-6547-419c-84cb-20c560e3c5c4',
              version: 1,
              versionModifiedAt: '2023-04-20T14:05:37.701Z',
              lastMessageSequenceNumber: 1,
              createdAt: '2023-04-20T14:05:37.701Z',
              lastModifiedAt: '2023-04-20T14:05:37.701Z',
              lastModifiedBy: {
                isPlatformClient: true,
                user: {
                  typeId: 'user',
                  id: 'dc6a06b3-a980-4813-8dbc-3b0c93470e1f'
                }
              },
              createdBy: {
                isPlatformClient: true,
                user: {
                  typeId: 'user',
                  id: 'dc6a06b3-a980-4813-8dbc-3b0c93470e1f'
                }
              },
              customerNumber: '004',
              email: 'test.4@mail.com',
              firstName: 'Teste',
              lastName: 'Four',
              middleName: '',
              title: '',
              salutation: '',
              companyName: 'Pritty',
              password: '****C3Y=',
              addresses: [],
              shippingAddressIds: [],
              billingAddressIds: [],
              isEmailVerified: false,
              stores: [],
              authenticationMode: 'Password'
            }
          },
          roles: ['Buyer']
        }
      ],
      topLevelUnit: { typeId: 'business-unit', key: 'pritty' },
      distributionChannelId: '737f492d-56f7-4ced-ac49-2957aca407e5',
      deliveryZoneKey: 'cerrillos'
    },
    {
      id: 'adb1b6f6-3cbb-4f91-8c22-631e70baac77',
      version: 3,
      versionModifiedAt: '2023-04-21T21:27:07.139Z',
      lastMessageSequenceNumber: 2,
      createdAt: '2023-04-04T20:15:58.434Z',
      lastModifiedAt: '2023-04-21T21:27:07.139Z',
      lastModifiedBy: {
        isPlatformClient: true,
        user: {
          typeId: 'user',
          id: 'b729ba8c-4b28-4b7f-9746-6ba8e79e97dc'
        }
      },
      createdBy: {
        clientId: 'LxrGJIxBJVGYb4O1hlVhqNlc',
        isPlatformClient: false
      },
      key: 'pritty-div',
      name: 'PrittyDiv',
      addresses: [],
      shippingAddressIds: [],
      billingAddressIds: [],
      status: 'Active',
      storeMode: 'FromParent',
      inheritedAssociates: [],
      unitType: 'Division',
      associates: [
        {
          customer: {
            typeId: 'customer',
            id: 'afa14309-0501-450a-ae79-cc2385d5a109',
            obj: {
              id: 'afa14309-0501-450a-ae79-cc2385d5a109',
              version: 1,
              versionModifiedAt: '2023-04-04T20:19:00.344Z',
              lastMessageSequenceNumber: 1,
              createdAt: '2023-04-04T20:19:00.344Z',
              lastModifiedAt: '2023-04-04T20:19:00.344Z',
              lastModifiedBy: {
                clientId: 'LxrGJIxBJVGYb4O1hlVhqNlc',
                isPlatformClient: false
              },
              createdBy: {
                clientId: 'LxrGJIxBJVGYb4O1hlVhqNlc',
                isPlatformClient: false
              },
              email: 'other@mail.com',
              firstName: 'John',
              lastName: 'Other',
              password: '****h9s=',
              addresses: [],
              shippingAddressIds: [],
              billingAddressIds: [],
              isEmailVerified: false,
              stores: [],
              authenticationMode: 'Password'
            }
          },
          roles: ['Admin']
        }
      ],
      parentUnit: { typeId: 'business-unit', key: 'pritty' },
      topLevelUnit: { typeId: 'business-unit', key: 'pritty' }
    }
  ]
};
