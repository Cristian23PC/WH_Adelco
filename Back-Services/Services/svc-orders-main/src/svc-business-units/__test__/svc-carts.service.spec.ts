global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve()
  })
) as jest.Mock;

const url = 'https://test.com/v1';

const mockConfigService = {
  get: (key: string) => {
    if (key === 'svc-business-units.baseUrl') return url;

    return key;
  }
};

jest.mock('@nestjs/config', () => ({
  ConfigService: jest.fn().mockImplementation(() => mockConfigService)
}));

import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { SvcBusinessUnitsService } from '../svc-business-units.service';
import { ConvertedBusinessUnit } from '../svc-business-units.interface';
import { mockGetById } from '../__mocks__/svc-business-units.mock';

describe('SvcBusinessUnitsService', () => {
  let service: SvcBusinessUnitsService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SvcBusinessUnitsService, ConfigService]
    }).compile();

    service = module.get<SvcBusinessUnitsService>(SvcBusinessUnitsService);
  });

  describe('getById', () => {
    let response: NotFoundException | ConvertedBusinessUnit;

    describe('when succeeds', () => {
      let fetchMock: any = undefined;

      beforeEach(async () => {
        const assetsFetchMock = () =>
          Promise.resolve({
            ok: true,
            status: 200,
            json: async () => mockGetById
          } as Response);
        fetchMock = jest.spyOn(global, 'fetch').mockImplementation(assetsFetchMock);
        response = await service.getById('business-unit-id', 'username@username.com', ['Roles']);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('should call fetch mock', () => {
        expect(fetchMock).toHaveBeenCalledWith(`${url}/business-unit/business-unit-id`, {
          headers: { 'Content-Type': 'application/json', 'x-user-id': 'username@username.com', 'x-user-roles': '["Roles"]' },
          method: 'GET'
        });
      });

      it('should get an active cart', () => {
        expect(response).toEqual(mockGetById);
      });
    });

    describe('when failure', () => {
      let fetchMock: any = undefined;

      beforeEach(async () => {
        const assetsFetchMock = () =>
          Promise.resolve({
            ok: true,
            status: 200,
            json: async () => ({
              statusCode: 404,
              message: 'Not Found Business units'
            })
          } as Response);
        fetchMock = jest.spyOn(global, 'fetch').mockImplementation(assetsFetchMock);
        try {
          await service.getById('business-unit-id', 'not-active-cart@username.com', ['Roles']);
        } catch (error) {
          response = error;
        }
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('should call fetch mock', () => {
        expect(fetchMock).toHaveBeenCalledWith(`${url}/business-unit/business-unit-id`, {
          headers: { 'Content-Type': 'application/json', 'x-user-id': 'not-active-cart@username.com', 'x-user-roles': '["Roles"]' },
          method: 'GET'
        });
      });

      it('should return error NotFoundException', () => {
        expect(response).toEqual(new NotFoundException('Not Found Business units'));
      });
    });
  });
});
