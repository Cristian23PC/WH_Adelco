const mockBusinessUnitsUsersService = {
  findBusinessUnitsForUser: jest.fn().mockImplementation(email => {
    if (email === 'johndoe@mail.com') {
      return { businessUnits: [{ id: 'id' }, { id: 'otherId' }] };
    }
    return { businessUnits: [] };
  }),
  preRegistration: jest.fn().mockImplementation((body: PreRegistrationRequestDto) => ({
    message: `Username "${body.username}" successfully created.`,
    status: 201
  })),
  completeRegistration: jest.fn().mockImplementation(() => ({
    id: 'id'
  })),
  repRegistration: jest.fn().mockImplementation(() => ({
    id: 'id'
  })),
  validateUserAndRut: jest.fn().mockImplementation(() => ({ username: 'user@valid.com', rut: 'valid-rut', buName: 'BU name' }))
};

jest.mock('../business-units-users.service', () => ({
  BusinessUnitsUsersService: jest.fn().mockImplementation(() => mockBusinessUnitsUsersService)
}));

const mockConfigService = {
  get: (key: string) => {
    switch (key) {
      case 'business-unit-users.userHeaderRoles':
        return userHeaderRoles;
      case 'business-unit-users.userHeaderId':
        return userHeaderId;
      default:
        return key;
    }
  }
};

jest.mock('@nestjs/config', () => ({
  ConfigService: jest.fn().mockImplementation(() => mockConfigService)
}));

import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';
import { BusinessUnitsUsersController } from '../business-units-users.controller';
import { KeycloakUserCreationResponse } from '@/keycloak/interfaces/keycloak.interface';
import { PreRegistrationRequestDto } from '../dto/business-units-users.dto';
import { BusinessUnitsUsersService } from '../business-units-users.service';
import { userHeaderId, userHeaderRoles } from '@/common/constants/headers';
import { UserAndRutValidationResponse } from '../business-units-users.interface';
import { ConvertedBusinessUnit } from '@/business-units/models';

describe('BusinessUnitsUsersController', () => {
  let controller: BusinessUnitsUsersController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BusinessUnitsUsersController],
      providers: [BusinessUnitsUsersService, ConfigService]
    }).compile();

    controller = module.get<BusinessUnitsUsersController>(BusinessUnitsUsersController);
  });

  describe('getBusinessUnitsForUser', () => {
    let response: { businessUnits: ConvertedBusinessUnit[] } | BadRequestException;

    describe('when requesting business units', () => {
      describe('when correct header is provided', () => {
        beforeEach(async () => {
          response = await controller.getBusinessUnitsForUser({ 'x-user-id': 'johndoe@mail.com' });
        });

        it('should call BusinessUnitsUsersService', () => {
          expect(mockBusinessUnitsUsersService.findBusinessUnitsForUser).toHaveBeenCalledWith('johndoe@mail.com');
        });

        it('should return expected response with regions', () => {
          expect(response).toEqual({ businessUnits: [{ id: 'id' }, { id: 'otherId' }] });
        });
      });

      describe('when a header is not provided', () => {
        beforeEach(async () => {
          try {
            await controller.getBusinessUnitsForUser({ customer: 'johndoe@mail.com' });
          } catch (e) {
            response = e as BadRequestException;
          }
        });

        it('should call BusinessUnitsUsersService', () => {
          expect(mockBusinessUnitsUsersService.findBusinessUnitsForUser).not.toHaveBeenCalled();
        });

        it('should throw an error', () => {
          expect(response).toEqual(new BadRequestException('User ID missing'));
        });
      });
    });
  });

  describe('preRegistration', () => {
    let response: KeycloakUserCreationResponse | BadRequestException;

    describe('when request pre-registration with the correct body', () => {
      beforeEach(async () => {
        response = await controller.preRegistration({ username: 'username@username.com', rut: 'rut', firstName: 'User', lastName: 'Name', phone: '12345678911', password: 'pass' });
      });

      it('should call mockBusinessUnitsUsersService', () => {
        expect(mockBusinessUnitsUsersService.preRegistration).toHaveBeenCalledWith({
          username: 'username@username.com',
          rut: 'rut',
          firstName: 'User',
          lastName: 'Name',
          phone: '12345678911',
          password: 'pass'
        });
      });

      it('should return expected response with user created', () => {
        expect(response).toEqual({
          message: `Username "username@username.com" successfully created.`,
          status: 201
        });
      });
    });
  });

  describe('registration', () => {
    let response: ConvertedBusinessUnit | BadRequestException;

    describe('when request completeRegistration with the correct body', () => {
      beforeEach(async () => {
        response = await controller.completeRegistration({ username: 'username@username.com', code: '1234' });
      });

      it('should call mockBusinessUnitsUsersService', () => {
        expect(mockBusinessUnitsUsersService.completeRegistration).toHaveBeenCalledWith({ username: 'username@username.com', code: '1234' });
      });

      it('should return expected response with user created', () => {
        expect(response).toEqual({
          id: 'id'
        });
      });
    });
  });

  describe('repRegistration', () => {
    let response: ConvertedBusinessUnit | BadRequestException;
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

    describe('when request repRegistration with the correct body', () => {
      const headers = { 'x-user-roles': ['__INTERNAL__'] };

      beforeEach(async () => {
        response = await controller.repRegistration(headers, body);
      });

      it('should call mockBusinessUnitsUsersService', () => {
        expect(mockBusinessUnitsUsersService.repRegistration).toHaveBeenCalledWith(body, headers[userHeaderRoles]);
      });

      it('should return expected response with user created', () => {
        expect(response).toEqual({
          id: 'id'
        });
      });
    });

    describe('when request repRegistration with the missing headers', () => {
      const headers = {};

      beforeEach(async () => {
        try {
          await controller.repRegistration(headers, body);
        } catch (error) {
          response = error;
        }
      });

      it('should not call mockBusinessUnitsUsersService', () => {
        expect(mockBusinessUnitsUsersService.repRegistration).not.toHaveBeenCalled();
      });

      it('should throw BadRequestException', () => {
        expect(response).toEqual(new BadRequestException('User roles missing'));
      });
    });
  });

  describe('validation', () => {
    let response: UserAndRutValidationResponse;

    describe('when request user and rut validation with the correct body', () => {
      beforeEach(async () => {
        response = await controller.validateUserAndRut({ username: 'user@valid.com', rut: 'valid-rut' });
      });

      it('should call mockBusinessUnitsUsersService', () => {
        expect(mockBusinessUnitsUsersService.validateUserAndRut).toHaveBeenCalledWith({ username: 'user@valid.com', rut: 'valid-rut' });
      });

      it('should return expected response with user created', () => {
        expect(response).toEqual({
          username: 'user@valid.com',
          rut: 'valid-rut',
          buName: 'BU name'
        });
      });
    });
  });
});
