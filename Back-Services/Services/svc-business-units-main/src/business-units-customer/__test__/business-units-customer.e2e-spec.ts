const mockCustomerRepository = {
  find: jest.fn(({ queryArgs }: { queryArgs: { where: string[] } }) => {
    if (queryArgs?.where.some(condition => condition.match(`email = "user@mail.com"`))) return Promise.resolve(mockCommercetoolsCustomerResponse);
  })
};

const mockBusinessUnitsRepository = {
  find: jest.fn(({ queryArgs }: { queryArgs: { where: string[] } }) => {
    if (queryArgs?.where.some(condition => condition.match('user-id'))) return Promise.resolve({ results: [mockCompanyBusinessUnit] });
    if (queryArgs?.where.some(condition => condition.match('key="key"'))) return Promise.resolve({ results: [mockDivisionBusinessUnit] });
  })
};

const mockChannelsRepository = {
  find: jest.fn(() => {
    return Promise.resolve({
      results: []
    });
  })
};

const mockCustomObjectsRepository = {
  find: jest.fn(() => {
    return Promise.resolve({
      results: [
        {
          id: 'id',
          container: 'delivery-zone',
          key: 'dz-key',
          value: {
            label: 'Viña del Mar',
            t2Rate: '0.08',
            commune: 'vina-del-mar',
            dcCode: 'LB',
            dcLabel: 'Lo Boza'
          }
        }
      ]
    });
  })
};

import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { CacheModule, INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BusinessUnitsCustomerController } from '../business-units-customer.controller';
import { BusinessUnitsCustomerService } from '../business-units-customer.service';
import { BusinessUnitsRepository } from '@/nest-commercetools/repositories/business-units';
import { CustomersService } from '@/customers/customers.service';
import { BusinessUnitsService } from '@/business-units/business-units.service';
import { ChannelsRepository, CustomObjectsRepository, CustomersRepository } from 'commercetools-sdk-repositories';
import { DeliveryZonesService } from '@/delivery-zones/delivery-zones.service';
import { mockCompanyBusinessUnit, mockDivisionBusinessUnit } from '@/business-units/__mocks__/business-units.mock';
import { mockCommercetoolsCustomerResponse } from '@/business-units-users/__mocks__/business-units-users.mock';
import { SequenceService } from '@/sequence/sequence.service';
import { BusinessUnitsHelper } from '@/common/helpers/business-units/business-units.helper';

describe('Customers', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      controllers: [BusinessUnitsCustomerController],
      providers: [
        BusinessUnitsCustomerService,
        CustomersService,
        BusinessUnitsService,
        DeliveryZonesService,
        SequenceService,
        BusinessUnitsHelper,
        {
          provide: CustomersRepository,
          useValue: mockCustomerRepository
        },
        {
          provide: BusinessUnitsRepository,
          useValue: mockBusinessUnitsRepository
        },
        {
          provide: ChannelsRepository,
          useValue: mockChannelsRepository
        },
        {
          provide: CustomObjectsRepository,
          useValue: mockCustomObjectsRepository
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(key => {
              if (key === 'customerBusinessUnits.customerHeaderKey') {
                return 'x-user-id';
              }

              if (key === 'common.minimumOrderCentAmount') {
                return '5000';
              }

              return key;
            })
          }
        }
      ]
    }).compile();

    app = module.createNestApplication();

    await app.init();
  });

  describe('GET /customers/me/business-units', () => {
    const url = '/customers/me/business-units';
    const xCustomerId = 'user@mail.com';

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return business units by customer id ', () => {
      request(app.getHttpServer())
        .get(url)
        .set('x-user-id', xCustomerId)
        .expect(200)
        .expect({
          businessUnits: [
            {
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
                  customer: { typeId: 'customer', id: 'customerId' },
                  associateRoleAssignments: [{ associateRole: { key: 'admin-role', typeId: 'associate-role' }, inheritance: 'Disabled' }],
                  roles: ['Admin']
                }
              ],
              topLevelUnit: { typeId: 'business-unit', key: 'key' },
              deliveryZoneKey: 'company-city',
              rut: '123456789',
              taxProfile: '1',
              shouldApplyT2Rate: true,
              externalId: 'sap_buid',
              customerGroupCode: 'TRADICIONAL',
              distributionCenter: 'COMPANY_DC',
              t2Rate: '0.12'
            },
            {
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
                  customer: { typeId: 'customer', id: 'anotherCustomerId' },
                  associateRoleAssignments: [{ associateRole: { key: 'buyer-role', typeId: 'associate-role' }, inheritance: 'Disabled' }],
                  roles: ['Buyer']
                }
              ],
              parentUnit: { typeId: 'business-unit', key: 'key' },
              topLevelUnit: { typeId: 'business-unit', key: 'key' },
              rut: 'rut'
            }
          ].map(v => ({
            ...v,
            minimumOrderAmount: {
              type: 'string',
              currencyCode: 'CLP',
              centAmount: 5000,
              fractionDigits: 0
            }
          }))
        });
    });

    it('should throw Customer not found', () => {
      mockCustomerRepository.find.mockReturnValueOnce(Promise.resolve({ results: [] }));
      return request(app.getHttpServer()).get(url).set('x-user-id', xCustomerId).expect(404).expect({ statusCode: 404, message: 'Customer not found', error: 'Not Found' });
    });

    it('should throw Customer ID missing', () => {
      return request(app.getHttpServer()).get(url).set('x-user-id', '').expect(400).expect({ statusCode: 400, message: 'Customer ID missing', error: 'Bad Request' });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
