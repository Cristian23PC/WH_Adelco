const mockBusinessUnitsRepository = {
  getById: jest.fn((id: string) => {
    if (id === 'not-exists') {
      return Promise.resolve(null);
    }
    if (id === 'not-exists') {
      return Promise.resolve(null);
    }
    if (id === 'error') {
      return Promise.reject(new CommercetoolsError(mockCommercetoolsErrorNotFound));
    }
    if (id === 'update-id') {
      return Promise.resolve(mockCompanyBusinessUnitWithAssociatesExpanded);
    }
    if (id === 'failure-id') {
      return Promise.resolve({
        ...mockCompanyBusinessUnit,
        associates: [
          {
            customer: {
              typeId: 'customer',
              id: 'customerId',
              obj: {
                email: 'another@user.com',
                id: '',
                version: 0,
                createdAt: '',
                lastModifiedAt: '',
                addresses: [],
                isEmailVerified: false,
                authenticationMode: ''
              }
            },
            roles: ['Admin']
          }
        ]
      });
    }
    return Promise.resolve(mockCompanyBusinessUnit);
  }),
  updateById: jest.fn((id: string) => {
    if (id === 'error') {
      return Promise.reject(new CommercetoolsError(mockCommercetoolsErrorNotFound));
    }

    return mockCompanyBusinessUnit;
  }),
  create: jest.fn(request => {
    return {
      ...request.body,
      custom: { ...request.body.custom, fields: { ...request.body.custom.fields, deliveryZone: { obj: { value: { dcCode: 'LB' } } } } },
      topLevelUnit: { typeId: 'business-unit', key: 'key' }
    };
  }),
  find: jest.fn(() => {
    return Promise.resolve({ results: [mocktFindBusinessUnit] });
  }),
  getByKey: jest.fn(() => {
    return Promise.resolve(mockCompanyBusinessUnit);
  })
};

const mockCustomObjectsRepository = {
  find: jest.fn(({ queryArgs }: { queryArgs: { where: string[] } }) => {
    if (queryArgs?.where.some(condition => condition.match('key="no-locality"'))) {
      return Promise.resolve({ results: [] });
    }

    if (queryArgs?.where.some(condition => condition.match('container="custom-object-payment-method.paymentMethodContainer"'))) {
      return Promise.resolve({
        results: [
          {
            key: 'bank-transfer'
          },
          {
            key: 'cash'
          }
        ]
      });
    }

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
  }),
  getByContainerAndKey: jest.fn((container, key) => {
    switch (key) {
      case 'error':
        return Promise.reject(
          new CommercetoolsError({
            statusCode: 404,
            message: "The CustomObject with ID '(container,error)' was not found.",
            errors: [
              {
                code: 'InvalidSubject',
                message: "The CustomObject with ID '(container,error)' was not found."
              }
            ]
          })
        );
      default:
        return Promise.resolve(mockSequenceResponse);
    }
  }),
  create: jest.fn(({ body }: { body: CustomObjectDraft }) => {
    switch (body.key) {
      case 'create-error':
        return Promise.reject(
          new CommercetoolsError({
            statusCode: 404,
            message: "The CustomObject with ID '(container,error)' was not found.",
            errors: [
              {
                code: 'InvalidSubject',
                message: "The CustomObject with ID '(container,error)' was not found."
              }
            ]
          })
        );
      default:
        return Promise.resolve(mockNewSequenceResponse);
    }
  })
};

const mockChannelsRepository = {
  find: jest.fn(() => {
    return Promise.resolve({
      results: []
    });
  })
};

const mockCustomersRepository = {
  create: jest.fn(() => {
    return Promise.resolve({ customer: mockCommercetoolsCustomerResponse.results[0] });
  })
};

import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BusinessUnitsRepository } from '@/nest-commercetools/repositories/business-units';
import { BusinessUnitsService } from '@/business-units/business-units.service';
import { ChannelsRepository, CustomObjectsRepository, CustomersRepository } from 'commercetools-sdk-repositories';
import { DeliveryZonesService } from '@/delivery-zones/delivery-zones.service';
import {
  mockBusinessUnitList,
  mockCompanyBusinessUnit,
  mockCompanyBusinessUnitWithAssociatesExpanded,
  mocktFindBusinessUnit,
  requestBusinessUnitMock
} from '../__mocks__/business-units.mock';
import { BusinessUnitsController } from '../business-units.controller';
import { CommercetoolsError } from '@/nest-commercetools/errors';
import { AllExceptionsFilter } from '@/common/filters/exception.filter';
import { CommercetoolsExceptionFilter } from '@/common/filters/commercetools.exception.filter';
import { ApiErrorFilter } from '@/common/filters/api.exception.filter';
import { PaymentsMethodsService } from '@/payments-methods/payment-methods.service';
import { userHeaderId, userHeaderRoles } from '@/common/constants/headers';
import { TrimStringsPipe } from '@/common/transformer/trim-strings.pipe';
import { mockCommercetoolsCustomerResponse, mockCommercetoolsErrorNotFound } from '@/business-units-users/__mocks__/business-units-users.mock';
import { SequenceService } from '@/sequence/sequence.service';
import { mockNewSequenceResponse, mockSequenceResponse } from '@/sequence/__mocks__/sequence.mocks';
import { CustomObjectDraft } from '@commercetools/platform-sdk';
import { CustomersService } from '@/customers/customers.service';
import { BusinessUnitsHelper } from '@/common/helpers/business-units/business-units.helper';

describe('business-unit', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BusinessUnitsController],
      providers: [
        BusinessUnitsService,
        BusinessUnitsService,
        DeliveryZonesService,
        BusinessUnitsHelper,
        PaymentsMethodsService,
        SequenceService,
        CustomersService,
        {
          provide: BusinessUnitsRepository,
          useValue: mockBusinessUnitsRepository
        },
        {
          provide: CustomObjectsRepository,
          useValue: mockCustomObjectsRepository
        },
        {
          provide: ChannelsRepository,
          useValue: mockChannelsRepository
        },
        {
          provide: CustomersRepository,
          useValue: mockCustomersRepository
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(key => {
              if (key === 'businessUnits.userHeaderId') return 'x-user-id';
              return key;
            })
          }
        }
      ]
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new TrimStringsPipe(), new ValidationPipe());
    app.useGlobalFilters(new AllExceptionsFilter());
    app.useGlobalFilters(new CommercetoolsExceptionFilter());
    app.useGlobalFilters(new ApiErrorFilter());

    await app.init();
  });

  afterAll(() => {
    app.close();
  });

  describe('PUT /:id', () => {
    const url = '/business-unit';

    describe('when success', () => {
      const xUserId = 'user@user.com';
      const expected = {
        ...mockCompanyBusinessUnit,
        deliveryZoneKey: 'company-city',
        rut: '123456789',
        taxProfile: '1',
        shouldApplyT2Rate: true,
        externalId: 'sap_buid',
        custom: undefined,
        customerGroupCode: 'TRADICIONAL',
        distributionCenter: 'COMPANY_DC',
        t2Rate: '0.12',
        isCreditEnabled: true,
        isCreditBlocked: true,
        creditLimit: 1000,
        creditExcessTolerance: 500,
        creditTermDays: 30
      };
      delete expected.custom;

      beforeEach(() => {
        jest.clearAllMocks();
      });

      it('should return business units updated by id', () => {
        return request(app.getHttpServer()).put(`${url}/update-id`).set('x-user-id', xUserId).send(requestBusinessUnitMock).expect(200).expect(expected);
      });
    });

    describe('when header is not set', () => {
      const xUserId = '';

      beforeEach(() => {
        jest.clearAllMocks();
      });

      it('should throw User ID missing', () => {
        return request(app.getHttpServer())
          .put(`${url}/update-id`)
          .set('x-user-id', xUserId)
          .send(requestBusinessUnitMock)
          .expect(400)
          .expect({ statusCode: 400, message: 'User ID missing' });
      });
    });

    describe('when customer is not associated to this Business Unit', () => {
      const xUserId = 'user@email.com';

      beforeEach(() => {
        jest.clearAllMocks();
      });

      it('should thrown an error business unit is not associated', () => {
        return request(app.getHttpServer()).put(`${url}/update-id`).set('x-user-id', xUserId).send(requestBusinessUnitMock).expect(400).expect({
          statusCode: 400,
          message: 'Customer not associated to Business Unit or lacks access',
          code: 'BU-005',
          detail: 'Customer is not associated to this Business Unit or lacks permissions to perform the action'
        });
      });
    });

    describe('when has invalid locality', () => {
      const xUserId = 'user@user.com';
      const body = {
        ...requestBusinessUnitMock,
        address: {
          ...requestBusinessUnitMock.address,
          city: 'no-locality'
        }
      };

      beforeEach(() => {
        jest.clearAllMocks();
      });

      it('should thrown an error locality not has valid delivery zone', () => {
        return request(app.getHttpServer()).put(`${url}/update-id`).set('x-user-id', xUserId).send(body).expect(404).expect({ statusCode: 404, message: 'Not Found' });
      });
    });
  });

  describe('GET [/business-unit/:id/active-cart/payment-methods]', () => {
    const url = '/business-unit/1/active-cart/payment-methods';
    const xUserId = 'user';

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return a 400 error code "Bad Request" if not x-user-id is not provided', () => {
      return request(app.getHttpServer()).get(url).expect(400).expect({ statusCode: 400, message: 'User ID missing' });
    });

    it('should return a list of payments methods', () => {
      return request(app.getHttpServer())
        .get(url)
        .set('x-user-id', xUserId)
        .expect(200)
        .expect({ paymentMethods: [{ key: 'bank-transfer' }, { key: 'cash' }] });
    });
  });

  describe('POST [/business-unit/:parentBUId/divisions]', () => {
    beforeEach(() => {
      jest.useFakeTimers().setSystemTime(new Date('2023-07-21'));
    });

    const xUserId = 'username';
    const xUserRoles = JSON.stringify(['CSR']);
    const url = '/business-unit/parentBUId/divisions';

    const createDivisionRequest = {
      tradeName: 'string',
      address: {
        region: 'string',
        commune: 'string',
        city: 'algarrobo',
        streetName: 'string',
        streetNumber: 'string',
        apartment: 'string',
        otherInformation: 'string'
      },
      billingAddress: {
        region: 'string',
        commune: 'string',
        city: 'santiago',
        streetName: 'string',
        streetNumber: 'string',
        apartment: 'string',
        otherInformation: 'string'
      },
      contactInfo: {
        email: 'string',
        firstName: 'string',
        lastName: 'string',
        phone: 'string'
      }
    };

    it('POST [/business-unit/parentBUId/divisions]: Should return a 400 code "Bad Request" when no user role is provided', () => {
      return request(app.getHttpServer()).post(url).set(userHeaderId, xUserId).send(createDivisionRequest).expect(400).expect({ statusCode: 400, message: 'User roles missing' });
    });

    it('POST [/business-unit/parentBUId/divisions]: Should return a 400 code "Bad Request" when no user id is provided', () => {
      return request(app.getHttpServer())
        .post(url)
        .set(userHeaderRoles, xUserRoles)
        .send(createDivisionRequest)
        .expect(400)
        .expect({ statusCode: 400, message: 'Customer ID missing' });
    });

    it('POST [/business-unit/parentBUId/divisions]: Should return a 400 code "Bad Request" when no body is provided', () => {
      return request(app.getHttpServer())
        .post(url)
        .set(userHeaderRoles, xUserRoles)
        .set(userHeaderId, xUserId)
        .send({})
        .expect(400)
        .expect({
          statusCode: 400,
          message: ['address should not be null or undefined', 'address must be an object', 'address must be a non-empty object']
        });
    });

    it('POST [/business-unit/parentBUId/divisions]: Should return a 400 code "Bad Request" when a wrong body is provided', () => {
      return request(app.getHttpServer())
        .post(url)
        .set(userHeaderRoles, xUserRoles)
        .set(userHeaderId, xUserId)
        .send({ address: {} })
        .expect(400)
        .expect({
          statusCode: 400,
          message: [
            'address.region should not be empty',
            'address.region must be a string',
            'address.commune should not be empty',
            'address.commune must be a string',
            'address.city should not be empty',
            'address.city must be a string',
            'address.streetName should not be empty',
            'address.streetName must be a string'
          ]
        });
    });

    it('POST [/business-unit/parentBUId/divisions]: Should return a 400 code "Bad Request" when a wrong body is provided', () => {
      return request(app.getHttpServer())
        .post(url)
        .set(userHeaderRoles, xUserRoles)
        .set(userHeaderId, xUserId)
        .send({ address: {}, contactInfo: {} })
        .expect(400)
        .expect({
          statusCode: 400,
          message: [
            'address.region should not be empty',
            'address.region must be a string',
            'address.commune should not be empty',
            'address.commune must be a string',
            'address.city should not be empty',
            'address.city must be a string',
            'address.streetName should not be empty',
            'address.streetName must be a string',
            'contactInfo.email must be a string',
            'contactInfo.email should not be empty'
          ]
        });
    });

    it('POST [/business-unit/parentBUId/divisions]: Should return a 400 code "Bad Request" when delivery zone does not exists', () => {
      return request(app.getHttpServer())
        .post(url)
        .set(userHeaderRoles, xUserRoles)
        .set(userHeaderId, xUserId)
        .send({ ...createDivisionRequest, address: { ...createDivisionRequest.address, city: 'no-locality' } })
        .expect(400)
        .expect({
          statusCode: 400,
          message: 'Delivery zone no associated',
          code: 'BU-014',
          detail: 'There is no delivery zone associated with the provided address.'
        });
    });

    it('POST [/business-unit/parentBUId/divisions]: Should return a 400 code "Bad Request" when delivery zone does not exists', () => {
      return request(app.getHttpServer())
        .post(url)
        .set(userHeaderRoles, JSON.stringify(['other-role']))
        .set(userHeaderId, xUserId)
        .send(createDivisionRequest)
        .expect(400)
        .expect({
          statusCode: 400,
          message: 'Customer not associated to Business Unit or lacks access',
          code: 'BU-005',
          detail: 'Customer is not associated to this Business Unit or lacks permissions to perform the action'
        });
    });

    it('POST [/business-unit/not-exists/divisions]: Should return a 404 code "Not Found" when BU does not exists', () => {
      return request(app.getHttpServer())
        .post(`/business-unit/not-exists/divisions`)
        .set(userHeaderRoles, xUserRoles)
        .set(userHeaderId, xUserId)
        .send(createDivisionRequest)
        .expect(404)
        .expect({
          statusCode: 404,
          message: 'Business Unit does not exist',
          code: 'BU-013',
          detail: 'Business Unit does not exist for the id provided'
        });
    });

    it('POST [/business-unit/parentBUId/divisions]: Should return a created Division', () => {
      return request(app.getHttpServer())
        .post(url)
        .set(userHeaderRoles, xUserRoles)
        .set(userHeaderId, xUserId)
        .send(createDivisionRequest)
        .expect(201)
        .expect({
          unitType: 'Division',
          parentUnit: { typeId: 'business-unit', id: 'id' },
          topLevelUnit: { typeId: 'business-unit', key: 'key' },
          addresses: [
            {
              region: 'string',
              city: 'Viña del Mar',
              streetName: 'string',
              streetNumber: 'string',
              apartment: 'string',
              country: 'CL',
              department: 'string',
              additionalAddressInfo: 'string',
              email: 'string',
              firstName: 'string',
              lastName: 'string',
              phone: 'string'
            },
            {
              region: 'string',
              city: 'santiago',
              streetName: 'string',
              streetNumber: 'string',
              apartment: 'string',
              country: 'CL',
              department: 'string',
              additionalAddressInfo: 'string'
            }
          ],
          name: 'Division 123456789',
          key: '600001',
          status: 'Active',
          associates: [
            {
              associateRoleAssignments: [{ associateRole: { key: 'admin-role', typeId: 'associate-role' }, inheritance: 'Enabled' }],
              customer: { id: 'user-id', typeId: 'customer' }
            }
          ],
          defaultBillingAddress: 1,
          defaultShippingAddress: 0,
          rut: '123456789',
          taxProfile: '1',
          shouldApplyT2Rate: true,
          customerGroupCode: 'TRADICIONAL',
          distributionCenter: 'LB',
          tradeName: 'string',
          creditLimit: 1000,
          creditTermDays: 30,
          isCreditBlocked: true,
          isCreditEnabled: true,
          creditExcessTolerance: 500
        });
    });

    it('POST [/business-unit/parentBUId/divisions]: Should return a created Division with some values', () => {
      return request(app.getHttpServer())
        .post(url)
        .set(userHeaderRoles, xUserRoles)
        .set(userHeaderId, xUserId)
        .send({ ...createDivisionRequest, billingAddress: undefined, tradeName: undefined })
        .expect(201)
        .expect({
          unitType: 'Division',
          parentUnit: { typeId: 'business-unit', id: 'id' },
          topLevelUnit: { typeId: 'business-unit', key: 'key' },
          addresses: [
            {
              region: 'string',
              city: 'Viña del Mar',
              streetName: 'string',
              streetNumber: 'string',
              apartment: 'string',
              country: 'CL',
              department: 'string',
              additionalAddressInfo: 'string',
              email: 'string',
              firstName: 'string',
              lastName: 'string',
              phone: 'string'
            }
          ],
          name: 'Division 123456789',
          key: '600001',
          status: 'Active',
          associates: [
            {
              associateRoleAssignments: [{ associateRole: { key: 'admin-role', typeId: 'associate-role' }, inheritance: 'Enabled' }],
              customer: { id: 'user-id', typeId: 'customer' }
            }
          ],
          defaultBillingAddress: 0,
          defaultShippingAddress: 0,
          rut: '123456789',
          taxProfile: '1',
          shouldApplyT2Rate: true,
          customerGroupCode: 'TRADICIONAL',
          distributionCenter: 'LB',
          creditLimit: 1000,
          creditTermDays: 30,
          isCreditBlocked: true,
          isCreditEnabled: true,
          creditExcessTolerance: 500
        });
    });

    it('POST [/business-unit/parentBUId/divisions]: Should return a created Division with necessary data', () => {
      return request(app.getHttpServer())
        .post(url)
        .set(userHeaderRoles, xUserRoles)
        .set(userHeaderId, xUserId)
        .send({
          address: { commune: 'string', streetName: 'name', city: 'locality', region: 'string' },
          contactInfo: createDivisionRequest.contactInfo,
          billingAddress: undefined,
          tradeName: undefined
        })
        .expect(201)
        .expect({
          unitType: 'Division',
          parentUnit: { typeId: 'business-unit', id: 'id' },
          topLevelUnit: { typeId: 'business-unit', key: 'key' },
          addresses: [
            {
              streetName: 'name',
              city: 'Viña del Mar',
              region: 'string',
              country: 'CL',
              department: 'string',
              email: 'string',
              firstName: 'string',
              lastName: 'string',
              phone: 'string'
            }
          ],
          name: 'Division 123456789',
          key: '600001',
          status: 'Active',
          associates: [
            {
              associateRoleAssignments: [{ associateRole: { key: 'admin-role', typeId: 'associate-role' }, inheritance: 'Enabled' }],
              customer: { id: 'user-id', typeId: 'customer' }
            }
          ],
          defaultBillingAddress: 0,
          defaultShippingAddress: 0,
          rut: '123456789',
          taxProfile: '1',
          shouldApplyT2Rate: true,
          customerGroupCode: 'TRADICIONAL',
          distributionCenter: 'LB',
          creditLimit: 1000,
          creditTermDays: 30,
          isCreditBlocked: true,
          isCreditEnabled: true,
          creditExcessTolerance: 500
        });
    });
  });

  describe('GET [/business-unit]', () => {
    const url = '/business-unit';

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return a 400 error code "Bad Request" if sortField is wrong value', () => {
      return request(app.getHttpServer())
        .get(`${url}?sortField=fff`)
        .expect(400)
        .expect({ statusCode: 400, message: ['sortField must be one of the following values: name, rut'] });
    });

    it('should return a 400 error code "Bad Request" if sort is wrong value', () => {
      return request(app.getHttpServer())
        .get(`${url}?sort=fff`)
        .expect(400)
        .expect({ statusCode: 400, message: ['sort must be one of the following values: desc, asc'] });
    });

    it('should return business unit list', () => {
      return request(app.getHttpServer()).get(url).expect(200).expect(mockBusinessUnitList);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
