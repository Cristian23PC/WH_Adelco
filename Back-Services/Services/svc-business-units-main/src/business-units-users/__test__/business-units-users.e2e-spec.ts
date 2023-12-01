global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve()
  })
) as jest.Mock;

const mockSecretManagerService = {
  get: jest.fn().mockImplementation(() => 'clientSecret')
};

jest.mock('@/secret-manager', () => ({
  SecretManagerService: jest.fn().mockImplementation(() => mockSecretManagerService)
}));

const mockNotificationsService = {
  sendNotification: jest.fn().mockImplementation(() => Promise.resolve())
};

jest.mock('@/notifications', () => ({
  NotificationsService: jest.fn().mockImplementation(() => mockNotificationsService)
}));

const mockCustomerRepository = {
  find: jest.fn(({ queryArgs }: { queryArgs: { where: string[] } }) => {
    if (queryArgs?.where.some(condition => condition.match(`lowercaseEmail = "user@mail.com"`))) return Promise.resolve(mockCommercetoolsCustomerResponse);
    if (queryArgs?.where.some(condition => condition.match(`lowercaseEmail = "userme@mail.com"`))) return Promise.resolve(mockCommercetoolsCustomerResponse);
    if (queryArgs?.where.some(condition => condition.match(`lowercaseEmail = "username@mail.com"`)))
      return Promise.resolve({
        results: [
          {
            id: 'username-id'
          }
        ]
      });

    return Promise.resolve({
      results: [{ id: 'username-id' }]
    });
  }),
  create: jest.fn(() => {
    return Promise.resolve(mockCustomerSignInResult);
  })
};

const mockBusinessUnitsRepository = {
  find: jest.fn(({ queryArgs }: { queryArgs: { where: string[] } }) => {
    if (queryArgs?.where.some(condition => condition.match('user-id')))
      return Promise.resolve({
        results: [
          {
            ...mockCompanyBusinessUnit,
            custom: {
              type: {
                typeId: 'type',
                id: 'id'
              },
              fields: {
                rut: '123456'
              }
            }
          }
        ]
      });
    if (queryArgs?.where.some(condition => condition.match('username-id')))
      return Promise.resolve({
        results: []
      });
    if (queryArgs?.where.some(condition => condition.match('key="key"'))) return Promise.resolve({ results: [mockDivisionBusinessUnit] });
    if (
      queryArgs?.where.some(
        condition =>
          condition.match('rut="123"') ||
          condition.match('rut="123456789"') ||
          condition.match('rut="1234567"') ||
          condition.match('rut="123455"') ||
          condition.match('rut="12-3"') ||
          condition.match('rut="12345678-9"')
      )
    )
      return Promise.resolve({ results: [] });
    if (queryArgs?.where.some(condition => condition.match('rut="321"') || condition.match('rut="32-1"'))) return Promise.resolve({ results: [mockDivisionBusinessUnit] });
    if (queryArgs?.where[0] === 'custom(fields(rut=123456789))') {
      return Promise.resolve({ results: [mockCompanyBusinessUnit] });
    }
  }),
  create: jest.fn(() => {
    return Promise.resolve(mockBusinessUnitCreated);
  }),
  getByKey: jest.fn(() => {
    return Promise.resolve(mockBusinessUnitCreated);
  }),
  deleteById: jest.fn(() => Promise.resolve()),
  updateById: jest.fn(() => {
    return Promise.resolve();
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
  }),
  getByContainerAndKey: jest.fn(() => {
    return Promise.resolve(mockSequenceResponse);
  }),
  create: jest.fn(() => {
    return Promise.resolve(mockNewSequenceResponse);
  })
};

const mockConfigService = {
  get: (key: string) => {
    const response = {
      clientId: 'clientId',
      clientSecret: 'clientSecretKey',
      host: 'host',
      realm: 'realm'
    };
    if (key === 'keycloak') {
      return response;
    }
    if (key === 'keycloak.clientId') {
      return response.clientId;
    }
    if (key === 'keycloak.clientSecret') {
      return response.clientSecret;
    }
    if (key === 'keycloak.host') {
      return response.host;
    }
    if (key === 'keycloak.realm') {
      return response.realm;
    }
    if (key === 'business-unit-users.codeExpirationTime') {
      return 3600;
    }
    if (key === 'rut.verificationServiceUrl') {
      return 'host/rut/validation';
    }
    if (key === 'business-unit-users.userHeaderRoles') {
      return userHeaderRoles;
    }
    if (key === 'business-unit-users.userHeaderId') {
      return userHeaderId;
    }
    if (key === 'business-unit-users.validUsernameList') {
      return '^.*$';
    }
    if (key === 'common.minimumOrderCentAmount') {
      return '5000';
    }

    return key;
  }
};

import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { BusinessUnitsUsersController } from '../business-units-users.controller';
import { BusinessUnitsUsersService } from '../business-units-users.service';
import { RutService } from '@/rut/rut.service';
import { KeycloakService } from '@/keycloak/keycloak.service';
import { BusinessUnitsService } from '@/business-units/business-units.service';
import { ConfigService } from '@nestjs/config';
import { CustomersService } from '@/customers/customers.service';
import { BusinessUnitsRepository } from '@/nest-commercetools/repositories/business-units';
import { ChannelsRepository, CustomObjectsRepository, CustomersRepository } from 'commercetools-sdk-repositories';
import { keycloakTokenMock, keycloakUserMock } from '@/keycloak/__mocks__/keycloak.mock';
import { AllExceptionsFilter } from '@/common/filters/exception.filter';
import { CommercetoolsExceptionFilter } from '@/common/filters/commercetools.exception.filter';
import { ApiErrorFilter } from '@/common/filters/api.exception.filter';
import { DeliveryZonesService } from '@/delivery-zones/delivery-zones.service';
import { mockCustomerSignInResult } from '@/customers/__mocks__/customers.mock';
import { mockBusinessUnitCreated } from '@/business-units/__mocks__/business-units.mock';
import { SecretManagerService } from '@/secret-manager';
import { userHeaderId, userHeaderRoles } from '@/common/constants/headers';
import { NotificationsService } from '@/notifications';
import { mockCommercetoolsCustomerResponse, mockCompanyBusinessUnit, mockDivisionBusinessUnit } from '../__mocks__/business-units-users.mock';
import { SequenceService } from '@/sequence/sequence.service';
import { mockNewSequenceResponse, mockSequenceResponse } from '@/sequence/__mocks__/sequence.mocks';
import { BusinessUnitsHelper } from '@/common/helpers/business-units/business-units.helper';

describe('BusinessUnit-ms Users', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BusinessUnitsUsersController],
      providers: [
        BusinessUnitsUsersService,
        RutService,
        KeycloakService,
        BusinessUnitsHelper,
        BusinessUnitsService,
        CustomersService,
        DeliveryZonesService,
        SecretManagerService,
        NotificationsService,
        SequenceService,
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
          useValue: mockConfigService
        }
      ]
    }).compile();

    app = module.createNestApplication();
    app.useGlobalFilters(new AllExceptionsFilter()).useGlobalFilters(new CommercetoolsExceptionFilter()).useGlobalFilters(new ApiErrorFilter());

    await app.init();
  });

  afterAll(() => {
    app.close();
  });

  describe('GET /users/me/business-units', () => {
    const url = '/users/me/business-units';
    const xUserId = 'userme@mail.com';

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return business units by customer id ', () => {
      return request(app.getHttpServer())
        .get(url)
        .set('x-user-id', xUserId)
        .expect(200)
        .expect({
          businessUnits: [
            {
              ...mockCompanyBusinessUnit,
              rut: '123456'
            },
            mockDivisionBusinessUnit
          ]
        });
    });

    it('should throw Customer not found', () => {
      mockCustomerRepository.find.mockReturnValueOnce(Promise.resolve({ results: [] }));
      return request(app.getHttpServer()).get(url).set('x-user-id', xUserId).expect(404).expect({ statusCode: 404, message: 'Customer not found' });
    });

    it('should throw User ID missing', () => {
      return request(app.getHttpServer()).get(url).set('x-user-id', '').expect(400).expect({ statusCode: 400, message: 'User ID missing' });
    });
  });

  describe('POST /users/pre-registration', () => {
    const url = '/users/pre-registration';

    beforeEach(() => {
      jest.clearAllMocks();
    });

    describe('when success', () => {
      beforeEach(() => {
        const assetsFetchMock = (url: string) => {
          if (url === 'host/realms/realm/protocol/openid-connect/token') {
            return Promise.resolve({
              ok: true,
              status: 200,
              json: async () => keycloakTokenMock
            } as Response);
          }
          if (url === 'host/admin/realms/realm/users') {
            return Promise.resolve({
              ok: true,
              status: 201,
              json: async () => {}
            } as Response);
          }

          if (url === 'host/rut/validation/123') {
            return Promise.resolve({
              ok: true,
              status: 200,
              json: async () => ({ statusCode: 200, payload: { businessName: 'BU 123' } })
            } as Response);
          }

          return Promise.resolve({
            ok: true,
            status: 200,
            json: async () => []
          } as Response);
        };
        jest.spyOn(global, 'fetch').mockImplementation(assetsFetchMock);
      });

      it('should return success user creation in keycloak', () => {
        const body = { username: 'username@username.com', rut: '123' };
        const status = 201;
        return request(app.getHttpServer())
          .post(url)
          .send(body)
          .expect(status)
          .expect({
            status: status,
            message: `Username "${body.username}" successfully created.`
          });
      });
    });

    describe('when RUT is invalid', () => {
      beforeEach(() => {
        const assetsFetchMock = () => {
          return Promise.resolve({
            ok: true,
            status: 422,
            json: async () => ({ statusCode: 422, message: 'Invalid Rut' })
          } as Response);
        };

        jest.spyOn(global, 'fetch').mockImplementation(assetsFetchMock);
      });
      it('should throw 400 with invalid', async () => {
        const body = { username: 'username@username.com' };
        const status = 400;
        return await request(app.getHttpServer())
          .post(url)
          .send(body)
          .expect(status)
          .expect({ statusCode: 400, message: 'Invalid RUT', code: 'BU-001', detail: 'RUT is not valid or does not exist.' });
      });
    });

    describe('when keycloak user already registered', () => {
      beforeEach(() => {
        const assetsFetchMock = (url: string) => {
          if (url === 'host/realms/realm/protocol/openid-connect/token') {
            return Promise.resolve({
              ok: true,
              status: 200,
              json: async () => keycloakTokenMock
            } as Response);
          }
          if (url === `host/admin/realms/realm/users?username=${encodeURIComponent('username@username.com')}`) {
            return Promise.resolve({
              ok: true,
              status: 200,
              json: async () => [keycloakUserMock]
            } as Response);
          }
          if (url === 'host/rut/validation/123') {
            return Promise.resolve({
              ok: true,
              status: 200,
              json: async () => ({ statusCode: 200, payload: { businessName: 'BU 123' } })
            } as Response);
          }
        };
        jest.spyOn(global, 'fetch').mockImplementation(assetsFetchMock);
      });

      it('should throw 400 with keycloak user already registered', async () => {
        const body = { username: 'username@username.com', rut: '123' };
        const status = 400;
        return await request(app.getHttpServer())
          .post(url)
          .send(body)
          .expect(status)
          .expect({ statusCode: 400, message: 'Keycloak user already registered.', code: 'BU-002', detail: 'User already registered. Please recover your password.' });
      });
    });

    describe('when username already registered', () => {
      beforeEach(() => {
        const assetsFetchMock = (url: string) => {
          if (url === 'host/realms/realm/protocol/openid-connect/token') {
            return Promise.resolve({
              ok: true,
              status: 200,
              json: async () => keycloakTokenMock
            } as Response);
          }
          if (url === `host/admin/realms/realm/users?username=${encodeURIComponent('user@mail.com')}`) {
            return Promise.resolve({
              ok: true,
              status: 200,
              json: async () => []
            } as Response);
          }

          if (url === 'host/rut/validation/123') {
            return Promise.resolve({
              ok: true,
              status: 200,
              json: async () => ({ statusCode: 200, payload: { businessName: 'BU 123' } })
            } as Response);
          }
        };
        jest.spyOn(global, 'fetch').mockImplementation(assetsFetchMock);
      });

      it('should throw 409 with username is already registered', async () => {
        const body = { username: 'user@mail.com', rut: '123' };
        const status = 409;
        return await request(app.getHttpServer()).post(url).send(body).expect(status).expect({
          statusCode: 409,
          message: 'User is already associated with another Company.',
          code: 'BU-003',
          detail: 'User is already associated with another Company.'
        });
      });
    });

    describe('when RUT already registered', () => {
      beforeEach(() => {
        const assetsFetchMock = (url: string) => {
          if (url === 'host/realms/realm/protocol/openid-connect/token') {
            return Promise.resolve({
              ok: true,
              status: 200,
              json: async () => keycloakTokenMock
            } as Response);
          }
          if (url === `host/admin/realms/realm/users?username=${encodeURIComponent('username@mail.com')}`) {
            return Promise.resolve({
              ok: true,
              status: 200,
              json: async () => []
            } as Response);
          }
          if (url === 'host/rut/validation/321') {
            return Promise.resolve({
              ok: true,
              status: 200,
              json: async () => ({ statusCode: 200, payload: { businessName: 'BU 321' } })
            } as Response);
          }
        };
        jest.spyOn(global, 'fetch').mockImplementation(assetsFetchMock);
      });

      it('should throw 400 with RUT is already registered', async () => {
        const body = { username: 'username@mail.com', rut: '321' };
        const status = 400;
        return await request(app.getHttpServer()).post(url).send(body).expect(status).expect({
          statusCode: 400,
          message: 'RUT is already registered.',
          code: 'BU-004',
          detail: 'RUT is already registerered. Please choose another email.'
        });
      });
    });

    describe('when RUT external validation service fails', () => {
      beforeEach(() => {
        const assetsFetchMock = () => {
          return Promise.resolve({
            ok: true,
            status: 400,
            json: async () => ({ statusCode: 400, message: 'Sorry external floid services present problems. I try later' })
          } as Response);
        };

        jest.spyOn(global, 'fetch').mockImplementation(assetsFetchMock);
      });
      it('should throw 503 with external service error', async () => {
        const body = { username: 'username@username.com' };
        const status = 503;
        return await request(app.getHttpServer()).post(url).send(body).expect(status).expect({
          statusCode: status,
          message: 'External Rut Verification Service Error',
          code: 'BU-006',
          detail: 'External rut verification service is experiencing problems. Please try later'
        });
      });
    });

    describe('when RUT doesn`t have associated BU', () => {
      beforeEach(() => {
        const assetsFetchMock = () => {
          return Promise.resolve({
            ok: true,
            status: 200,
            json: async () => ({ statusCode: 200, payload: null })
          } as Response);
        };

        jest.spyOn(global, 'fetch').mockImplementation(assetsFetchMock);
      });
      it('should throw 400 with no associated bu error', async () => {
        const body = { username: 'username@username.com' };
        const status = 400;
        return await request(app.getHttpServer())
          .post(url)
          .send(body)
          .expect(status)
          .expect({ statusCode: status, message: 'No Associated Business Unit', code: 'BU-007', detail: 'Valid Rut but no associated business unit' });
      });
    });

    describe('when unsername is not valid', () => {
      let matchSpy: jest.SpyInstance;
      beforeEach(() => {
        const assetsFetchMock = (url: string) => {
          if (url === 'host/realms/realm/protocol/openid-connect/token') {
            return Promise.resolve({
              ok: true,
              status: 200,
              json: async () => keycloakTokenMock
            } as Response);
          }
          if (url === 'host/admin/realms/realm/users') {
            return Promise.resolve({
              ok: true,
              status: 201,
              json: async () => {}
            } as Response);
          }

          if (url === 'host/rut/validation/123') {
            return Promise.resolve({
              ok: true,
              status: 200,
              json: async () => ({ statusCode: 200, payload: { businessName: 'BU 123' } })
            } as Response);
          }

          return Promise.resolve({
            ok: true,
            status: 200,
            json: async () => []
          } as Response);
        };
        jest.spyOn(global, 'fetch').mockImplementation(assetsFetchMock);
        matchSpy = jest.spyOn(String.prototype, 'match');

        matchSpy.mockReturnValue(null);
      });

      afterEach(() => {
        matchSpy.mockRestore();
      });

      it('should throw 400 with username not valid error', async () => {
        const body = { username: 'username@username.com' };
        const status = 400;
        return await request(app.getHttpServer())
          .post(url)
          .send(body)
          .expect(status)
          .expect({ statusCode: status, message: 'Invalid username', code: 'BU-010', detail: 'The username or email not allowed' });
      });
    });
  });

  describe('POST /users/registration', () => {
    const url = '/users/registration';

    beforeEach(() => {
      jest.clearAllMocks();
    });

    describe('when success', () => {
      beforeEach(() => {
        const assetsFetchMock = (url: string) => {
          if (url === 'host/realms/realm/protocol/openid-connect/token') {
            return Promise.resolve({
              ok: true,
              status: 200,
              json: async () => keycloakTokenMock
            } as Response);
          }
          if (url === `host/admin/realms/realm/users?username=${encodeURIComponent('username@username.com')}`) {
            return Promise.resolve({
              ok: true,
              status: 200,
              json: async () => [keycloakUserMock]
            } as Response);
          }
          if (url === `host/admin/realms/realm/users/id`) {
            return Promise.resolve({
              ok: true,
              status: 200,
              json: async () => [{ ...keycloakUserMock, emailVerified: true }]
            } as Response);
          }
          if (url === `host/admin/realms/realm/users/id/reset-password`) {
            return Promise.resolve({
              ok: true,
              status: 200,
              json: async () => [{ ...keycloakUserMock, emailVerified: true }]
            } as Response);
          }
        };
        jest.spyOn(global, 'fetch').mockImplementation(assetsFetchMock);
      });

      it('should return success business unit creation in CT', () => {
        const body = { username: 'username@username.com', password: 'password', code: 1234 };
        const status = 201;
        return request(app.getHttpServer())
          .post(url)
          .send(body)
          .expect(status)
          .expect({
            id: 'business-unit-id',
            version: 1,
            createdAt: '',
            lastModifiedAt: '',
            storeMode: 'store',
            addresses: [],
            unitType: 'Company',
            name: 'Company 123456789',
            key: '60001',
            status: 'Inactive',
            associateMode: 'Explicit',
            associates: [
              {
                roles: ['Admin'],
                associateRoleAssignments: [{ associateRole: { key: 'admin-role', typeId: 'associate-role' }, inheritance: 'Disabled' }],
                customer: { typeId: 'customer', id: '88b72a5c-b238-4dea-9196-74ce3b8b04e9' }
              }
            ],
            rut: '123456789'
          });
      });
    });

    describe('when user does not exist', () => {
      beforeEach(() => {
        const assetsFetchMock = (url: string) => {
          if (url === 'host/realms/realm/protocol/openid-connect/token') {
            return Promise.resolve({
              ok: true,
              status: 200,
              json: async () => keycloakTokenMock
            } as Response);
          }
          if (url === `host/admin/realms/realm/users?username=${encodeURIComponent('username@username.com')}`) {
            return Promise.resolve({
              ok: true,
              status: 200,
              json: async () => []
            } as Response);
          }
        };
        jest.spyOn(global, 'fetch').mockImplementation(assetsFetchMock);
      });

      it('should thrown 404 not found', () => {
        const body = { username: 'username@username.com', password: 'password', code: 1234 };
        const status = 404;
        return request(app.getHttpServer()).post(url).send(body).expect(status).expect({ statusCode: 404, message: 'User does not exist' });
      });
    });

    describe('when keycloak user has emailVerified is true', () => {
      beforeEach(() => {
        const assetsFetchMock = (url: string) => {
          if (url === 'host/realms/realm/protocol/openid-connect/token') {
            return Promise.resolve({
              ok: true,
              status: 200,
              json: async () => keycloakTokenMock
            } as Response);
          }
          if (url === `host/admin/realms/realm/users?username=${encodeURIComponent('username@username.com')}`) {
            return Promise.resolve({
              ok: true,
              status: 200,
              json: async () => [{ ...keycloakUserMock, emailVerified: true }]
            } as Response);
          }
        };
        jest.spyOn(global, 'fetch').mockImplementation(assetsFetchMock);
      });

      it('should thrown 400 with keycloak user already registered', () => {
        const body = { username: 'username@username.com', password: 'password', code: 1234 };
        const status = 400;
        return request(app.getHttpServer())
          .post(url)
          .send(body)
          .expect(status)
          .expect({ statusCode: 400, message: 'Keycloak user already registered.', code: 'BU-002', detail: 'User already registered. Please recover your password.' });
      });
    });

    describe('when keycloak user not has verificationCodeData', () => {
      beforeEach(() => {
        const assetsFetchMock = (url: string) => {
          if (url === 'host/realms/realm/protocol/openid-connect/token') {
            return Promise.resolve({
              ok: true,
              status: 200,
              json: async () => keycloakTokenMock
            } as Response);
          }
          if (url === `host/admin/realms/realm/users?username=${encodeURIComponent('username@username.com')}`) {
            return Promise.resolve({
              ok: true,
              status: 200,
              json: async () => [
                {
                  ...keycloakUserMock,
                  attributes: {
                    verificationCodeData: [],
                    companyRut: ['123456789']
                  }
                }
              ]
            } as Response);
          }
        };
        jest.spyOn(global, 'fetch').mockImplementation(assetsFetchMock);
      });

      it('should throw Invalid Code error', () => {
        const body = { username: 'username@username.com', password: 'password', code: 1234 };
        const status = 400;
        return request(app.getHttpServer())
          .post(url)
          .send(body)
          .expect(status)
          .expect({ statusCode: 400, message: 'Invalid Verification Code', code: 'BU-009', detail: 'The Verification Code is expired or blocked.' });
      });
    });

    describe('when keycloak user has invalidCode', () => {
      beforeEach(() => {
        const assetsFetchMock = (url: string) => {
          if (url === 'host/realms/realm/protocol/openid-connect/token') {
            return Promise.resolve({
              ok: true,
              status: 200,
              json: async () => keycloakTokenMock
            } as Response);
          }
          if (url === `host/admin/realms/realm/users?username=${encodeURIComponent('username@username.com')}`) {
            return Promise.resolve({
              ok: true,
              status: 200,
              json: async () => [keycloakUserMock]
            } as Response);
          }

          if (url === `host/admin/realms/realm/users/id`) {
            return Promise.resolve({
              ok: true,
              status: 200,
              json: async () => [{ ...keycloakUserMock, emailVerified: true }]
            } as Response);
          }
        };
        jest.spyOn(global, 'fetch').mockImplementation(assetsFetchMock);
      });

      it('should thrown 400 with Wrong code verification attempt', () => {
        const body = { username: 'username@username.com', password: 'password', code: 12349 };
        const status = 400;
        return request(app.getHttpServer())
          .post(url)
          .send(body)
          .expect(status)
          .expect({ statusCode: 400, message: 'Wrong code verification attempt', code: 'BU-011', detail: 'The Verification Code is invalid', data: { remainingAttempts: 2 } });
      });
    });

    describe('when keycloak reset-password fail', () => {
      beforeEach(() => {
        const assetsFetchMock = (url: string) => {
          if (url === 'host/realms/realm/protocol/openid-connect/token') {
            return Promise.resolve({
              ok: true,
              status: 200,
              json: async () => keycloakTokenMock
            } as Response);
          }
          if (url === `host/admin/realms/realm/users?username=${encodeURIComponent('username@username.com')}`) {
            return Promise.resolve({
              ok: true,
              status: 200,
              json: async () => [{ ...keycloakUserMock, id: 'invalid-password' }]
            } as Response);
          }
          if (url === `host/admin/realms/realm/users?username=${encodeURIComponent('error@username.com')}`) {
            return Promise.resolve({
              ok: true,
              status: 200,
              json: async () => [{ ...keycloakUserMock, id: 'error' }]
            } as Response);
          }
          if (url === `host/admin/realms/realm/users/id` || url === `host/admin/realms/realm/users/invalid-password`) {
            return Promise.resolve({
              ok: true,
              status: 200,
              json: async () => [{ ...keycloakUserMock, emailVerified: true }]
            } as Response);
          }
          if (url === `host/admin/realms/realm/users/invalid-password/reset-password` || url === `host/admin/realms/realm/users/error`) {
            return Promise.resolve({
              ok: false,
              status: 400,
              json: async () => {}
            } as Response);
          }
        };
        jest.spyOn(global, 'fetch').mockImplementation(assetsFetchMock);
      });

      it('should throw a HttpException', () => {
        const body = { username: 'error@username.com', password: 'password', code: 1234 };
        const status = 400;
        return request(app.getHttpServer()).post(url).send(body).expect(status).expect({ statusCode: 400, message: 'Http Exception' });
      });
    });

    describe('when username already registered', () => {
      beforeEach(() => {
        const assetsFetchMock = (url: string) => {
          if (url === 'host/realms/realm/protocol/openid-connect/token') {
            return Promise.resolve({
              ok: true,
              status: 200,
              json: async () => keycloakTokenMock
            } as Response);
          }
          if (url === `host/admin/realms/realm/users?username=${encodeURIComponent('user@mail.com')}`) {
            return Promise.resolve({
              ok: true,
              status: 200,
              json: async () => [keycloakUserMock]
            } as Response);
          }
          if (url === `host/admin/realms/realm/users/id`) {
            return Promise.resolve({
              ok: true,
              status: 200,
              json: async () => [{ ...keycloakUserMock, emailVerified: true }]
            } as Response);
          }
          if (url === `host/admin/realms/realm/users/id/reset-password`) {
            return Promise.resolve({
              ok: true,
              status: 200,
              json: async () => [{ ...keycloakUserMock, emailVerified: true }]
            } as Response);
          }
        };
        jest.spyOn(global, 'fetch').mockImplementation(assetsFetchMock);
      });

      it('should throw 409 with username is already registered', () => {
        const body = { username: 'user@mail.com', password: 'password', code: 1234 };
        const status = 409;
        return request(app.getHttpServer()).post(url).send(body).expect(status).expect({
          statusCode: 409,
          message: 'User is already associated with another Company.',
          code: 'BU-003',
          detail: 'User is already associated with another Company.'
        });
      });
    });

    describe('when RUT already registered', () => {
      beforeEach(() => {
        const assetsFetchMock = (url: string) => {
          if (url === 'host/realms/realm/protocol/openid-connect/token') {
            return Promise.resolve({
              ok: true,
              status: 200,
              json: async () => keycloakTokenMock
            } as Response);
          }
          if (url === `host/admin/realms/realm/users?username=${encodeURIComponent('username@username.com')}`) {
            return Promise.resolve({
              ok: true,
              status: 200,
              json: async () => [
                {
                  ...keycloakUserMock,
                  attributes: {
                    ...keycloakUserMock.attributes,
                    companyRut: ['321']
                  }
                }
              ]
            } as Response);
          }
          if (url === `host/admin/realms/realm/users/id`) {
            return Promise.resolve({
              ok: true,
              status: 200,
              json: async () => [{ ...keycloakUserMock, emailVerified: true }]
            } as Response);
          }
          if (url === `host/admin/realms/realm/users/id/reset-password`) {
            return Promise.resolve({
              ok: true,
              status: 200,
              json: async () => [{ ...keycloakUserMock, emailVerified: true }]
            } as Response);
          }
        };
        jest.spyOn(global, 'fetch').mockImplementation(assetsFetchMock);
      });

      it('should throw 400 with RUT is already registered', () => {
        const body = { username: 'username@username.com', password: 'password', code: 1234 };
        const status = 400;
        return request(app.getHttpServer()).post(url).send(body).expect(status).expect({
          statusCode: 400,
          message: 'RUT is already registered.',
          code: 'BU-004',
          detail: 'RUT is already registerered. Please choose another email.'
        });
      });
    });
  });

  describe('POST /users/rep-registration', () => {
    const url = '/users/rep-registration';
    const xUserRoles = ['__INTERNAL__'];
    beforeEach(() => {
      jest.clearAllMocks();
    });

    beforeEach(() => {
      const assetsFetchMock = (url: string) => {
        if (url === 'host/rut/validation/123456789') {
          return Promise.resolve({
            ok: true,
            status: 200,
            json: async () => ({
              statusCode: 422,
              message: 'Error'
            })
          } as Response);
        }
        if (url === 'host/rut/validation/1234567') {
          return Promise.resolve({
            ok: true,
            status: 200,
            json: async () => ({
              statusCode: 200,
              payload: null
            })
          } as Response);
        }
        if (url === 'host/rut/validation/123455') {
          return Promise.resolve({
            ok: true,
            status: 200,
            json: async () => ({
              statusCode: 200
            })
          } as Response);
        }

        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => ({
            statusCode: 200,
            payload: {
              businessName: 'company-name'
            }
          })
        } as Response);
      };
      jest.spyOn(global, 'fetch').mockImplementation(assetsFetchMock);
    });

    describe('when success', () => {
      it('should return success business unit creation in CT', () => {
        const body = {
          username: 'username@username.com',
          rut: '123',
          firstName: 'firstName',
          lastName: 'lastName',
          phone: '11111111111',
          address: {
            country: 'CL',
            city: 'chimbarongo',
            streetName: 'Carmen Larrain',
            streetNumber: '46',
            region: 'del-libertador-b-o-higgins',
            apartment: '4B',
            commune: 'chimbarongo',
            otherInformation: 'otherInformation',
            coordinates: {
              lat: 0,
              long: 0
            }
          }
        };
        const status = 201;
        return request(app.getHttpServer())
          .post(url)
          .set(userHeaderRoles, xUserRoles)
          .send(body)
          .expect(status)
          .expect(
            JSON.stringify({
              ...mockBusinessUnitCreated,
              rut: '123456789',
              custom: undefined
            })
          );
      });
    });

    describe('when x-user-roles is missing', () => {
      it('should return 400 and throw a BadRequestException', () => {
        const body = { username: 'username@username.com', rut: '123', firstName: 'firstName', lastName: 'lastName', phone: '11111111111' };
        const status = 400;
        return request(app.getHttpServer()).post(url).send(body).expect(status).expect({ statusCode: 400, message: 'User roles missing' });
      });
    });

    describe('when insufficient permissions', () => {
      const newXUserRoles = ['INVALID'];
      it('should return 403 and throw a ForbiddenException', () => {
        const body = { username: 'username@username.com', rut: '123', firstName: 'firstName', lastName: 'lastName', phone: '11111111111' };
        const status = 403;
        return request(app.getHttpServer())
          .post(url)
          .set(userHeaderRoles, newXUserRoles)
          .send(body)
          .expect(status)
          .expect({ statusCode: 403, message: 'Insufficient permissions' });
      });
    });

    describe('when rut is invalid', () => {
      it('should return 400', () => {
        const body = { username: 'username@username.com', firstName: 'firstName', lastName: 'lastName', phone: '11111111111', rut: '123456789' };
        const status = 400;
        return request(app.getHttpServer())
          .post(url)
          .set(userHeaderRoles, xUserRoles)
          .send(body)
          .expect(status)
          .expect({ statusCode: 400, message: 'Invalid RUT', code: 'BU-001', detail: 'RUT is not valid or does not exist.' });
      });
    });

    describe('when is valid Rut but no associated business unit', () => {
      it('should return 400', () => {
        const body = { username: 'username@username.com', firstName: 'firstName', lastName: 'lastName', phone: '11111111111', rut: '1234567' };
        const status = 400;
        return request(app.getHttpServer()).post(url).set(userHeaderRoles, xUserRoles).send(body).expect(status).expect({
          statusCode: 400,
          message: 'No Associated Business Unit',
          code: 'BU-007',
          detail: 'Valid Rut but no associated business unit'
        });
      });
    });

    describe('when external rut verification service is experiencing problems', () => {
      it('should return 503', () => {
        const body = { username: 'username@username.com', firstName: 'firstName', lastName: 'lastName', phone: '11111111111', rut: '123455' };
        const status = 503;
        return request(app.getHttpServer()).post(url).set(userHeaderRoles, xUserRoles).send(body).expect(status).expect({
          statusCode: 503,
          message: 'External Rut Verification Service Error',
          code: 'BU-006',
          detail: 'External rut verification service is experiencing problems. Please try later'
        });
      });
    });

    describe('when rut already registred', () => {
      it('should return 400', () => {
        const body = { username: 'username@username.com', rut: '321', firstName: 'firstName', lastName: 'lastName', phone: '11111111111' };
        const status = 400;
        return request(app.getHttpServer())
          .post(url)
          .set(userHeaderRoles, xUserRoles)
          .send(body)
          .expect(status)
          .expect({ statusCode: 400, message: 'RUT is already registered.', code: 'BU-004', detail: 'RUT is already registerered. Please choose another email.' });
      });
    });

    describe('when user already registred', () => {
      it('should return 409', () => {
        const body = { username: 'user@mail.com', rut: '123', firstName: 'firstName', lastName: 'lastName', phone: '11111111111' };
        const status = 409;
        return request(app.getHttpServer()).post(url).set(userHeaderRoles, xUserRoles).send(body).expect(status).expect({
          statusCode: 409,
          message: 'User is already associated with another Company.',
          code: 'BU-003',
          detail: 'User is already associated with another Company.'
        });
      });
    });
  });

  describe('POST /users/validation', () => {
    const url = '/users/validation';

    beforeEach(() => {
      jest.clearAllMocks();
    });

    beforeEach(() => {
      const assetsFetchMock = (url: string) => {
        if (url === 'host/rut/validation/123456789') {
          return Promise.resolve({
            ok: true,
            status: 200,
            json: async () => ({
              statusCode: 422,
              message: 'Error'
            })
          } as Response);
        }
        if (url === 'host/rut/validation/1234567') {
          return Promise.resolve({
            ok: true,
            status: 200,
            json: async () => ({
              statusCode: 200,
              payload: null
            })
          } as Response);
        }
        if (url === 'host/rut/validation/123455') {
          return Promise.resolve({
            ok: true,
            status: 200,
            json: async () => ({
              statusCode: 200
            })
          } as Response);
        }

        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => ({
            statusCode: 200,
            payload: {
              businessName: 'company-name'
            }
          })
        } as Response);
      };
      jest.spyOn(global, 'fetch').mockImplementation(assetsFetchMock);
    });

    describe('when success', () => {
      it('should return username, rut and bu name', () => {
        const body = { username: 'username@username.com', rut: '123' };
        const status = 200;
        return request(app.getHttpServer())
          .post(url)
          .send(body)
          .expect(status)
          .expect({ ...body, buName: 'company-name' });
      });
    });

    describe('when rut is invalid', () => {
      it('should return 400', () => {
        const body = { username: 'username@username.com', rut: '123456789' };
        const status = 400;
        return request(app.getHttpServer())
          .post(url)
          .send(body)
          .expect(status)
          .expect({ statusCode: 400, message: 'Invalid RUT', code: 'BU-001', detail: 'RUT is not valid or does not exist.' });
      });
    });

    describe('when rut already registered', () => {
      it('should return 400', () => {
        const body = { username: 'username@username.com', rut: '321' };
        const status = 400;
        return request(app.getHttpServer())
          .post(url)
          .send(body)
          .expect(status)
          .expect({ statusCode: 400, message: 'RUT is already registered.', code: 'BU-004', detail: 'RUT is already registerered. Please choose another email.' });
      });
    });

    describe('when user already registered', () => {
      it('should return 409', () => {
        const body = { username: 'user@mail.com', rut: '123' };
        const status = 409;
        return request(app.getHttpServer()).post(url).send(body).expect(status).expect({
          statusCode: 409,
          message: 'User is already associated with another Company.',
          code: 'BU-003',
          detail: 'User is already associated with another Company.'
        });
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
