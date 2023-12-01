const mockCustomObjectsRepository = {
  find: jest.fn(({ queryArgs: { where } }: { queryArgs: { where: string[] } }) => {
    if (where[0].includes('error')) {
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
    }
    if (where[0].includes('notFound')) {
      return Promise.resolve({ results: [] });
    }

    return Promise.resolve({ results: [creditNotesMock] });
  }),
  create: jest.fn(() => {
    return Promise.resolve(creditNotesMock);
  })
};

jest.mock('commercetools-sdk-repositories', () => ({
  CustomObjectsRepository: jest.fn().mockImplementation(() => mockCustomObjectsRepository)
}));

const mockConfigService = {
  get: (key: string) => {
    switch (key) {
      case 'custom-object.creditNotesContainer':
        return 'credit-notes';
      default:
        return key;
    }
  }
};

jest.mock('@nestjs/config', () => ({
  ConfigService: jest.fn().mockImplementation(() => mockConfigService)
}));

import { CommercetoolsError } from '@/nest-commercetools/errors';
import { CustomObject } from '@commercetools/platform-sdk';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { CustomObjectsRepository } from 'commercetools-sdk-repositories';
import { CreditNotesService } from '../credit-notes.service';
import { creditNotesMock } from '../__mocks__/credit-notes.mock';
import { ErrorBuilder } from '@/common/utils/error-builder/error-builder';

describe('CustomObjects', () => {
  let service: CreditNotesService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreditNotesService, CustomObjectsRepository, ConfigService]
    }).compile();

    service = module.get<CreditNotesService>(CreditNotesService);
  });

  describe('getByCreditNotesKeys', () => {
    let response: CustomObject[];

    describe(`when key's matches`, () => {
      beforeEach(async () => {
        response = await service.getByCreditNotesKeys(['dteNumber']);
      });

      it('should call customObjectRepository.find', () => {
        expect(mockCustomObjectsRepository.find).toHaveBeenCalledWith({ queryArgs: { where: [`value(dteNumber in ("dteNumber"))`, `container="credit-notes"`] } });
      });

      it('should return customObjectRepository.find response', () => {
        expect(response).toEqual([creditNotesMock]);
      });
    });

    describe(`when key's not match matches`, () => {
      beforeEach(async () => {
        try {
          await service.getByCreditNotesKeys(['notFound']);
        } catch (error) {
          response = error;
        }
      });

      it('should call customObjectRepository.find', () => {
        expect(mockCustomObjectsRepository.find).toHaveBeenCalledWith({ queryArgs: { where: [`value(dteNumber in ("notFound"))`, `container="credit-notes"`] } });
      });

      it('should throw an error', () => {
        expect(response).toEqual(ErrorBuilder.buildError('creditNotesNotFound', JSON.stringify(['notFound'])));
      });
    });

    describe(`when commercetools throw an error`, () => {
      beforeEach(async () => {
        try {
          await service.getByCreditNotesKeys(['error']);
        } catch (error) {
          response = error;
        }
      });

      it('should call customObjectRepository.find', () => {
        expect(mockCustomObjectsRepository.find).toHaveBeenCalledWith({ queryArgs: { where: [`value(dteNumber in ("error"))`, `container="credit-notes"`] } });
      });

      it('should throw an error', () => {
        expect(response).toEqual(
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
      });
    });
  });
});
