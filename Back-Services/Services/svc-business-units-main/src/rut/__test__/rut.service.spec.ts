const mockConfigService = {
  get: (key: string) => key
};

jest.mock('@nestjs/config', () => ({
  ConfigService: jest.fn().mockImplementation(() => mockConfigService)
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve()
  })
) as jest.Mock;

import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { ErrorBuilder } from '@/common/utils/error-builder/error-builder';
import { RutService } from '../rut.service';

describe('RutService', () => {
  let service: RutService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RutService, ConfigService]
    }).compile();
    service = module.get<RutService>(RutService);
  });

  describe('getBusinessNameFromValidRut', () => {
    describe('when RUT is invalid', () => {
      it('should throw invalidRut error', async () => {
        jest.spyOn(global, 'fetch').mockResolvedValueOnce({
          ok: true,
          status: 422,
          json: async () => ({ statusCode: 422 })
        } as Response);

        await expect(service.getBusinessNameFromValidRut('invalidRut')).rejects.toThrow(ErrorBuilder.buildError('invalidRut'));
      });
    });

    describe('when external service error', () => {
      it('should throw externalServiceError', async () => {
        jest.spyOn(global, 'fetch').mockResolvedValueOnce({
          ok: true,
          status: 400,
          json: async () => ({ statusCode: 400 })
        } as Response);

        await expect(service.getBusinessNameFromValidRut('rut')).rejects.toThrow(ErrorBuilder.buildError('externalServiceError'));
      });
    });

    describe('when no associated BU', () => {
      it('should throw noAssociatedBU error', async () => {
        jest.spyOn(global, 'fetch').mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({ statusCode: 200, payload: null })
        } as Response);

        await expect(service.getBusinessNameFromValidRut('rut')).rejects.toThrow(ErrorBuilder.buildError('noAssociatedBU'));
      });
    });

    describe('when RUT is valid and has an associated BU', () => {
      it('should return businessName', async () => {
        const expectedBusinessName = 'Test Business';
        jest.spyOn(global, 'fetch').mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({ statusCode: 200, payload: { businessName: expectedBusinessName } })
        } as Response);

        const businessName = await service.getBusinessNameFromValidRut('validRut');
        expect(businessName).toBe(expectedBusinessName);
      });
    });
  });
});
