const mockConfigService = {
  get: jest.fn()
};
jest.mock('@nestjs/config', () => ({
  ConfigService: jest.fn().mockImplementation(() => mockConfigService)
}));

const mockSecretManagerService = {
  get: jest.fn()
};
jest.mock('../secret-manager', () => ({
  SecretManagerService: jest.fn().mockImplementation(() => mockSecretManagerService)
}));

import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { SecretManagerService } from '../secret-manager';

import { CommercetoolsConfigService } from './commercetools-config.service';

describe('CommercetoolsConfigService', () => {
  let service: CommercetoolsConfigService;

  beforeAll(async () => {
    mockConfigService.get.mockReturnValueOnce({
      auth: { projectKey: 'projectKey' },
      projectKey: 'projectKey',
      google: {
        project: 'project',
        ctCredentialsSecretKey: 'ctCredentialsSecretKey'
      }
    });
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommercetoolsConfigService, ConfigService, SecretManagerService]
    }).compile();

    service = module.get<CommercetoolsConfigService>(CommercetoolsConfigService);
  });

  describe('createNestCommercetoolsOptions', () => {
    let commercetoolsOptions;

    describe('when secretManagerService.get rejects', () => {
      beforeEach(async () => {
        mockSecretManagerService.get.mockRejectedValueOnce(new Error());
        try {
          commercetoolsOptions = await service.createNestCommercetoolsOptions();
        } catch (error) {
          commercetoolsOptions = error;
        }
      });

      test('should call secretManagerService.get with ctCredentialsSecretKey', () => {
        expect(mockSecretManagerService.get).toHaveBeenCalledWith('ctCredentialsSecretKey');
      });

      test('should throw secretManagerService.get error', () => {
        expect(commercetoolsOptions).toBeInstanceOf(Error);
      });
    });

    describe('when secretManagerService.get success', () => {
      beforeEach(async () => {
        mockSecretManagerService.get.mockResolvedValueOnce({
          CT_CLIENT_ID: 'clientId',
          CT_CLIENT_SECRET: 'clientSecret'
        });
        commercetoolsOptions = await service.createNestCommercetoolsOptions();
      });

      test('should call secretManagerService.get with ctCredentialsSecretKey', () => {
        expect(mockSecretManagerService.get).toHaveBeenCalledWith('ctCredentialsSecretKey');
      });

      test('should return NestCommercetoolsModuleOptions with meged commercetoolsConfig and secret credentials', () => {
        expect(commercetoolsOptions).toEqual({
          projectKey: 'projectKey',
          auth: {
            projectKey: 'projectKey',
            credentials: {
              clientId: 'clientId',
              clientSecret: 'clientSecret'
            }
          }
        });
      });
    });
  });
});
