import { ApiError, T2_ZONE_OVERLAP_ERROR } from '@/common/errors/api.error';
import { ErrorBuilder } from './error-builder';

describe('errorBuilder', () => {
  let error;

  describe('should build an error when t2z does not match dch', () => {
    describe('when meta provided', () => {
      const expectedResponse = new ApiError({
        status: 500,
        code: T2_ZONE_OVERLAP_ERROR,
        title: 'T2 zone does not match distribution center',
        detail: 'T2 zone does not match distribution center',
        meta: 'error'
      });
      beforeAll(() => {
        error = ErrorBuilder.buildError('t2zOverlapError', { statusCode: 500, error: 'error' });
      });
      it('error should match expected response', () => {
        expect(error).toEqual(expectedResponse);
      });
    });

    describe('when meta not provided', () => {
      const expectedResponse = new ApiError({
        status: 400,
        code: T2_ZONE_OVERLAP_ERROR,
        title: 'T2 zone does not match distribution center',
        detail: 'T2 zone does not match distribution center'
      });
      beforeAll(() => {
        error = ErrorBuilder.buildError('t2zOverlapError') as ApiError;
      });
      it('error should match expected response', () => {
        expect(error).toEqual(expectedResponse);
      });
    });
  });

  describe('should build a generic error', () => {
    const expectedResponse = new ApiError({
      status: 500,
      title: 'Internal server error'
    });
    describe('when undefined', () => {
      beforeAll(() => {
        error = ErrorBuilder.buildError(undefined);
      });
      it('error should match expected response', () => {
        expect(error).toEqual(expectedResponse);
      });
    });

    describe('when invalid error', () => {
      beforeAll(() => {
        error = ErrorBuilder.buildError('invalid') as ApiError;
      });
      it('error should match expected response', () => {
        expect(error).toEqual(expectedResponse);
      });
    });
  });
});
