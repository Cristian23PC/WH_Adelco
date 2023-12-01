const mockRutService = {
  getBusinessNameFromValidRut: jest.fn((rut: string) => {
    if (rut.includes('rut')) {
      return Promise.resolve('company-name');
    }
    throw ErrorBuilder.buildError('invalidRut');
  })
};

const mockKeycloakService = {
  getAuthToken: jest.fn(() => Promise.resolve({ access_token: 'access_token' })),
  getByUsername: jest.fn(username => {
    switch (username) {
      case 'verified@mail.com':
        return [{ ...keycloakUserMock, emailVerified: true }];
      case 'noexist@noexist.com':
        return [];
      case 'expired@mail.com':
        return [keycloakExpiredCodeUserMock];
      case 'nocode@mail.com':
        return [{ ...keycloakUserMock, attributes: { companyRut: [] } }];
      case 'noattribute@noattribute.com':
        return [{ ...keycloakUserMock, attributes: null }];
      case 'noattributesvalues@noattributesvalues.com':
        return [{ ...keycloakUserMock, attributes: {} }];
      case 'leadingzero@mail.com':
        return [{ ...keycloakUserMock, attributes: { ...keycloakUserMock.attributes, verificationCodeData: ['MDAwMV8yNjgyNjI4NjM0'] } }];
      default:
        return [keycloakUserMock];
    }
  }),
  createUser: jest.fn(draft => Promise.resolve({ message: `Username "${draft.username}" successfully created.`, status: 201 })),
  resetPassword: jest.fn(() => Promise.resolve()),
  generateVerificationCode: jest.fn(() => Promise.resolve()),
  updateUser: jest.fn(() => Promise.resolve())
};

const mockBusinessUnitsService = {
  findByRut: jest.fn(rut => {
    if (['new-rut', 'username', 'username-register', 'new-ru-T'].includes(rut)) {
      return Promise.resolve([]);
    }

    return [mockDivisionBusinessUnit];
  }),
  createBusinessUnit: jest.fn(() => Promise.resolve({ key: 'key', name: 'name' })),
  findConvertedByRut: jest.fn(() => Promise.resolve([{ key: 'key', name: 'name' }])),
  findBusinessUnits: jest.fn((customerId: string) => {
    if (customerId.indexOf('noUnitsId') >= 0) {
      return Promise.resolve({ businessUnits: [] });
    }
    if (customerId.indexOf('errorUnits') >= 0) {
      return Promise.reject(new CommercetoolsError(mockCommercetoolsErrorTimeout));
    }
    return Promise.resolve({
      businessUnits: [mockCompanyBusinessUnit, mockDivisionBusinessUnit]
    });
  }),
  getDeliveryZoneByAddress: jest.fn(() => Promise.resolve({ id: 'delivery-zone-id' })),
  deleteById: jest.fn(() => Promise.resolve()),
  updateById: jest.fn(() => Promise.resolve())
};

const mockCustomersService = {
  createCustomer: jest.fn(() => {
    return Promise.resolve({ customer: { id: 'id', externalId: 'externalId' } });
  }),
  getCustomerByEmail: jest.fn((email: string) => {
    if (email.indexOf('not-found@mail.com') >= 0) {
      return Promise.reject(new HttpException('Customer not found', HttpStatus.NOT_FOUND));
    }
    if (email.indexOf('invalidSearch') >= 0) {
      return Promise.reject(new CommercetoolsError(mockCommercetoolsErrorMalformed));
    }
    if (email.indexOf('no-units@mail.com') >= 0) {
      return Promise.resolve(mockCommercetoolsCustomerNoUnitsResponse);
    }
    if (email.indexOf('error-units@mail.com') >= 0) {
      return Promise.resolve(mockCommercetoolsCustomerErrorResponse);
    }
    return Promise.resolve({ id: 'id', externalId: 'externalId' });
  })
};

const mockSequenceService = {
  getBusinessUnitKey: jest.fn().mockImplementation(() => '6000001')
};

const mockConfigService = {
  get: (key: string) => (key === 'registration.codeExpirationTime' ? 3600 : key)
};

jest.mock('@/rut/rut.service', () => ({
  RutService: jest.fn().mockImplementation(() => mockRutService)
}));

jest.mock('@/keycloak/keycloak.service', () => ({
  KeycloakService: jest.fn().mockImplementation(() => mockKeycloakService)
}));

jest.mock('@/business-units/business-units.service', () => ({
  BusinessUnitsService: jest.fn().mockImplementation(() => mockBusinessUnitsService)
}));

jest.mock('@/customers/customers.service', () => ({
  CustomersService: jest.fn().mockImplementation(() => mockCustomersService)
}));

jest.mock('@/sequence/sequence.service', () => ({
  SequenceService: jest.fn().mockImplementation(() => mockSequenceService)
}));

jest.mock('@nestjs/config', () => ({
  ConfigService: jest.fn().mockImplementation(() => mockConfigService)
}));

import { Test, TestingModule } from '@nestjs/testing';
import { BusinessUnitsService } from '@/business-units/business-units.service';
import { BusinessUnitsUsersService } from '../business-units-users.service';
import { RutService } from '@/rut/rut.service';
import { KeycloakService } from '@/keycloak/keycloak.service';
import { ApiError } from '@/common/errors/api.error';
import { keycloakExpiredCodeUserMock, keycloakUserMock } from '@/keycloak/__mocks__/keycloak.mock';
import { ICustomerBusinessUnits } from '@/business-units/business-units.interface';
import { mockCompanyBusinessUnit, mockDivisionBusinessUnit } from '@/business-units/__mocks__/business-units.mock';
import { ConvertedBusinessUnit } from '@/business-units/models';
import { KeycloakUserAttributes, KeycloakUserCreationResponse } from '@/keycloak/interfaces/keycloak.interface';
import { CustomersService } from '@/customers/customers.service';
import { ConfigService } from '@nestjs/config';
import { ErrorBuilder } from '@/common/utils/error-builder/error-builder';
import * as parser from '@/common/utils/parser/parser';
import { mockBusinessUnitCompanyDraft, mockCustomerDraft } from '@/common/utils/parser/__mocks__/parser.mock';
import { ForbiddenException, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { UserAndRutValidationResponse } from '../business-units-users.interface';
import { CommercetoolsError } from '@/nest-commercetools';
import {
  mockCommercetoolsCustomerErrorResponse,
  mockCommercetoolsCustomerNoUnitsResponse,
  mockCommercetoolsErrorMalformed,
  mockCommercetoolsErrorTimeout
} from '../__mocks__/business-units-users.mock';
import { SequenceService } from '@/sequence/sequence.service';

describe('BusinessUnitsUsersService', () => {
  let service: BusinessUnitsUsersService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BusinessUnitsUsersService, RutService, KeycloakService, BusinessUnitsService, CustomersService, SequenceService, ConfigService]
    }).compile();

    service = module.get<BusinessUnitsUsersService>(BusinessUnitsUsersService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('findBusinessUnitsForUser', () => {
    let response: HttpException | CommercetoolsError | { businessUnits: ConvertedBusinessUnit[] };

    describe('when success', () => {
      let expectedResponse;

      describe('when customers are found', () => {
        describe('when customer has business units', () => {
          beforeEach(async () => {
            expectedResponse = {
              businessUnits: [mockCompanyBusinessUnit, mockDivisionBusinessUnit]
            };
            response = await service.findBusinessUnitsForUser('johndoe@mail.com');
          });

          it('should call CustomersService', () => {
            expect(mockCustomersService.getCustomerByEmail).toHaveBeenCalledWith('johndoe@mail.com');
          });

          it('should call BusinessUnitsService', () => {
            expect(mockBusinessUnitsService.findBusinessUnits).toHaveBeenCalledWith('id');
          });

          it('should return Customer Business Units with results', () => {
            expect(response).toEqual(expectedResponse);
          });
        });

        describe('when customer does not have business units', () => {
          beforeEach(async () => {
            expectedResponse = {
              businessUnits: []
            };
            response = await service.findBusinessUnitsForUser('no-units@mail.com');
          });

          it('should call CustomersService', () => {
            expect(mockCustomersService.getCustomerByEmail).toHaveBeenCalledWith('no-units@mail.com');
          });

          it('should call BusinessUnitsService', () => {
            expect(mockBusinessUnitsService.findBusinessUnits).toHaveBeenCalledWith('noUnitsId');
          });

          it('should return Customer Business Units with results', () => {
            expect(response).toEqual(expectedResponse);
          });
        });
      });

      describe('when no customers are found', () => {
        beforeEach(async () => {
          expectedResponse = new HttpException('Customer not found', HttpStatus.NOT_FOUND);
          try {
            await service.findBusinessUnitsForUser('not-found@mail.com');
          } catch (e) {
            response = e as HttpException;
          }
        });

        it('should call CustomerService', () => {
          expect(mockCustomersService.getCustomerByEmail).toHaveBeenCalledWith('not-found@mail.com');
        });

        it('should not call BusinessUnitsService', () => {
          expect(mockBusinessUnitsService.findBusinessUnits).not.toHaveBeenCalled();
        });

        it('should return a 404 Error', () => {
          expect(response).toEqual(expectedResponse);
        });
      });
    });

    describe('when CommerceTools returns an error', () => {
      let expectedResponse;

      describe('when querying for customer', () => {
        beforeEach(async () => {
          expectedResponse = new CommercetoolsError(mockCommercetoolsErrorMalformed);
          try {
            await service.findBusinessUnitsForUser('invalidSearch');
          } catch (e) {
            response = e as CommercetoolsError;
          }
        });

        it('should call CustomerService', () => {
          expect(mockCustomersService.getCustomerByEmail).toHaveBeenCalledWith('invalidSearch');
        });

        it('should not call BusinessUnitsService', () => {
          expect(mockBusinessUnitsService.findBusinessUnits).not.toHaveBeenCalled();
        });

        it('should return an Error response', () => {
          expect(response).toEqual(expectedResponse);
        });
      });

      describe('when querying for business units', () => {
        beforeEach(async () => {
          expectedResponse = new CommercetoolsError(mockCommercetoolsErrorTimeout);
          try {
            await service.findBusinessUnitsForUser('error-units@mail.com');
          } catch (e) {
            response = e as CommercetoolsError;
          }
        });

        it('should call CustomerService', () => {
          expect(mockCustomersService.getCustomerByEmail).toHaveBeenCalledWith('error-units@mail.com');
        });

        it('should call BusinessUnitsService', () => {
          expect(mockBusinessUnitsService.findBusinessUnits).toHaveBeenCalledWith('errorUnits');
        });

        it('should return an Error response', () => {
          expect(response).toEqual(expectedResponse);
        });
      });
    });
  });

  describe('validateUserNotRegisteredInKeycloak', () => {
    let response: ApiError | void;

    describe('when keycloak user not exist', () => {
      const username = 'noexist@noexist.com';

      beforeEach(async () => {
        response = await service.validateUserNotRegisteredInKeycloak(username, 'access_token');
      });

      it('should call KeycloakService', () => {
        expect(mockKeycloakService.getByUsername).toHaveBeenCalledWith(username, 'access_token');
      });

      it('should return void', () => {
        expect(response).toBeUndefined();
      });
    });

    describe('when keycloak user already exists', () => {
      const username = 'exist@exist.com';

      beforeEach(async () => {
        try {
          await service.validateUserNotRegisteredInKeycloak(username, 'access_token');
        } catch (e) {
          response = e;
        }
      });

      it('should call KeycloakService', () => {
        expect(mockKeycloakService.getByUsername).toHaveBeenCalledWith(username, 'access_token');
      });

      it('should return API Error', () => {
        expect(response).toEqual(new Error('Keycloak user already registered.'));
      });
    });
  });

  describe('getBusinessUnits', () => {
    let response: ICustomerBusinessUnits | undefined;

    describe('when the username have BusinessUnits', () => {
      const username = 'businessunits@businessunits.com';
      let spy: jest.SpyInstance;

      beforeEach(async () => {
        spy = jest.spyOn(service, 'findBusinessUnitsForUser').mockImplementation(() => Promise.resolve({ businessUnits: [mockDivisionBusinessUnit] } as ICustomerBusinessUnits));
        response = await service.getBusinessUnits(username);
      });

      afterEach(() => {
        spy.mockClear();
      });

      it('should call service.findBusinessUnitsForUser', () => {
        expect(spy).toHaveBeenCalledWith(username);
      });

      it('should get a BusinessUnits', () => {
        expect(response).toEqual({ businessUnits: [mockDivisionBusinessUnit] });
      });
    });

    describe('when the username not have BusinessUnits', () => {
      const username = 'nobu@nobu.com';
      let spy: jest.SpyInstance;

      beforeEach(async () => {
        spy = jest.spyOn(service, 'findBusinessUnitsForUser').mockImplementation(() => {
          throw new Error('No business unit');
        });
        response = await service.getBusinessUnits(username);
      });

      it('should call service.findBusinessUnitsForUser', () => {
        expect(spy).toHaveBeenCalledWith(username);
      });

      it('should return undefined', () => {
        expect(response).toBeUndefined();
      });
    });
  });

  describe('validateUserIsAlreadyRegistered', () => {
    let response: ApiError | void;

    describe('when username is not registered', () => {
      const rut = 'username';

      beforeEach(async () => {
        try {
          response = await service.validateUserIsAlreadyRegistered(rut, {
            businessUnits: []
          });
        } catch (error) {}
      });

      it('should return undefined', () => {
        expect(response).toBeUndefined();
      });
    });

    describe('when rut exists', () => {
      const rut = 'rut';

      beforeEach(async () => {
        try {
          await service.validateUserIsAlreadyRegistered(rut, {
            businessUnits: []
          });
        } catch (error) {
          response = error;
        }
      });

      it('should return API Error', () => {
        expect(response).toEqual(new Error('RUT is already registered.'));
      });
    });

    describe('when the username is already register', () => {
      const rut = 'username-register';

      beforeEach(async () => {
        try {
          await service.validateUserIsAlreadyRegistered(rut, {
            businessUnits: [
              {
                ...mockCompanyBusinessUnit,
                rut: 'rut'
              }
            ] as ConvertedBusinessUnit[]
          });
        } catch (e) {
          response = e;
        }
      });

      it('should return API Error', () => {
        expect(response).toEqual(new Error('User is already associated with another Company.'));
      });
    });

    describe('when the username is already register with same RUT', () => {
      const rut = '94701767';

      beforeEach(async () => {
        response = await service.validateUserIsAlreadyRegistered(rut, {
          businessUnits: [
            {
              ...mockCompanyBusinessUnit,
              rut: '9470176-7'
            }
          ] as ConvertedBusinessUnit[]
        });
      });

      it('should return undefined', () => {
        expect(response).toBeUndefined();
      });
    });
  });

  describe('getCompany', () => {
    let response: ConvertedBusinessUnit | undefined;

    describe('when find a company', () => {
      beforeEach(async () => {
        response = service.getCompany({ businessUnits: [mockCompanyBusinessUnit] as ConvertedBusinessUnit[] });
      });

      it('should return a company', () => {
        expect(response).toEqual(mockCompanyBusinessUnit);
      });
    });

    describe('when not find a company', () => {
      beforeEach(async () => {
        response = service.getCompany({ businessUnits: [mockDivisionBusinessUnit] as ConvertedBusinessUnit[] });
      });

      it('should return a company', () => {
        expect(response).toBeUndefined();
      });
    });

    describe('when not company provided', () => {
      beforeEach(async () => {
        response = service.getCompany();
      });

      it('should return a company', () => {
        expect(response).toBeUndefined();
      });
    });
  });

  describe('preRegistration', () => {
    let response: KeycloakUserCreationResponse;

    describe('when username is valid', () => {
      beforeEach(async () => {
        jest.spyOn(service, 'validateUserNotRegisteredInKeycloak').mockImplementation(jest.fn());
        jest.spyOn(service, 'getBusinessUnits').mockImplementation(() => Promise.resolve({ businessUnits: [mockDivisionBusinessUnit] } as ICustomerBusinessUnits));
        jest.spyOn(String.prototype, 'match').mockImplementation(() => ['username']);
        response = await service.preRegistration({ username: 'username', rut: 'new-rut', firstName: 'User', lastName: 'Name', phone: '12345678911', password: 'pass' });
      });

      it('should return pre-registration successfully', () => {
        expect(response).toEqual({ message: `Username "username" successfully created.`, status: 201 });
      });
    });

    describe('when username is not valid', () => {
      beforeEach(async () => {
        jest.spyOn(service, 'validateUserNotRegisteredInKeycloak').mockImplementation(jest.fn());
        jest.spyOn(service, 'getBusinessUnits').mockImplementation(() => Promise.resolve({ businessUnits: [mockDivisionBusinessUnit] } as ICustomerBusinessUnits));
        jest.spyOn(String.prototype, 'match').mockImplementation(() => null);

        try {
          await service.preRegistration({ username: 'username', rut: 'new-rut', firstName: 'User', lastName: 'Name', phone: '12345678911', password: 'pass' });
        } catch (err) {
          response = err;
        }
      });

      it('should return pre-registration successfully', () => {
        expect(response).toEqual(new Error('Invalid username'));
      });
    });
  });

  describe('validateKeycloakUserCode', () => {
    let response: Error | ApiError | { userId: string; attributes: KeycloakUserAttributes };

    describe('when keycloak user has no attributes', () => {
      const username = 'noattribute@noattribute.com';
      const code = '123456789';

      beforeEach(async () => {
        try {
          await service.validateKeycloakUserCode(username, code, 'access_token');
        } catch (e) {
          response = e as Error;
        }
      });

      it('should call KeycloakService', () => {
        expect(mockKeycloakService.getByUsername).toHaveBeenCalledWith(username, 'access_token');
      });

      it('should throw an error', () => {
        expect(response).toEqual(ErrorBuilder.buildError('invalidCode'));
      });
    });

    describe('when keycloak user has attributes without values', () => {
      const username = 'noattributesvalues@noattributesvalues.com';
      const code = '123456789';

      beforeEach(async () => {
        try {
          await service.validateKeycloakUserCode(username, code, 'access_token');
        } catch (e) {
          response = e as Error;
        }
      });

      it('should call KeycloakService', () => {
        expect(mockKeycloakService.getByUsername).toHaveBeenCalledWith(username, 'access_token');
      });

      it('should throw an error', () => {
        expect(response).toEqual(ErrorBuilder.buildError('invalidCode'));
      });
    });

    describe('when keycloak user not exist', () => {
      const username = 'noexist@noexist.com';
      const code = '123456789';

      beforeEach(async () => {
        try {
          await service.validateKeycloakUserCode(username, code, 'access_token');
        } catch (e) {
          response = e as Error;
        }
      });

      it('should call KeycloakService', () => {
        expect(mockKeycloakService.getByUsername).toHaveBeenCalledWith(username, 'access_token');
      });

      it('should throw an error', () => {
        expect(response).toEqual(new Error('User does not exist'));
      });
    });

    describe('when keycloak user is already verified', () => {
      const username = 'verified@mail.com';
      const code = '123456789';

      beforeEach(async () => {
        try {
          await service.validateKeycloakUserCode(username, code, 'access_token');
        } catch (e) {
          response = e as ApiError;
        }
      });

      it('should call KeycloakService', () => {
        expect(mockKeycloakService.getByUsername).toHaveBeenCalledWith(username, 'access_token');
      });

      it('should throw an error', () => {
        expect(response).toEqual(ErrorBuilder.buildError('keycloakUserAlreadyRegister'));
      });
    });

    describe('when keycloak code does not match', () => {
      const username = 'badcode@mail.com';
      const code = '87654321';

      beforeEach(async () => {
        try {
          await service.validateKeycloakUserCode(username, code, 'access_token');
        } catch (e) {
          response = e as ApiError;
        }
      });

      it('should call KeycloakService', () => {
        expect(mockKeycloakService.getByUsername).toHaveBeenCalledWith(username, 'access_token');
      });

      it('should throw an error', () => {
        expect(response).toEqual(ErrorBuilder.buildError('wrongVerificationAttempt'));
      });
    });

    describe('when keycloak code matches but has expired', () => {
      const username = 'expired@mail.com';
      const code = '12345678';

      beforeEach(async () => {
        try {
          await service.validateKeycloakUserCode(username, code, 'access_token');
        } catch (e) {
          response = e as ApiError;
        }
      });

      it('should call KeycloakService', () => {
        expect(mockKeycloakService.getByUsername).toHaveBeenCalledWith(username, 'access_token');
      });

      it('should throw an error', () => {
        expect(response).toEqual(ErrorBuilder.buildError('invalidCode'));
      });
    });

    describe('when keycloak code not exist', () => {
      const username = 'nocode@mail.com';
      const code = '12345678';

      beforeEach(async () => {
        try {
          await service.validateKeycloakUserCode(username, code, 'access_token');
        } catch (error) {
          response = error;
        }
      });

      it('should call KeycloakService', () => {
        expect(mockKeycloakService.getByUsername).toHaveBeenCalledWith(username, 'access_token');
      });

      it('should thrown an error', () => {
        expect(response).toEqual(ErrorBuilder.buildError('invalidCode'));
      });
    });

    describe('when keycloak code is valid and not verified the keycload email', () => {
      const username = 'goodcode@mail.com';
      const code = '1234';

      beforeEach(async () => {
        response = await service.validateKeycloakUserCode(username, code, 'access_token', false);
      });

      it('should call KeycloakService', () => {
        expect(mockKeycloakService.getByUsername).toHaveBeenCalledWith(username, 'access_token');
      });

      it('should return userId and RUT', () => {
        expect(response).toEqual({
          userId: 'id',
          email: 'username@username.com',
          firstName: 'first-name',
          lastName: 'last-name',
          attributes: {
            companyRut: ['123456789'],
            contactPhone: ['1234567891'],
            remainingAttempts: ['3'],
            verificationCodeData: ['MTIzNF8yNjgyNjI4NjM0']
          }
        });
      });
    });

    describe('when keycloak code is valid', () => {
      const username = 'goodcode@mail.com';
      const code = '1234';

      beforeEach(async () => {
        response = await service.validateKeycloakUserCode(username, code, 'access_token');
      });

      it('should call KeycloakService', () => {
        expect(mockKeycloakService.getByUsername).toHaveBeenCalledWith(username, 'access_token');
      });

      it('should return userId and RUT', () => {
        expect(response).toEqual({
          userId: 'id',
          email: 'username@username.com',
          firstName: 'first-name',
          lastName: 'last-name',
          attributes: {
            companyRut: ['123456789'],
            contactPhone: ['1234567891'],
            remainingAttempts: ['3'],
            verificationCodeData: ['MTIzNF8yNjgyNjI4NjM0']
          }
        });
      });
    });
  });

  describe('completeRegistration', () => {
    let response: ConvertedBusinessUnit;

    beforeAll(async () => {
      jest.spyOn(service, 'validateKeycloakUserCode').mockImplementation(() =>
        Promise.resolve({
          userId: 'id',
          firstName: 'User',
          lastName: 'Name',
          email: 'username@mail.com',
          attributes: {
            companyRut: ['new-rut'],
            contactPhone: ['12345678911'],
            password: ['pass'],
            companyName: ['Company Name']
          }
        })
      );

      jest.spyOn(service, 'getBusinessUnits').mockImplementation(() => Promise.resolve({ businessUnits: [mockDivisionBusinessUnit] } as ICustomerBusinessUnits));

      response = await service.completeRegistration({ username: 'username', code: '1234' });
    });

    it('should return BusinessUnite created successfully', () => {
      expect(response).toEqual({ key: 'key', name: 'name' });
    });
  });

  describe('repRegistration', () => {
    let response: ConvertedBusinessUnit | ApiError;

    describe('when create Customer and BusinessUnit successfully', () => {
      const xUserRoles = ['__INTERNAL__'];
      const body = {
        username: 'username@username.com',
        rut: 'rut',
        firstName: 'firstName',
        lastName: 'lastName',
        phone: '11111111111',
        address: {
          country: 'CL',
          city: 'locality',
          commune: 'commune',
          region: 'Region',
          streetName: 'streetName',
          streetNumber: 'streetNumber'
        }
      };
      let spyGetBusinessUnits: jest.SpyInstance;
      let spyValidateUserIsAlreadyRegistered: jest.SpyInstance;
      let spyBuildCustomerDraft: jest.SpyInstance;
      let spyBuildBusinessUnitDraft: jest.SpyInstance;

      beforeEach(async () => {
        spyGetBusinessUnits = jest
          .spyOn(service, 'getBusinessUnits')
          .mockImplementation(() => Promise.resolve({ businessUnits: [mockDivisionBusinessUnit] } as ICustomerBusinessUnits));
        spyValidateUserIsAlreadyRegistered = jest.spyOn(service, 'validateUserIsAlreadyRegistered').mockImplementation(jest.fn());
        spyBuildCustomerDraft = jest.spyOn(parser, 'buildCustomerDraft').mockImplementation(() => mockCustomerDraft);
        spyBuildBusinessUnitDraft = jest.spyOn(parser, 'buildBusinessUnitDraft').mockImplementation(() => mockBusinessUnitCompanyDraft);

        response = await service.repRegistration(body, xUserRoles);
      });

      it('should call getBusinessUnits', () => {
        expect(spyGetBusinessUnits).toHaveBeenCalledWith('username@username.com');
      });

      it('should call validateUserIsAlreadyRegistered', () => {
        expect(spyValidateUserIsAlreadyRegistered).toHaveBeenCalledWith('rut', { businessUnits: [mockDivisionBusinessUnit] }, true);
      });

      it('should call buildCustomerDraft', () => {
        expect(spyBuildCustomerDraft).toHaveBeenCalledWith(
          { email: 'username@username.com', firstName: 'firstName', lastName: 'lastName', phone: '11111111111' },
          undefined,
          undefined
        );
      });

      it('should call customerService.createCustomer', () => {
        expect(mockCustomersService.createCustomer).toHaveBeenCalledWith(mockCustomerDraft);
      });

      it('should call buildBusinessUnitDraft', () => {
        expect(spyBuildBusinessUnitDraft).toHaveBeenCalledWith('6000001', body, 'company-name', undefined, 'delivery-zone-id');
      });

      it('should return BusinessUnit created successfully', () => {
        expect(response).toEqual({ key: 'key', name: 'name' });
      });

      test('should call businessUnitsService createBusinessUnit', () => {
        expect(mockBusinessUnitsService.createBusinessUnit).toHaveBeenCalledWith(
          {
            addresses: [],
            associates: [
              {
                associateRoleAssignments: [{ associateRole: { key: 'admin-role', typeId: 'associate-role' }, inheritance: 'Enabled' }],
                customer: { id: 'customer-id', typeId: 'customer' }
              }
            ],
            custom: {
              fields: {
                customerGroupCode: '01',
                deliveryZone: { id: 'delivery-zone-id', typeId: 'key-value-document' },
                isCreditBlocked: false,
                isCreditEnabled: false,
                rut: 'ruT',
                shouldApplyT2Rate: true,
                taxProfile: '1',
                tradeName: 'trade-name'
              },
              type: { key: 'adelco-business-unit-type', typeId: 'type' }
            },
            defaultBillingAddress: undefined,
            defaultShippingAddress: undefined,
            key: '600001',
            name: 'Company rut',
            status: 'Active',
            unitType: 'Company'
          },
          'sales-svc'
        );
      });
    });

    describe('when create fake Customer and BusinessUnit successfully', () => {
      const xUserRoles = ['__INTERNAL__'];
      const body = {
        rut: 'rut',
        firstName: 'firstName',
        lastName: 'lastName',
        phone: '11111111111',
        isFakeCustomer: true,
        address: {
          country: 'CL',
          city: 'locality',
          commune: 'commune',
          region: 'Region',
          streetName: 'streetName',
          streetNumber: 'streetNumber'
        }
      };
      let spyGetBusinessUnits: jest.SpyInstance;
      let spyValidateUserIsAlreadyRegistered: jest.SpyInstance;
      let spyBuildCustomerDraft: jest.SpyInstance;
      let spyBuildBusinessUnitDraft: jest.SpyInstance;

      beforeEach(async () => {
        spyGetBusinessUnits = jest
          .spyOn(service, 'getBusinessUnits')
          .mockImplementation(() => Promise.resolve({ businessUnits: [mockDivisionBusinessUnit] } as ICustomerBusinessUnits));
        spyValidateUserIsAlreadyRegistered = jest.spyOn(service, 'validateUserIsAlreadyRegistered').mockImplementation(jest.fn());
        spyBuildCustomerDraft = jest.spyOn(parser, 'buildCustomerDraft').mockImplementation(() => mockCustomerDraft);
        spyBuildBusinessUnitDraft = jest.spyOn(parser, 'buildBusinessUnitDraft').mockImplementation(() => mockBusinessUnitCompanyDraft);

        response = await service.repRegistration(body, xUserRoles);
      });

      it('should not call getBusinessUnits', () => {
        expect(spyGetBusinessUnits).not.toHaveBeenCalled();
      });

      it('should call validateUserIsAlreadyRegistered', () => {
        expect(spyValidateUserIsAlreadyRegistered).toHaveBeenCalledWith('rut', undefined, true);
      });

      it('should call buildCustomerDraft', () => {
        expect(spyBuildCustomerDraft).toHaveBeenCalledWith({ email: '6000001.rut@fake.com', firstName: 'firstName', lastName: 'lastName', phone: '11111111111' }, undefined, true);
      });

      it('should call customerService.createCustomer', () => {
        expect(mockCustomersService.createCustomer).toHaveBeenCalledWith(mockCustomerDraft);
      });

      it('should call buildBusinessUnitDraft', () => {
        expect(spyBuildBusinessUnitDraft).toHaveBeenCalledWith('6000001', body, 'company-name', undefined, 'delivery-zone-id');
      });

      it('should return BusinessUnit created successfully', () => {
        expect(response).toEqual({ key: 'key', name: 'name' });
      });

      test('should call businessUnitsService createBusinessUnit', () => {
        expect(mockBusinessUnitsService.createBusinessUnit).toHaveBeenCalledWith(
          {
            addresses: [],
            associates: [
              {
                associateRoleAssignments: [{ associateRole: { key: 'admin-role', typeId: 'associate-role' }, inheritance: 'Enabled' }],
                customer: { id: 'customer-id', typeId: 'customer' }
              }
            ],
            custom: {
              fields: {
                customerGroupCode: '01',
                deliveryZone: { id: 'delivery-zone-id', typeId: 'key-value-document' },
                isCreditBlocked: false,
                isCreditEnabled: false,
                rut: 'ruT',
                shouldApplyT2Rate: true,
                taxProfile: '1',
                tradeName: 'trade-name'
              },
              type: { key: 'adelco-business-unit-type', typeId: 'type' }
            },
            defaultBillingAddress: undefined,
            defaultShippingAddress: undefined,
            key: '600001',
            name: 'Company rut',
            status: 'Active',
            unitType: 'Company'
          },
          'sales-svc'
        );
      });
    });

    describe('when user exists and is associated to the existing business unit with matching rut', () => {
      const xUserRoles = ['__INTERNAL__'];
      const body = {
        username: 'registeredInCompani@bu.com',
        rut: 'rut',
        firstName: 'firstName',
        lastName: 'lastName',
        phone: '11111111111',
        address: {
          country: 'CL',
          city: 'locality',
          commune: 'commune',
          region: 'Region',
          streetName: 'streetName',
          streetNumber: 'streetNumber'
        }
      };
      let spyGetBusinessUnits: jest.SpyInstance;
      let spyBuildCustomerDraft: jest.SpyInstance;
      let spyBuildBusinessUnitDraft: jest.SpyInstance;

      beforeEach(async () => {
        spyGetBusinessUnits = jest.spyOn(service, 'getBusinessUnits').mockImplementation(() =>
          Promise.resolve({
            businessUnits: [
              {
                ...mockCompanyBusinessUnit,
                custom: {
                  ...mockCompanyBusinessUnit.custom,
                  fields: {
                    ...mockCompanyBusinessUnit.custom.fields,
                    rut: 'rut'
                  }
                }
              }
            ]
          } as ICustomerBusinessUnits)
        );
        spyBuildCustomerDraft = jest.spyOn(parser, 'buildCustomerDraft').mockImplementation(() => mockCustomerDraft);
        spyBuildBusinessUnitDraft = jest.spyOn(parser, 'buildBusinessUnitDraft').mockImplementation(() => mockBusinessUnitCompanyDraft);

        try {
          await service.repRegistration(body, xUserRoles);
        } catch (e) {
          response = e as ApiError;
        }
      });

      it('should call getBusinessUnits', () => {
        expect(spyGetBusinessUnits).toHaveBeenCalledWith('registeredInCompani@bu.com');
      });

      it('should call buildCustomerDraft', () => {
        expect(spyBuildCustomerDraft).not.toHaveBeenCalledWith({ email: 'username@username.com', firstName: 'firstName', lastName: 'lastName', phone: '11111111111' });
      });

      it('should call customerService.createCustomer', () => {
        expect(mockCustomersService.createCustomer).not.toHaveBeenCalledWith(mockCustomerDraft);
      });

      it('should call buildBusinessUnitDraft', () => {
        expect(spyBuildBusinessUnitDraft).not.toHaveBeenCalledWith('id', 'rut', 'company-name');
      });

      it('should return BusinessUnit created successfully', () => {
        expect(response).toEqual(
          new ApiError({
            status: 409,
            code: 'BU-008',
            title: 'User is already associated to this Business Unit',
            detail: 'User is already associated to this Business Unit'
          })
        );
      });
    });

    describe('when not pass a valid header', () => {
      const xUserRoles = [];
      const body = {
        username: 'username@username.com',
        rut: 'rut',
        firstName: 'firstName',
        lastName: 'lastName',
        phone: '11111111111',
        address: {
          country: 'CL',
          city: 'locality',
          commune: 'commune',
          region: 'Region',
          streetName: 'streetName',
          streetNumber: 'streetNumber'
        }
      };

      beforeEach(async () => {
        try {
          await service.repRegistration(body, xUserRoles);
        } catch (error) {
          response = error;
        }
      });

      it('should throw ForbiddenException', () => {
        expect(response).toEqual(new ForbiddenException('Insufficient permissions'));
      });
    });
  });

  describe('validateUserAndRut', () => {
    let response: UserAndRutValidationResponse;
    let spyValidateUserNotRegisteredInKeycloak: jest.SpyInstance;

    describe('when user and RUT are valid', () => {
      beforeEach(async () => {
        spyValidateUserNotRegisteredInKeycloak = jest.spyOn(service, 'validateUserNotRegisteredInKeycloak').mockImplementation(() => Promise.resolve());

        response = await service.validateUserAndRut({ username: 'noexist@noexist.com', rut: 'new-rut' });
      });

      it('should call validateUserNotRegisteredInKeycloak', () => {
        expect(spyValidateUserNotRegisteredInKeycloak).toHaveBeenCalledWith('noexist@noexist.com', 'access_token');
      });

      it('should return validation success', () => {
        expect(response).toEqual({ username: 'noexist@noexist.com', rut: 'new-rut', buName: 'company-name' });
      });
    });

    describe('when RUT validation fails ', () => {
      let spyGetBusinessUnits: jest.SpyInstance;

      afterEach(() => {
        spyGetBusinessUnits.mockClear();
      });

      beforeEach(async () => {
        try {
          spyValidateUserNotRegisteredInKeycloak = jest.spyOn(service, 'validateUserNotRegisteredInKeycloak').mockImplementation(() => Promise.resolve());
          spyGetBusinessUnits = jest
            .spyOn(service, 'getBusinessUnits')
            .mockImplementation(() => Promise.resolve({ businessUnits: [mockDivisionBusinessUnit] } as ICustomerBusinessUnits));
          await service.validateUserAndRut({ username: 'noexist@noexist.com', rut: 'rut-validation-fails' });
        } catch (error) {
          response = error;
        }
      });

      it('should call validateUserNotRegisteredInKeycloak', () => {
        expect(spyValidateUserNotRegisteredInKeycloak).toHaveBeenCalledWith('noexist@noexist.com', 'access_token');
      });

      it('should call getBusinessUnits', () => {
        expect(spyGetBusinessUnits).toHaveBeenCalledWith('noexist@noexist.com');
      });

      it('should throw an error', () => {
        expect(response).toEqual(new Error('RUT is already registered.'));
      });
    });

    describe('when user validation fails ', () => {
      beforeEach(async () => {
        try {
          spyValidateUserNotRegisteredInKeycloak = jest
            .spyOn(service, 'validateUserNotRegisteredInKeycloak')
            .mockImplementation(() => Promise.reject(new Error('Keycloak user already registered.')));
          await service.validateUserAndRut({ username: 'newuser@users.com', rut: 'user-validation-fails-rut' });
        } catch (error) {
          response = error;
        }
      });

      it('should call validateUserNotRegisteredInKeycloak', () => {
        expect(spyValidateUserNotRegisteredInKeycloak).toHaveBeenCalledWith('newuser@users.com', 'access_token');
      });

      it('should throw an error', () => {
        expect(response).toBeInstanceOf(Error);
        expect(response).toEqual(new Error('Keycloak user already registered.'));
      });
    });
  });

  describe('getOrCreateCustomer', () => {
    let customerDraft, userId;

    beforeEach(() => {
      customerDraft = {
        firstName: 'First',
        lastName: 'Last',
        phone: '123456789',
        email: 'mail@mail.com'
      };
      userId = 'userId';
    });

    describe('when customer not found', () => {
      beforeEach(async () => {
        mockCustomersService.getCustomerByEmail.mockRejectedValue(new NotFoundException({ statusCode: 404, message: 'customer not found' }));
        await service.getOrCreateCustomer(customerDraft, userId);
      });

      test('should call customersService getCustomerByEmail', () => {
        expect(mockCustomersService.getCustomerByEmail).toHaveBeenCalledWith(customerDraft.email);
      });
      test('should call customersService createCustomer', () => {
        expect(mockCustomersService.createCustomer).toHaveBeenCalledWith({
          addresses: [{ country: 'CL', phone: '123456789' }],
          authenticationMode: 'ExternalAuth',
          email: 'mail@mail.com',
          externalId: 'userId',
          firstName: 'First',
          isEmailVerified: true,
          lastName: 'Last',
          custom: {
            fields: {
              isFake: false
            },
            type: {
              key: 'adelco-customer-type',
              typeId: 'type'
            }
          }
        });
      });
    });

    describe('when error', () => {
      let error;
      beforeEach(async () => {
        mockCustomersService.getCustomerByEmail.mockRejectedValue('error');
        try {
          await service.getOrCreateCustomer(customerDraft, userId);
        } catch (err) {
          error = err;
        }
      });

      test('should call customersService getCustomerByEmail', () => {
        expect(mockCustomersService.getCustomerByEmail).toHaveBeenCalledWith(customerDraft.email);
      });
      test('should not call customersService createCustomer', () => {
        expect(mockCustomersService.createCustomer).not.toHaveBeenCalledWith({
          addresses: [{ country: 'CL', phone: '123456789' }],
          authenticationMode: 'ExternalAuth',
          email: 'mail@mail.com',
          externalId: 'userId',
          firstName: 'First',
          isEmailVerified: true,
          lastName: 'Last'
        });
      });

      test('should throw an error', () => {
        expect(error).toEqual('error');
      });
    });

    describe('when customer exists', () => {
      beforeEach(async () => {
        mockCustomersService.getCustomerByEmail.mockResolvedValue(customerDraft);
        await service.getOrCreateCustomer(customerDraft, userId);
      });

      test('should call customersService getCustomerByEmail', () => {
        expect(mockCustomersService.getCustomerByEmail).toHaveBeenCalledWith(customerDraft.email);
      });
      test('should not call customersService createCustomer', () => {
        expect(mockCustomersService.createCustomer).not.toHaveBeenCalledWith({
          addresses: [{ country: 'CL', phone: '123456789' }],
          authenticationMode: 'ExternalAuth',
          email: 'mail@mail.com',
          externalId: 'userId',
          firstName: 'First',
          isEmailVerified: true,
          lastName: 'Last'
        });
      });
    });
  });

  describe('getOrCreateBusinessUnit', () => {
    let customerId, rut, companyName, response;

    beforeEach(() => {
      customerId = 'customer-id';
      rut = 'rut';
      companyName = 'Company SA';
    });

    describe('when find a business unit of type company', () => {
      beforeEach(async () => {
        mockBusinessUnitsService.findConvertedByRut.mockResolvedValue([{ key: 'key', name: companyName, ...mockCompanyBusinessUnit }]);
        response = await service.getOrCreateBusinessUnit(customerId, rut, companyName);
      });

      test('should call businessUnitsService getByKey', () => {
        expect(mockBusinessUnitsService.findConvertedByRut).toHaveBeenCalledWith(`rut`);
      });

      test('should not call businessUnitsService createBusinessUnit', () => {
        expect(mockBusinessUnitsService.createBusinessUnit).not.toHaveBeenCalled();
      });

      test('should return a company', () => {
        expect(response).toEqual({ key: 'key', name: companyName, ...mockCompanyBusinessUnit });
      });
    });

    describe('when not find a business unit of type company and create one', () => {
      beforeEach(async () => {
        mockBusinessUnitsService.findConvertedByRut.mockResolvedValue([{ key: 'key', name: companyName, ...mockDivisionBusinessUnit }]);
        response = await service.getOrCreateBusinessUnit(customerId, rut, companyName);
      });

      test('should call businessUnitsService getByKey', () => {
        expect(mockBusinessUnitsService.findConvertedByRut).toHaveBeenCalledWith(`rut`);
      });

      test('should not call businessUnitsService createBusinessUnit', () => {
        expect(mockBusinessUnitsService.createBusinessUnit).toHaveBeenCalledWith({
          addresses: [],
          associates: [
            {
              associateRoleAssignments: [{ associateRole: { key: 'admin-role', typeId: 'associate-role' }, inheritance: 'Enabled' }],
              customer: { id: 'customer-id', typeId: 'customer' }
            }
          ],
          custom: { fields: { rut: 'ru-T' }, type: { key: 'adelco-business-unit-type', typeId: 'type' } },
          defaultBillingAddress: undefined,
          defaultShippingAddress: undefined,
          key: '6000001',
          name: 'Company SA',
          status: 'Inactive',
          unitType: 'Company'
        });
      });

      test('should return a company', () => {
        expect(response).toEqual({ key: 'key', name: 'name' });
      });
    });

    describe('when throw an error different from 404', () => {
      beforeEach(async () => {
        mockBusinessUnitsService.findConvertedByRut.mockRejectedValue(new Error('error'));
        try {
          await service.getOrCreateBusinessUnit(customerId, rut, companyName);
        } catch (error) {
          response = error;
        }
      });

      test('should call businessUnitsService getByKey', () => {
        expect(mockBusinessUnitsService.findConvertedByRut).toHaveBeenCalledWith(`rut`);
      });

      test('should not call businessUnitsService createBusinessUnit', () => {
        expect(mockBusinessUnitsService.createBusinessUnit).not.toHaveBeenCalled();
      });

      test('should throw an error', () => {
        expect(response).toEqual(new Error('error'));
      });
    });
  });

  describe('requestVerificationCode', () => {
    let username: string;
    beforeEach(async () => {
      username = 'username@mail.com';
      await service.requestVerificationCode({ username });
    });

    test('should call keycloak service generate verification code', () => {
      expect(mockKeycloakService.generateVerificationCode).toHaveBeenCalledWith(username);
    });
  });

  describe('resetPassword', () => {
    let username: string, password: string, code: string, response;
    describe('when user does not exists', () => {
      beforeEach(async () => {
        username = 'noexist@noexist.com';
        password = 'pass';
        code = '0001';

        try {
          response = await service.resetPassword({ username, password, code });
        } catch (err) {
          response = err;
        }
      });

      test('should call getAuthToken', () => {
        expect(mockKeycloakService.getAuthToken).toHaveBeenCalled();
      });

      test('should call getByUsername', () => {
        expect(mockKeycloakService.getByUsername).toHaveBeenCalledWith(username, 'access_token');
      });

      test('should throw a not found exception', () => {
        expect(response).toEqual(new NotFoundException('User does not exist'));
      });
    });

    describe('when success', () => {
      beforeEach(async () => {
        username = 'user@mail.com';
        password = 'pass';
        code = '1234';

        await service.resetPassword({ username, password, code });
      });

      test('should call getAuthToken', () => {
        expect(mockKeycloakService.getAuthToken).toHaveBeenCalled();
      });

      test('should call updateUser', () => {
        expect(mockKeycloakService.updateUser).toHaveBeenCalledWith(keycloakUserMock.id, 'access_token', {
          attributes: { ...keycloakUserMock.attributes },
          emailVerified: true,
          requiredActions: []
        });
      });

      test('should call resetPassword', () => {
        expect(mockKeycloakService.resetPassword).toHaveBeenCalledWith(keycloakUserMock.id, password, 'access_token');
      });
    });
  });

  describe('validateVerificationCode', () => {
    let username: string, code: string;

    describe('when success', () => {
      beforeEach(async () => {
        username = 'user@mail.com';
        code = '1234';
        await service.validateVerificationCode({ username, code });
      });

      test('should call getAuthToken', () => {
        expect(mockKeycloakService.getAuthToken).toHaveBeenCalled();
      });

      test('should call getByUsername', () => {
        expect(mockKeycloakService.getByUsername).toHaveBeenCalledWith(username, 'access_token');
      });
    });

    describe('when success with leading zero', () => {
      beforeEach(async () => {
        username = 'leadingzero@mail.com';
        code = '0001';
        await service.validateVerificationCode({ username, code });
      });

      test('should call getAuthToken', () => {
        expect(mockKeycloakService.getAuthToken).toHaveBeenCalled();
      });

      test('should call getByUsername', () => {
        expect(mockKeycloakService.getByUsername).toHaveBeenCalledWith(username, 'access_token');
      });
    });
  });
});
