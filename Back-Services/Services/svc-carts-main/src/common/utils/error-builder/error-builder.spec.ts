import { ApiError, API_ERROR } from '@/common/errors/api.error';
import { ErrorBuilder } from './error-builder';

describe('errorBuilder', () => {
  describe('buildError', () => {
    let error;

    describe('should build an error when API error is thrown', () => {
      describe('when meta provided', () => {
        const expectedResponse = new ApiError({
          status: 500,
          code: API_ERROR,
          title: 'Api Error',
          detail: 'Api Error',
          meta: 'error'
        });
        beforeAll(() => {
          error = ErrorBuilder.buildError('apiError', { statusCode: 500, error: 'error' });
        });
        it('error should match expected response', () => {
          expect(error).toEqual(expectedResponse);
        });
      });

      describe('when meta not provided', () => {
        const expectedResponse = new ApiError({
          status: 400,
          code: API_ERROR,
          title: 'Api Error',
          detail: 'Api Error'
        });
        beforeAll(() => {
          error = ErrorBuilder.buildError('apiError') as ApiError;
        });
        it('error should match expected response', () => {
          expect(error).toEqual(expectedResponse);
        });
      });
    });

    describe('when productNotFound error', () => {
      const expectedResponse = new ApiError({
        status: 400,
        code: 'Carts-034',
        title: 'Product not found',
        detail: 'Product not found',
        meta: { sku: 'someSku' }
      });
      beforeAll(() => {
        error = ErrorBuilder.buildError('productNotFound', { sku: 'someSku' });
      });
      it('error should match expected response', () => {
        expect(error).toEqual(expectedResponse);
      });
    });

    describe('when buNotFound error', () => {
      const expectedResponse = new ApiError({
        status: 404,
        code: 'Carts-035',
        title: 'Business Unit not found',
        detail: 'Business Unit found',
        meta: { id: 'buId' }
      });
      beforeAll(() => {
        error = ErrorBuilder.buildError('buNotFound', { id: 'buId' });
      });
      it('error should match expected response', () => {
        expect(error).toEqual(expectedResponse);
      });
    });

    describe('when noStock error', () => {
      const expectedResponse = new ApiError({
        status: 400,
        code: 'Carts-026',
        title: 'There are not enough units in stock',
        detail: 'There are not enough units in stock',
        meta: { sku: 'someSku' }
      });
      beforeAll(() => {
        error = ErrorBuilder.buildError('noStock', { sku: 'someSku' });
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

  describe('buildCommercetoolsCode', () => {
    it('should pass for AnonymousIdAlreadyInUse and return Carts-001', () => {
      expect(ErrorBuilder.buildCommercetoolsCode('AnonymousIdAlreadyInUse')).toEqual('Carts-001');
    });

    it('should pass for DuplicateField and return Carts-002', () => {
      expect(ErrorBuilder.buildCommercetoolsCode('DuplicateField')).toEqual('Carts-002');
    });

    it('should pass for DuplicateFieldWithConflictingResource and return Carts-003', () => {
      expect(ErrorBuilder.buildCommercetoolsCode('DuplicateFieldWithConflictingResource')).toEqual('Carts-003');
    });

    it('should pass for FeatureRemoved and return Carts-004', () => {
      expect(ErrorBuilder.buildCommercetoolsCode('FeatureRemoved')).toEqual('Carts-004');
    });

    it('should pass for InvalidInput and return Carts-005', () => {
      expect(ErrorBuilder.buildCommercetoolsCode('InvalidInput')).toEqual('Carts-005');
    });

    it('should pass for InvalidJsonInput and return Carts-006', () => {
      expect(ErrorBuilder.buildCommercetoolsCode('InvalidJsonInput')).toEqual('Carts-006');
    });

    it('should pass for InvalidOperation and return Carts-007', () => {
      expect(ErrorBuilder.buildCommercetoolsCode('InvalidOperation')).toEqual('Carts-007');
    });

    it('should pass for InvalidField and return Carts-008', () => {
      expect(ErrorBuilder.buildCommercetoolsCode('InvalidField')).toEqual('Carts-008');
    });

    it('should pass for InternalConstraintViolated and return Carts-009', () => {
      expect(ErrorBuilder.buildCommercetoolsCode('InternalConstraintViolated')).toEqual('Carts-009');
    });

    it('should pass for MaxResourceLimitExceeded and return Carts-010', () => {
      expect(ErrorBuilder.buildCommercetoolsCode('MaxResourceLimitExceeded')).toEqual('Carts-010');
    });

    it('should pass for MoneyOverflow and return Carts-011', () => {
      expect(ErrorBuilder.buildCommercetoolsCode('MoneyOverflow')).toEqual('Carts-011');
    });

    it('should pass for ObjectNotFound and return Carts-012', () => {
      expect(ErrorBuilder.buildCommercetoolsCode('ObjectNotFound')).toEqual('Carts-012');
    });

    it('should pass for ReferenceExists and return Carts-013', () => {
      expect(ErrorBuilder.buildCommercetoolsCode('ReferenceExists')).toEqual('Carts-013');
    });

    it('should pass for ReferencedResourceNotFound and return Carts-014', () => {
      expect(ErrorBuilder.buildCommercetoolsCode('ReferencedResourceNotFound')).toEqual('Carts-014');
    });

    it('should pass for RequiredField and return Carts-015', () => {
      expect(ErrorBuilder.buildCommercetoolsCode('RequiredField')).toEqual('Carts-015');
    });

    it('should pass for ResourceSizeLimitExceeded and return Carts-016', () => {
      expect(ErrorBuilder.buildCommercetoolsCode('ResourceSizeLimitExceeded')).toEqual('Carts-016');
    });

    it('should pass for SemanticError and return Carts-017', () => {
      expect(ErrorBuilder.buildCommercetoolsCode('SemanticError')).toEqual('Carts-017');
    });

    it('should pass for SyntaxError and return Carts-018', () => {
      expect(ErrorBuilder.buildCommercetoolsCode('SyntaxError')).toEqual('Carts-018');
    });

    it('should pass for QueryTimedOut and return Carts-019', () => {
      expect(ErrorBuilder.buildCommercetoolsCode('QueryTimedOut')).toEqual('Carts-019');
    });

    it('should pass for ResourceNotFound and return Carts-020', () => {
      expect(ErrorBuilder.buildCommercetoolsCode('ResourceNotFound')).toEqual('Carts-020');
    });

    it('should pass for ConcurrentModification and return Carts-021', () => {
      expect(ErrorBuilder.buildCommercetoolsCode('ConcurrentModification')).toEqual('Carts-021');
    });

    it('should pass for General and return Carts-022', () => {
      expect(ErrorBuilder.buildCommercetoolsCode('General')).toEqual('Carts-022');
    });

    it('should pass for BadGateway and return Carts-023', () => {
      expect(ErrorBuilder.buildCommercetoolsCode('BadGateway')).toEqual('Carts-023');
    });

    it('should pass for OverCapacity and return Carts-024', () => {
      expect(ErrorBuilder.buildCommercetoolsCode('OverCapacity')).toEqual('Carts-024');
    });

    it('should pass for PendingOperation and return Carts-025', () => {
      expect(ErrorBuilder.buildCommercetoolsCode('PendingOperation')).toEqual('Carts-025');
    });

    it('should pass for OutOfStock and return Carts-026', () => {
      expect(ErrorBuilder.buildCommercetoolsCode('OutOfStock')).toEqual('Carts-026');
    });

    it('should pass for PriceChanged and return Carts-027', () => {
      expect(ErrorBuilder.buildCommercetoolsCode('PriceChanged')).toEqual('Carts-027');
    });

    it('should pass for DiscountCodeNonApplicable and return Carts-028', () => {
      expect(ErrorBuilder.buildCommercetoolsCode('DiscountCodeNonApplicable')).toEqual('Carts-028');
    });

    it('should pass for ShippingMethodDoesNotMatchCart and return Carts-029', () => {
      expect(ErrorBuilder.buildCommercetoolsCode('ShippingMethodDoesNotMatchCart')).toEqual('Carts-029');
    });

    it('should pass for InvalidItemShippingDetails and return Carts-030', () => {
      expect(ErrorBuilder.buildCommercetoolsCode('InvalidItemShippingDetails')).toEqual('Carts-030');
    });

    it('should pass for MatchingPriceNotFound and return Carts-031', () => {
      expect(ErrorBuilder.buildCommercetoolsCode('MatchingPriceNotFound')).toEqual('Carts-031');
    });

    it('should pass for MissingTaxRateForCountry and return Carts-032', () => {
      expect(ErrorBuilder.buildCommercetoolsCode('MissingTaxRateForCountry')).toEqual('Carts-032');
    });

    it('should pass for CountryNotConfiguredInStore and return Carts-033', () => {
      expect(ErrorBuilder.buildCommercetoolsCode('CountryNotConfiguredInStore')).toEqual('Carts-033');
    });

    it('should pass for default and return code', () => {
      expect(ErrorBuilder.buildCommercetoolsCode('Code')).toEqual('Code');
    });

    it('should pass for default and return undefined', () => {
      expect(ErrorBuilder.buildCommercetoolsCode()).toBeUndefined();
    });
  });
});
