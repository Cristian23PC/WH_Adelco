import { mockCommunesResponse } from '../__mocks__/communes.mock';

const mockCommunesService = {
  getCommunes: jest.fn().mockImplementation((regionKey: string) => {
    if (regionKey === 'error') {
      throw new Error('Commercetools error');
    } else if (regionKey === 'no-communes') return [];

    return mockCommunesResponse;
  })
};

jest.mock('../communes.service', () => ({
  CommunesService: jest.fn().mockImplementation(() => mockCommunesService)
}));

import { CommunesController } from '../communes.controller';
import { CommunesService } from '../communes.service';
import { Test, TestingModule } from '@nestjs/testing';
import { Commune } from '../models';
import { CacheModule } from '@nestjs/common';

describe('CommunesController', () => {
  let controller: CommunesController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      controllers: [CommunesController],
      providers: [CommunesService]
    }).compile();

    controller = module.get<CommunesController>(CommunesController);
  });

  describe('getCommunes', () => {
    let regionKey: string;
    let response: Commune[] | Error;

    describe('when requesting communes with valid regionKey', () => {
      beforeAll(() => {
        regionKey = 'valid';
      });

      beforeEach(async () => {
        response = await controller.getCommunes(regionKey);
      });

      it('should call mockCommunesService.getCommunes', () => {
        expect(mockCommunesService.getCommunes).toHaveBeenCalledWith(regionKey);
      });

      it('should return expected response with communes ', () => {
        expect(response).toEqual(mockCommunesResponse);
      });
    });

    describe('when requesting communes with invalid regionKey', () => {
      beforeAll(() => {
        regionKey = 'no-communes';
      });

      beforeEach(async () => {
        response = await controller.getCommunes(regionKey);
      });

      it('should call mockCommunesService.getCommunes', () => {
        expect(mockCommunesService.getCommunes).toHaveBeenCalledWith(regionKey);
      });

      it('should return expected response with communes ', () => {
        expect(response).toEqual([]);
      });
    });

    describe('when throw an error CT', () => {
      beforeAll(() => {
        regionKey = 'error';
      });

      beforeEach(async () => {
        try {
          await controller.getCommunes(regionKey);
        } catch (error) {
          response = error as Error;
        }
      });

      it('should call mockCommunesService.getCommunes', () => {
        expect(mockCommunesService.getCommunes).toHaveBeenCalledWith(regionKey);
      });

      it('should return expected response with communes ', () => {
        expect(response).toEqual(new Error('Commercetools error'));
      });
    });
  });
});
