import { ApiError } from '@/common/errors/api.error';
import { ErrorBuilder } from './error-builder';

describe('errorBuilder', () => {
  let error: ApiError;

  describe('should build a "invalidRut" error', () => {
    const expectedResponse = new ApiError({
      status: 409,
      code: 'BU-001',
      title: 'Invalid RUT',
      detail: 'RUT is not valid or does not exist.'
    });

    beforeAll(() => {
      error = ErrorBuilder.buildError('invalidRut');
    });

    it('error should match expected response', () => {
      expect(error).toEqual(expectedResponse);
    });
  });

  describe('should build a "keycloakUserAlreadyRegister" error', () => {
    const expectedResponse = new ApiError({
      status: 409,
      code: 'BU-002',
      title: 'Keycloak user already registered.',
      detail: 'User already registered. Please recover your password.'
    });

    beforeAll(() => {
      error = ErrorBuilder.buildError('keycloakUserAlreadyRegister');
    });

    it('error should match expected response', () => {
      expect(error).toEqual(expectedResponse);
    });
  });

  describe('should build a "usernameAlreadyRegistered" error', () => {
    const expectedResponse = new ApiError({
      status: 409,
      code: 'BU-003',
      title: 'User is already associated with another Company.',
      detail: 'User is already associated with another Company.'
    });

    beforeAll(() => {
      error = ErrorBuilder.buildError('usernameAlreadyRegistered');
    });

    it('error should match expected response', () => {
      expect(error).toEqual(expectedResponse);
    });
  });

  describe('should build a "rutAlreadyRegistered" error', () => {
    const expectedResponse = new ApiError({
      status: 409,
      code: 'BU-004',
      title: 'RUT is already registered.',
      detail: 'RUT is already registered. Please choose another email.'
    });

    beforeAll(() => {
      error = ErrorBuilder.buildError('rutAlreadyRegistered');
    });

    it('error should match expected response', () => {
      expect(error).toEqual(expectedResponse);
    });
  });

  describe('should build a "buNotAssociateCustomer" error', () => {
    const expectedResponse = new ApiError({
      status: 400,
      code: 'BU-005',
      title: 'Customer not associated to Business Unit or lacks access',
      detail: 'Customer is not associated to this Business Unit or lacks permissions to perform the action'
    });

    beforeAll(() => {
      error = ErrorBuilder.buildError('buNotAssociateCustomer');
    });

    it('error should match expected response', () => {
      expect(error).toEqual(expectedResponse);
    });
  });

  describe('should build a "noDeliveryZoneAssociated" error', () => {
    const expectedResponse = new ApiError({
      status: 400,
      code: 'BU-014',
      title: 'Delivery zone no associated',
      detail: 'There is no delivery zone associated with the provided address.'
    });

    beforeAll(() => {
      error = ErrorBuilder.buildError('noDeliveryZoneAssociated');
    });

    it('error should match expected response', () => {
      expect(error).toEqual(expectedResponse);
    });
  });

  describe('should build a "businessUnitDoesNotExist" error', () => {
    const expectedResponse = new ApiError({
      status: 404,
      code: 'BU-013',
      title: 'Business Unit does not exist',
      detail: 'Business Unit does not exist for the id provided'
    });

    beforeAll(() => {
      error = ErrorBuilder.buildError('businessUnitDoesNotExist');
    });

    it('error should match expected response', () => {
      expect(error).toEqual(expectedResponse);
    });
  });

  describe('should build a "multipleBUAssociated" error', () => {
    const expectedResponse = new ApiError({
      status: 400,
      code: 'BU-015',
      title: 'RUT with company have more than one business unit associated',
      detail: 'RUT with company have more than one business unit associated'
    });

    beforeAll(() => {
      error = ErrorBuilder.buildError('multipleBUAssociated');
    });

    it('error should match expected response', () => {
      expect(error).toEqual(expectedResponse);
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
