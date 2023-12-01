import { ApiError } from '@/common/errors/api.error';
import { ErrorBuilder } from '../error-builder';

describe('errorBuilder', () => {
  describe('buildError', () => {
    let error: ApiError;

    describe('should build a "invalidStockOrPrice" error', () => {
      const expectedResponse = new ApiError({
        status: 400,
        code: 'Orders-034',
        title: 'Invalid Stock or Price',
        detail: 'Price or stock changed and the cart was updated.'
      });

      beforeAll(() => {
        error = ErrorBuilder.buildError('invalidStockOrPrice');
      });

      it('error should match expected response', () => {
        expect(error).toEqual(expectedResponse);
      });
    });

    describe('should build a "paymentNotAssociated" error', () => {
      const expectedResponse = new ApiError({
        status: 400,
        code: 'Orders-035',
        title: 'Payment not associated to the order',
        detail: 'The payment is not associated with the order'
      });

      beforeAll(() => {
        error = ErrorBuilder.buildError('paymentNotAssociated');
      });

      it('error should match expected response', () => {
        expect(error).toEqual(expectedResponse);
      });
    });

    describe('should build a "minimumAmountError" error', () => {
      const expectedResponse = new ApiError({
        status: 400,
        code: 'Orders-035',
        title: 'Invalid Minimum order amount',
        detail: 'The order amount is lower than the configured value'
      });

      beforeAll(() => {
        error = ErrorBuilder.buildError('minimumAmountError');
      });

      it('error should match expected response', () => {
        expect(error).toEqual(expectedResponse);
      });
    });

    describe('should build a "doesNotHaveNextDeliveryDates" error', () => {
      const expectedResponse = new ApiError({
        status: 400,
        code: 'Orders-037',
        title: 'Does not have next delivery dates',
        detail: 'Does not have next delivery dates'
      });

      beforeAll(() => {
        error = ErrorBuilder.buildError('doesNotHaveNextDeliveryDates');
      });

      it('error should match expected response', () => {
        expect(error).toEqual(expectedResponse);
      });
    });

    describe('should build a "paymentGreatherThanOwedAmount" error', () => {
      const expectedResponse = new ApiError({
        status: 400,
        code: 'Orders-038',
        title: 'Payment received is greater than what is owed',
        detail: 'Payment received is greater than what is owed'
      });

      beforeAll(() => {
        error = ErrorBuilder.buildError('paymentGreatherThanOwedAmount');
      });

      it('error should match expected response', () => {
        expect(error).toEqual(expectedResponse);
      });
    });

    describe('should build a "deliveriesMissing" error', () => {
      const expectedResponse = new ApiError({
        status: 404,
        code: 'Orders-039',
        title: `Deliveries ['invoice1'] not found`,
        detail: `Deliveries ['invoice1'] not found`,
        meta: "['invoice1']"
      });

      beforeAll(() => {
        error = ErrorBuilder.buildError('deliveriesMissing', "['invoice1']");
      });

      it('error should match expected response', () => {
        expect(error).toEqual(expectedResponse);
      });
    });

    describe('should build a "ordersNotFound" error', () => {
      const expectedResponse = new ApiError({
        status: 404,
        code: 'Orders-040',
        title: "Orders for invoices ['order1'] not found",
        detail: "Orders for invoices ['order1'] not found",
        meta: "['order1']"
      });

      beforeAll(() => {
        error = ErrorBuilder.buildError('ordersNotFound', "['order1']");
      });

      it('error should match expected response', () => {
        expect(error).toEqual(expectedResponse);
      });
    });

    describe('should build a "creditNotesNotFound" error', () => {
      const expectedResponse = new ApiError({
        status: 404,
        code: 'Orders-041',
        title: "Credit notes for documents ID's ['documentNumber1'] not found",
        detail: "Credit notes for documents ID's ['documentNumber1'] not found",
        meta: "['documentNumber1']"
      });

      beforeAll(() => {
        error = ErrorBuilder.buildError('creditNotesNotFound', "['documentNumber1']");
      });

      it('error should match expected response', () => {
        expect(error).toEqual(expectedResponse);
      });
    });

    describe('should build a "cartIdNotMatch" error', () => {
      const expectedResponse = new ApiError({
        status: 400,
        code: 'Orders-042',
        title: 'Cart ID does not match with current cart',
        detail: 'Cart ID does not match with current cart'
      });

      beforeAll(() => {
        error = ErrorBuilder.buildError('cartIdNotMatch');
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
    it('should pass for AnonymousIdAlreadyInUse and return Orders-001', () => {
      expect(ErrorBuilder.buildCommercetoolsCode('AnonymousIdAlreadyInUse')).toEqual('Orders-001');
    });

    it('should pass for DuplicateField and return Orders-002', () => {
      expect(ErrorBuilder.buildCommercetoolsCode('DuplicateField')).toEqual('Orders-002');
    });

    it('should pass for DuplicateFieldWithConflictingResource and return Orders-003', () => {
      expect(ErrorBuilder.buildCommercetoolsCode('DuplicateFieldWithConflictingResource')).toEqual('Orders-003');
    });

    it('should pass for FeatureRemoved and return Orders-004', () => {
      expect(ErrorBuilder.buildCommercetoolsCode('FeatureRemoved')).toEqual('Orders-004');
    });

    it('should pass for InvalidInput and return Orders-005', () => {
      expect(ErrorBuilder.buildCommercetoolsCode('InvalidInput')).toEqual('Orders-005');
    });

    it('should pass for InvalidJsonInput and return Orders-006', () => {
      expect(ErrorBuilder.buildCommercetoolsCode('InvalidJsonInput')).toEqual('Orders-006');
    });

    it('should pass for InvalidOperation and return Orders-007', () => {
      expect(ErrorBuilder.buildCommercetoolsCode('InvalidOperation')).toEqual('Orders-007');
    });

    it('should pass for InvalidField and return Orders-008', () => {
      expect(ErrorBuilder.buildCommercetoolsCode('InvalidField')).toEqual('Orders-008');
    });

    it('should pass for InternalConstraintViolated and return Orders-009', () => {
      expect(ErrorBuilder.buildCommercetoolsCode('InternalConstraintViolated')).toEqual('Orders-009');
    });

    it('should pass for MaxResourceLimitExceeded and return Orders-010', () => {
      expect(ErrorBuilder.buildCommercetoolsCode('MaxResourceLimitExceeded')).toEqual('Orders-010');
    });

    it('should pass for MoneyOverflow and return Orders-011', () => {
      expect(ErrorBuilder.buildCommercetoolsCode('MoneyOverflow')).toEqual('Orders-011');
    });

    it('should pass for ObjectNotFound and return Orders-012', () => {
      expect(ErrorBuilder.buildCommercetoolsCode('ObjectNotFound')).toEqual('Orders-012');
    });

    it('should pass for ReferenceExists and return Orders-013', () => {
      expect(ErrorBuilder.buildCommercetoolsCode('ReferenceExists')).toEqual('Orders-013');
    });

    it('should pass for ReferencedResourceNotFound and return Orders-014', () => {
      expect(ErrorBuilder.buildCommercetoolsCode('ReferencedResourceNotFound')).toEqual('Orders-014');
    });

    it('should pass for RequiredField and return Orders-015', () => {
      expect(ErrorBuilder.buildCommercetoolsCode('RequiredField')).toEqual('Orders-015');
    });

    it('should pass for ResourceSizeLimitExceeded and return Orders-016', () => {
      expect(ErrorBuilder.buildCommercetoolsCode('ResourceSizeLimitExceeded')).toEqual('Orders-016');
    });

    it('should pass for SemanticError and return Orders-017', () => {
      expect(ErrorBuilder.buildCommercetoolsCode('SemanticError')).toEqual('Orders-017');
    });

    it('should pass for SyntaxError and return Orders-018', () => {
      expect(ErrorBuilder.buildCommercetoolsCode('SyntaxError')).toEqual('Orders-018');
    });

    it('should pass for QueryTimedOut and return Orders-019', () => {
      expect(ErrorBuilder.buildCommercetoolsCode('QueryTimedOut')).toEqual('Orders-019');
    });

    it('should pass for ResourceNotFound and return Orders-020', () => {
      expect(ErrorBuilder.buildCommercetoolsCode('ResourceNotFound')).toEqual('Orders-020');
    });

    it('should pass for ConcurrentModification and return Orders-021', () => {
      expect(ErrorBuilder.buildCommercetoolsCode('ConcurrentModification')).toEqual('Orders-021');
    });

    it('should pass for General and return Orders-022', () => {
      expect(ErrorBuilder.buildCommercetoolsCode('General')).toEqual('Orders-022');
    });

    it('should pass for BadGateway and return Orders-023', () => {
      expect(ErrorBuilder.buildCommercetoolsCode('BadGateway')).toEqual('Orders-023');
    });

    it('should pass for OverCapacity and return Orders-024', () => {
      expect(ErrorBuilder.buildCommercetoolsCode('OverCapacity')).toEqual('Orders-024');
    });

    it('should pass for PendingOperation and return Orders-025', () => {
      expect(ErrorBuilder.buildCommercetoolsCode('PendingOperation')).toEqual('Orders-025');
    });

    it('should pass for OutOfStock and return Orders-026', () => {
      expect(ErrorBuilder.buildCommercetoolsCode('OutOfStock')).toEqual('Orders-026');
    });

    it('should pass for PriceChanged and return Orders-027', () => {
      expect(ErrorBuilder.buildCommercetoolsCode('PriceChanged')).toEqual('Orders-027');
    });

    it('should pass for DiscountCodeNonApplicable and return Orders-028', () => {
      expect(ErrorBuilder.buildCommercetoolsCode('DiscountCodeNonApplicable')).toEqual('Orders-028');
    });

    it('should pass for ShippingMethodDoesNotMatchCart and return Orders-029', () => {
      expect(ErrorBuilder.buildCommercetoolsCode('ShippingMethodDoesNotMatchCart')).toEqual('Orders-029');
    });

    it('should pass for InvalidItemShippingDetails and return Orders-030', () => {
      expect(ErrorBuilder.buildCommercetoolsCode('InvalidItemShippingDetails')).toEqual('Orders-030');
    });

    it('should pass for MatchingPriceNotFound and return Orders-031', () => {
      expect(ErrorBuilder.buildCommercetoolsCode('MatchingPriceNotFound')).toEqual('Orders-031');
    });

    it('should pass for MissingTaxRateForCountry and return Orders-032', () => {
      expect(ErrorBuilder.buildCommercetoolsCode('MissingTaxRateForCountry')).toEqual('Orders-032');
    });

    it('should pass for CountryNotConfiguredInStore and return Orders-033', () => {
      expect(ErrorBuilder.buildCommercetoolsCode('CountryNotConfiguredInStore')).toEqual('Orders-033');
    });

    it('should pass for default and return code', () => {
      expect(ErrorBuilder.buildCommercetoolsCode('Code')).toEqual('Code');
    });

    it('should pass for default and return undefined', () => {
      expect(ErrorBuilder.buildCommercetoolsCode()).toBeUndefined();
    });
  });
});
