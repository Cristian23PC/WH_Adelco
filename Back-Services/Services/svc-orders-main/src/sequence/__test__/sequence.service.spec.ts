const mockCustomObjectsRepository = {
  getByContainerAndKey: jest.fn((container, key) => {
    switch (key) {
      case 'error':
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
      default:
        return Promise.resolve(mockSequenceResponse);
    }
  }),
  create: jest.fn(({ body }: { body: CustomObjectDraft }) => {
    switch (body.key) {
      case 'create-error':
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
      default:
        return Promise.resolve(mockNewSequenceResponse);
    }
  })
};

jest.mock('commercetools-sdk-repositories', () => ({
  CustomObjectsRepository: jest.fn().mockImplementation(() => mockCustomObjectsRepository)
}));

const sequenceContainer = 'sequence';
const orderNumberKey = 'orderNumber';
const mockConfigService = {
  get: (key: string) => {
    if (key === 'custom-object-sequence.sequenceContainer') return sequenceContainer;
    if (key === 'custom-object-sequence.orderNumberKey') return orderNumberKey;
    if (key === 'custom-object-sequence.create-error') return 'create-error';
    if (key === 'custom-object-sequence.error') return 'error';

    return key;
  }
};

jest.mock('@nestjs/config', () => ({
  ConfigService: jest.fn().mockImplementation(() => mockConfigService)
}));

jest.useFakeTimers().setSystemTime(new Date('2023-03-01'));

import { CommercetoolsError } from '@/nest-commercetools/errors';
import { CustomObjectDraft } from '@commercetools/platform-sdk';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { CustomObjectsRepository } from 'commercetools-sdk-repositories';
import { mockNewSequenceResponse, mockSequenceResponse } from '../__mocks__/sequence.mocks';
import { SequenceService } from '../sequence.service';

describe('SequenceService', () => {
  let service: SequenceService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SequenceService, CustomObjectsRepository, ConfigService]
    }).compile();

    service = module.get<SequenceService>(SequenceService);
  });

  describe('getOrderNumber', () => {
    let response: CommercetoolsError | string;

    describe('when customObjectRepository.getByContainerAndKey succeeds', () => {
      beforeEach(async () => {
        response = await service.getOrderNumber('orderNumberKey');
      });

      it('should call customObjectRepository.getByContainerAndKey', () => {
        expect(mockCustomObjectsRepository.getByContainerAndKey).toHaveBeenCalledWith(sequenceContainer, orderNumberKey);
      });

      it('should return customObjectRepository.getByContainerAndKey response', () => {
        expect(response).toEqual('2300000002');
      });
    });

    describe('when customObjectRepository.getByContainerAndKey rejects', () => {
      beforeEach(async () => {
        try {
          await service.getOrderNumber('error');
        } catch (e) {
          response = e as CommercetoolsError;
        }
      });

      it('should call customObjectRepository.getByContainerAndKey', () => {
        expect(mockCustomObjectsRepository.getByContainerAndKey).toHaveBeenCalledWith(sequenceContainer, 'error');
      });

      it('should throw customObjectRepository.getByContainerAndKey error', () => {
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

    describe('when customObjectRepository.create rejects', () => {
      beforeEach(async () => {
        try {
          await service.getOrderNumber('create-error');
        } catch (e) {
          response = e as CommercetoolsError;
        }
      });

      it('should call customObjectRepository.create', () => {
        expect(mockCustomObjectsRepository.create).toHaveBeenCalledWith({ body: mockNewSequenceResponse });
      });

      it('should throw customObjectRepository.create error', () => {
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
