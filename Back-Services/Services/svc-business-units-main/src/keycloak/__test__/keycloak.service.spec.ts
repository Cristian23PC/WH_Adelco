global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve()
  })
) as jest.Mock;

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

    if (key === 'keycloak.maxVerificationCodeFailures') {
      return 3;
    }

    return key;
  }
};

jest.mock('@nestjs/config', () => ({
  ConfigService: jest.fn().mockImplementation(() => mockConfigService)
}));

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

const mockGenerateVerificationCodeData = jest.fn();
const mockGetVerificationCode = jest.fn(() => ({ verificationCode: 1234 }));

jest.mock('@/common/utils/parser/parser', () => ({ generateVerificationCodeData: mockGenerateVerificationCodeData, getVerificationCode: mockGetVerificationCode }));

import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { KeycloakService } from '../keycloak.service';
import { KeycloakUserCreationResponse, KeycloakToken, KeycloakUser } from '../interfaces/keycloak.interface';
import { keycloakTokenMock, keycloakUserMock } from '../__mocks__/keycloak.mock';
import * as parser from '../../common/utils/parser/parser';
import { HttpException, NotFoundException } from '@nestjs/common';
import { SecretManagerService } from '@/secret-manager';
import { NotificationsService } from '@/notifications';

describe('KeycloakService', () => {
  let service: KeycloakService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KeycloakService, SecretManagerService, NotificationsService, ConfigService]
    }).compile();

    service = module.get<KeycloakService>(KeycloakService);
  });

  describe('getAuthToken', () => {
    const url = 'host/realms/realm/protocol/openid-connect/token';
    const responseFetchMock = {
      method: 'POST',
      headers: {
        Authorization: `Basic Y2xpZW50SWQ6Y2xpZW50U2VjcmV0`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials'
      })
    };
    let response: Error | KeycloakToken;

    describe('when success', () => {
      let fetchMock: any = undefined;

      beforeEach(async () => {
        const assetsFetchMock = () =>
          Promise.resolve({
            ok: true,
            status: 200,
            json: async () => keycloakTokenMock
          } as Response);
        fetchMock = jest.spyOn(global, 'fetch').mockImplementation(assetsFetchMock);
        response = await service.getAuthToken();
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('should call fetch mock', () => {
        expect(fetchMock).toHaveBeenCalledWith(url, responseFetchMock);
      });

      it('should get token', () => {
        expect(response).toEqual(keycloakTokenMock);
      });
    });

    describe('when failure', () => {
      let fetchMock: any = undefined;

      beforeEach(async () => {
        const assetsFetchMock = () =>
          Promise.resolve({
            ok: true,
            status: 500,
            json: async () => ({ errorMessage: 'Server error' })
          } as Response);
        fetchMock = jest.spyOn(global, 'fetch').mockImplementation(assetsFetchMock);
        response = await service.getAuthToken();
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('should call fetch mock', () => {
        expect(fetchMock).toHaveBeenCalledWith(url, responseFetchMock);
      });

      it('should return error 500', () => {
        expect(response).toEqual({ errorMessage: 'Server error' });
      });
    });
  });

  describe('getByUsername', () => {
    let response: Error | KeycloakUser[];

    beforeEach(() => {
      jest.spyOn(service, 'getAuthToken').mockImplementation(() => Promise.resolve({ access_token: 'access_token' } as KeycloakToken));
    });

    describe('when success', () => {
      describe('when find username', () => {
        const username = 'username@username.com';
        let fetchMock: any = undefined;

        beforeEach(async () => {
          const assetsFetchMock = () =>
            Promise.resolve({
              ok: true,
              status: 200,
              json: async () => [keycloakUserMock]
            } as Response);
          fetchMock = jest.spyOn(global, 'fetch').mockImplementation(assetsFetchMock);
          response = await service.getByUsername(username, 'access_token');
        });

        afterEach(() => {
          jest.restoreAllMocks();
        });

        it('should call fetch mock', () => {
          expect(fetchMock).toHaveBeenCalledWith(`host/admin/realms/realm/users?username=${encodeURIComponent(username)}`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer access_token`
            },
            redirect: 'follow'
          });
        });

        it('should get username', () => {
          expect(response).toEqual([keycloakUserMock]);
        });
      });

      describe('when not find username', () => {
        const username = 'nousername@nousername.com';
        let fetchMock: any = undefined;

        beforeEach(async () => {
          const assetsFetchMock = () =>
            Promise.resolve({
              ok: true,
              status: 200,
              json: async () => []
            } as Response);
          fetchMock = jest.spyOn(global, 'fetch').mockImplementation(assetsFetchMock);
          response = await service.getByUsername(username, 'access_token');
        });

        afterEach(() => {
          jest.restoreAllMocks();
        });

        it('should call fetch mock', () => {
          expect(fetchMock).toHaveBeenCalledWith(`host/admin/realms/realm/users?username=${encodeURIComponent(username)}`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer access_token`
            },
            redirect: 'follow'
          });
        });

        it('should get username and return undefined when not find one', () => {
          expect(response).toEqual([]);
        });
      });
    });

    describe('when failure', () => {
      describe('when response is not ok', () => {
        const username = 'failure@failure.com';
        let fetchMock: any = undefined;

        beforeEach(async () => {
          const assetsFetchMock = () =>
            Promise.resolve({
              ok: false,
              status: 500,
              json: async () => ({ errorMessage: 'Server error' })
            } as Response);
          fetchMock = jest.spyOn(global, 'fetch').mockImplementation(assetsFetchMock);
          try {
            await service.getByUsername(username, 'access_token');
          } catch (error) {
            response = error;
          }
        });

        afterEach(() => {
          jest.restoreAllMocks();
        });

        it('should call fetch mock', () => {
          expect(fetchMock).toHaveBeenCalledWith(`host/admin/realms/realm/users?username=${encodeURIComponent(username)}`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer access_token`
            },
            redirect: 'follow'
          });
        });

        it('should thrown an Error', () => {
          expect(response).toEqual(new HttpException(undefined, 500));
        });
      });
    });
  });

  describe('createUser', () => {
    let response: Error | KeycloakUserCreationResponse;

    beforeEach(() => {
      jest.spyOn(service, 'getAuthToken').mockImplementation(() => Promise.resolve({ access_token: 'access_token' } as KeycloakToken));
      jest.spyOn(parser, 'generateVerificationCodeData').mockImplementation(() => 'verification_code');
    });

    describe('when success', () => {
      describe('when create an username', () => {
        const username = 'username@username.com';
        const rut = 'rut';
        let fetchMock: any = undefined;

        beforeEach(async () => {
          const assetsFetchMock = () =>
            Promise.resolve({
              ok: true,
              status: 201,
              json: async () => {}
            } as Response);
          fetchMock = jest.spyOn(global, 'fetch').mockImplementation(assetsFetchMock);
          response = await service.createUser({ username, email: username, attributes: { companyRut: [rut] } }, 'access_token');
        });

        afterEach(() => {
          jest.restoreAllMocks();
        });

        it('should call fetch mock', () => {
          expect(fetchMock).toHaveBeenCalledWith('host/admin/realms/realm/users', {
            method: 'POST',
            headers: {
              Authorization: `Bearer access_token`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              username,
              email: username,
              attributes: {
                companyRut: [rut],
                verificationCodeData: 'verification_code',
                remainingAttempts: 3
              },
              enabled: true
            })
          });
        });

        it('should create an username', () => {
          expect(response).toEqual({ message: `Username "${username}" successfully created.`, status: 201 });
        });
      });
    });

    describe('when failure', () => {
      describe('when the username is already created', () => {
        const username = 'usernameexists@usernameexists.com';
        const rut = 'rut';
        let fetchMock: any = undefined;

        beforeEach(async () => {
          const assetsFetchMock = () =>
            Promise.resolve({
              ok: false,
              status: 409,
              statusText: 'Username already exists'
            } as Response);
          fetchMock = jest.spyOn(global, 'fetch').mockImplementation(assetsFetchMock);
          try {
            await service.createUser({ username, email: username, attributes: { companyRut: [rut] } }, 'access_token');
          } catch (e) {
            response = e as Error;
          }
        });

        afterEach(() => {
          jest.restoreAllMocks();
        });

        it('should call fetch mock', () => {
          expect(fetchMock).toHaveBeenCalledWith('host/admin/realms/realm/users', {
            method: 'POST',
            headers: {
              Authorization: `Bearer access_token`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              username,
              email: username,
              attributes: {
                companyRut: [rut],
                verificationCodeData: 'verification_code',
                remainingAttempts: 3
              },
              enabled: true
            })
          });
        });

        it('should return error message when username already exists', () => {
          expect(response).toEqual(new Error('Username already exists'));
        });
      });

      describe('when server fail', () => {
        const username = 'failure@failure.com';
        const rut = 'rut';
        let fetchMock: any = undefined;

        beforeEach(async () => {
          const assetsFetchMock = () =>
            Promise.resolve({
              ok: false,
              status: 500,
              statusText: 'Server error'
            } as Response);
          fetchMock = jest.spyOn(global, 'fetch').mockImplementation(assetsFetchMock);
          try {
            await service.createUser({ username, email: username, attributes: { companyRut: [rut] } }, 'access_token');
          } catch (e) {
            response = e as Error;
          }
        });

        afterEach(() => {
          jest.restoreAllMocks();
        });

        it('should call fetch mock', () => {
          expect(fetchMock).toHaveBeenCalledWith('host/admin/realms/realm/users', {
            method: 'POST',
            headers: {
              Authorization: `Bearer access_token`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              username,
              email: username,
              attributes: {
                companyRut: [rut],
                verificationCodeData: 'verification_code',
                remainingAttempts: 3
              },
              enabled: true
            })
          });
        });

        it('should return error 500', () => {
          expect(response).toEqual(new Error('Server error'));
        });
      });
    });
  });

  describe('updateUser', () => {
    let response: void | HttpException;
    const body = { attributes: { companyName: ['test'] }, emailVerified: true };

    describe('when success', () => {
      describe('when update the username with attributes', () => {
        const userId = 'username-id';
        let fetchMock: any = undefined;

        beforeEach(async () => {
          const assetsFetchMock = () =>
            Promise.resolve({
              ok: true,
              status: 201,
              json: async () => {}
            } as Response);

          fetchMock = jest.spyOn(global, 'fetch').mockImplementation(assetsFetchMock);
          response = await service.updateUser(userId, 'access_token', body);
        });

        afterEach(() => {
          jest.restoreAllMocks();
        });

        it('should call fetch mock', () => {
          expect(fetchMock).toHaveBeenCalledWith(`host/admin/realms/realm/users/${userId}`, {
            body: JSON.stringify(body),
            headers: { Authorization: 'Bearer access_token', 'Content-Type': 'application/json' },
            method: 'PUT'
          });
        });

        it('should update a customer with attributes', () => {
          expect(response).toBeUndefined();
        });
      });
    });

    describe('when failure', () => {
      describe('when response is not ok', () => {
        const userId = 'username-id';
        let fetchMock: any = undefined;

        beforeEach(async () => {
          const assetsFetchMock = () =>
            Promise.resolve({
              ok: false,
              status: 201,
              json: async () => {}
            } as Response);
          fetchMock = jest.spyOn(global, 'fetch').mockImplementation(assetsFetchMock);
          try {
            await service.updateUser(userId, 'access_token', body);
          } catch (error) {
            response = error;
          }
        });

        afterEach(() => {
          jest.restoreAllMocks();
        });

        it('should call fetch mock', () => {
          expect(fetchMock).toHaveBeenCalledWith(`host/admin/realms/realm/users/${userId}`, {
            body: JSON.stringify(body),
            headers: { Authorization: 'Bearer access_token', 'Content-Type': 'application/json' },
            method: 'PUT'
          });
        });

        it('should expect an Error', () => {
          expect(response).toEqual(new HttpException(undefined, 201));
        });
      });
    });
  });

  describe('resetPassword', () => {
    let response: void | HttpException;

    describe('when success', () => {
      describe('when user reset his password', () => {
        const userId = 'username-id';
        let fetchMock: any = undefined;

        beforeEach(async () => {
          const assetsFetchMock = () =>
            Promise.resolve({
              ok: true,
              status: 201,
              json: async () => {}
            } as Response);

          fetchMock = jest.spyOn(global, 'fetch').mockImplementation(assetsFetchMock);
          response = await service.resetPassword(userId, 'rawPassword', 'access_token');
        });

        afterEach(() => {
          jest.restoreAllMocks();
        });

        it('should call fetch mock', () => {
          expect(fetchMock).toHaveBeenCalledWith(`host/admin/realms/realm/users/${userId}/reset-password`, {
            body: JSON.stringify({
              credentialData: 'password',
              value: 'rawPassword'
            }),
            headers: { Authorization: 'Bearer access_token', 'Content-Type': 'application/json' },
            method: 'PUT'
          });
        });

        it('should reset the user password', () => {
          expect(response).toBeUndefined();
        });
      });
    });

    describe('when failure', () => {
      describe('when response is not ok', () => {
        const userId = 'username-id';
        let fetchMock: any = undefined;

        beforeEach(async () => {
          const assetsFetchMock = () =>
            Promise.resolve({
              ok: false,
              status: 201,
              json: async () => {}
            } as Response);
          fetchMock = jest.spyOn(global, 'fetch').mockImplementation(assetsFetchMock);
          try {
            await service.resetPassword(userId, 'rawPassword', 'access_token');
          } catch (error) {
            response = error;
          }
        });

        afterEach(() => {
          jest.restoreAllMocks();
        });

        it('should call fetch mock', () => {
          expect(fetchMock).toHaveBeenCalledWith(`host/admin/realms/realm/users/${userId}/reset-password`, {
            body: JSON.stringify({
              credentialData: 'password',
              value: 'rawPassword'
            }),
            headers: { Authorization: 'Bearer access_token', 'Content-Type': 'application/json' },
            method: 'PUT'
          });
        });

        it('should expect an Error', () => {
          expect(response).toEqual(new HttpException(undefined, 201));
        });
      });
    });
  });

  describe('generateVerificationCode', () => {
    let response: void | NotFoundException, username: string;
    const accessToken = 'access_token';
    const mockVerificationCodeData = keycloakUserMock.attributes.verificationCodeData;

    let getAuthTokenSpy, getByUsernameSpy, updateUserWithAttributesSpy;

    beforeEach(() => {
      getAuthTokenSpy = jest.spyOn(service, 'getAuthToken').mockImplementation(() => Promise.resolve({ access_token: accessToken } as KeycloakToken));
    });
    describe('when code is generated successfully', () => {
      beforeEach(async () => {
        getByUsernameSpy = jest.spyOn(service, 'getByUsername').mockImplementation(() => Promise.resolve([keycloakUserMock]));
        updateUserWithAttributesSpy = jest.spyOn(service, 'updateUser').mockImplementation(() => Promise.resolve());
        mockGenerateVerificationCodeData.mockReturnValue(mockVerificationCodeData);
        response = await service.generateVerificationCode(username);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      test('should call getAuthToken ', () => {
        expect(getAuthTokenSpy).toHaveBeenCalled();
      });

      test('should call getByUsername', () => {
        expect(getByUsernameSpy).toHaveBeenCalledWith(username, accessToken);
      });

      test('should call updateUserWithAttributes', () => {
        expect(updateUserWithAttributesSpy).toHaveBeenCalledWith(keycloakUserMock.id, accessToken, {
          attributes: { ...keycloakUserMock.attributes, verificationCodeData: [mockVerificationCodeData] }
        });
      });

      test('should call sendNotification', () => {
        expect(mockNotificationsService.sendNotification).toHaveBeenCalledWith({
          to: [{ email: keycloakUserMock.email, name: keycloakUserMock.username }],
          notificationType: 'PASSWORD_RECOVERY_CODE',
          templateData: { code: 1234 }
        });
      });
    });

    describe('when username not found', () => {
      beforeEach(async () => {
        getByUsernameSpy = jest.spyOn(service, 'getByUsername').mockImplementation(() => Promise.resolve([]));
        try {
          response = await service.generateVerificationCode(username);
        } catch (err) {
          response = err;
        }
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      test('should call getAuthToken ', () => {
        expect(getAuthTokenSpy).toHaveBeenCalled();
      });

      test('should call getByUsername', () => {
        expect(getByUsernameSpy).toHaveBeenCalledWith(username, accessToken);
      });

      test('should throw a not found exception', () => {
        expect(response).toBeInstanceOf(NotFoundException);
      });
    });
  });
});
