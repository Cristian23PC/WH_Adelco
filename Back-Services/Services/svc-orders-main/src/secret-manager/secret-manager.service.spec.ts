const mockSecretManagerServiceClient = {
  accessSecretVersion: jest.fn()
};
jest.mock('@google-cloud/secret-manager', () => ({
  SecretManagerServiceClient: jest.fn().mockImplementation(() => mockSecretManagerServiceClient)
}));

const GCP_SCRT_MANAGER_MODULE_OPTIONS = 'GCP_SCRT_MANAGER_MODULE_OPTIONS';
jest.mock('./secret-manager.constants', () => ({
  GCP_SCRT_MANAGER_MODULE_OPTIONS
}));

import { Test, TestingModule } from '@nestjs/testing';
import { SecretManagerService } from './secret-manager.service';

describe('SecretManagerService', () => {
  let options;
  let service: SecretManagerService;

  beforeAll(async () => {
    options = { projectId: 'projectId' };
    const module: TestingModule = await Test.createTestingModule({
      providers: [SecretManagerService, { provide: GCP_SCRT_MANAGER_MODULE_OPTIONS, useValue: options }]
    }).compile();

    service = module.get<SecretManagerService>(SecretManagerService);
  });

  describe('get', () => {
    let secret;
    let data;

    beforeAll(() => {
      secret = 'secret';
    });

    describe('when JSON.parse succeeds', () => {
      beforeEach(async () => {
        mockSecretManagerServiceClient.accessSecretVersion.mockResolvedValueOnce([{ payload: { data: '{"foo":"bar"}' } }]);

        data = await service.get(secret);
      });

      test('should call secretManagerServiceClient.accessSecretVersion with name containing projectId, secret and latest version', () => {
        expect(mockSecretManagerServiceClient.accessSecretVersion).toHaveBeenCalledWith({
          name: `projects/${options.projectId}/secrets/${secret}/versions/latest`
        });
      });

      test('should return JSON parsed payload data', () => {
        expect(data).toEqual({ foo: 'bar' });
      });
    });

    describe('when JSON.parse SyntaxError', () => {
      beforeEach(async () => {
        mockSecretManagerServiceClient.accessSecretVersion.mockResolvedValueOnce([{ payload: { data: 'foo' } }]);

        data = await service.get(secret);
      });

      test('should call secretManagerServiceClient.accessSecretVersion with name containing projectId, secret and latest version', () => {
        expect(mockSecretManagerServiceClient.accessSecretVersion).toHaveBeenCalledWith({
          name: `projects/${options.projectId}/secrets/${secret}/versions/latest`
        });
      });

      test('should return payload data', () => {
        expect(data).toEqual('foo');
      });
    });
  });
});
