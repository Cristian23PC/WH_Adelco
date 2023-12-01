const mockPaymentsRepository = {
  create: jest.fn(({ body }: { body: PaymentDraft }) => {
    switch (body.paymentStatus.interfaceText) {
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
        return Promise.resolve(mockPaymentResponse);
    }
  }),
  updateById: jest.fn((id: string) => {
    switch (id) {
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
        return Promise.resolve(mockPaymentResponse);
    }
  })
};

jest.mock('commercetools-sdk-repositories', () => ({
  PaymentsRepository: jest.fn().mockImplementation(() => mockPaymentsRepository)
}));

import { CommercetoolsError } from '@/nest-commercetools/errors';
import { Payment, PaymentDraft } from '@commercetools/platform-sdk';
import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsRepository } from 'commercetools-sdk-repositories';
import { PaymentsService } from '../payments.service';
import { mockPaymentDraft, mockPaymentResponse } from '../__mocks__/payments.mocks';

describe('PaymentsService', () => {
  let service: PaymentsService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentsService, PaymentsRepository]
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
  });

  describe('create', () => {
    let response: CommercetoolsError | Payment;

    describe('when PaymentsRepository.create succeeds', () => {
      beforeEach(async () => {
        response = await service.create(mockPaymentDraft);
      });

      it('should call PaymentsRepository.create', () => {
        expect(mockPaymentsRepository.create).toHaveBeenCalledWith({ body: mockPaymentDraft });
      });

      it('should return PaymentsRepository.create response', () => {
        expect(response).toEqual(mockPaymentResponse);
      });
    });

    describe('when PaymentsRepository.create rejects', () => {
      beforeEach(async () => {
        try {
          await service.create({ ...mockPaymentDraft, paymentStatus: { interfaceText: 'error' } });
        } catch (e) {
          response = e as CommercetoolsError;
        }
      });

      it('should call PaymentsRepository.create', () => {
        expect(mockPaymentsRepository.create).toHaveBeenCalledWith({ body: { ...mockPaymentDraft, paymentStatus: { interfaceText: 'error' } } });
      });

      it('should throw PaymentsRepository.create error', () => {
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

  describe('update', () => {
    let response: CommercetoolsError | Payment;

    describe('when PaymentsRepository.update succees', () => {
      beforeEach(async () => {
        response = await service.update('paymentId', {
          version: 1,
          actions: [
            {
              action: 'changeAmountPlanned',
              amount: {
                currencyCode: 'CLP',
                centAmount: 10
              }
            }
          ]
        });
      });

      it('should call PaymentsRepository.updateById', () => {
        expect(mockPaymentsRepository.updateById).toHaveBeenCalledWith('paymentId', {
          body: { actions: [{ action: 'changeAmountPlanned', amount: { centAmount: 10, currencyCode: 'CLP' } }], version: 1 }
        });
      });

      it('should return PaymentsRepository.update response', () => {
        expect(response).toEqual(mockPaymentResponse);
      });
    });

    describe('when PaymentsRepository.update rejects', () => {
      beforeEach(async () => {
        try {
          await service.update('error', {
            version: 1,
            actions: [
              {
                action: 'changeAmountPlanned',
                amount: {
                  currencyCode: 'CLP',
                  centAmount: 10
                }
              }
            ]
          });
        } catch (e) {
          response = e as CommercetoolsError;
        }
      });

      it('should call PaymentsRepository.updateById', () => {
        expect(mockPaymentsRepository.updateById).toHaveBeenCalledWith('error', {
          body: { actions: [{ action: 'changeAmountPlanned', amount: { centAmount: 10, currencyCode: 'CLP' } }], version: 1 }
        });
      });

      it('should throw PaymentsRepository.update error', () => {
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
