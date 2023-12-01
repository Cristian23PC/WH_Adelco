import { ApiError } from '../../errors/api.error';

export class ErrorBuilder {
  static buildError(type?: string, meta?: string) {
    switch (type) {
      case 'minimumAmountError':
        return new ApiError({
          status: 400,
          code: 'Orders-035',
          title: 'Invalid Minimum order amount',
          detail: 'The order amount is lower than the configured value'
        });
      case 'invalidStockOrPrice':
        return new ApiError({
          status: 400,
          code: 'Orders-034',
          title: 'Invalid Stock or Price',
          detail: 'Price or stock changed and the cart was updated.'
        });
      case 'paymentNotAssociated':
        return new ApiError({
          status: 400,
          code: 'Orders-036',
          title: 'Payment not associated to the order',
          detail: 'The payment is not associated with the order'
        });
      case 'doesNotHaveNextDeliveryDates':
        return new ApiError({
          status: 400,
          code: 'Orders-037',
          title: 'Does not have next delivery dates',
          detail: 'Does not have next delivery dates'
        });
      case 'paymentGreatherThanOwedAmount':
        return new ApiError({
          status: 400,
          code: 'Orders-038',
          title: 'Payment received is greater than what is owed',
          detail: 'Payment received is greater than what is owed'
        });
      case 'deliveriesMissing':
        return new ApiError({
          status: 404,
          code: 'Orders-039',
          title: `Deliveries ${meta} not found`,
          detail: `Deliveries ${meta} not found`,
          meta
        });
      case 'ordersNotFound':
        return new ApiError({
          status: 404,
          code: 'Orders-040',
          title: `Orders for invoices ${meta} not found`,
          detail: `Orders for invoices ${meta} not found`,
          meta
        });
      case 'creditNotesNotFound':
        return new ApiError({
          status: 404,
          code: 'Orders-041',
          title: `Credit notes for documents ID's ${meta} not found`,
          detail: `Credit notes for documents ID's ${meta} not found`,
          meta
        });
      case 'cartIdNotMatch':
        return new ApiError({
          status: 400,
          code: 'Orders-042',
          title: `Cart ID does not match with current cart`,
          detail: `Cart ID does not match with current cart`,
          meta
        });
      case 'paymentNotCanceled':
        return new ApiError({
          status: 400,
          code: 'Orders-043',
          title: `The associated payment is not canceled`,
          detail: `The associated payment is not canceled`,
          meta
        });
      case undefined:
      default:
        return new ApiError({ status: 500, title: 'Internal server error' });
    }
  }

  static buildCommercetoolsCode(code?: string) {
    switch (code) {
      case 'AnonymousIdAlreadyInUse':
        return 'Orders-001';
      case 'DuplicateField':
        return 'Orders-002';
      case 'DuplicateFieldWithConflictingResource':
        return 'Orders-003';
      case 'FeatureRemoved':
        return 'Orders-004';
      case 'InvalidInput':
        return 'Orders-005';
      case 'InvalidJsonInput':
        return 'Orders-006';
      case 'InvalidOperation':
        return 'Orders-007';
      case 'InvalidField':
        return 'Orders-008';
      case 'InternalConstraintViolated':
        return 'Orders-009';
      case 'MaxResourceLimitExceeded':
        return 'Orders-010';
      case 'MoneyOverflow':
        return 'Orders-011';
      case 'ObjectNotFound':
        return 'Orders-012';
      case 'ReferenceExists':
        return 'Orders-013';
      case 'ReferencedResourceNotFound':
        return 'Orders-014';
      case 'RequiredField':
        return 'Orders-015';
      case 'ResourceSizeLimitExceeded':
        return 'Orders-016';
      case 'SemanticError':
        return 'Orders-017';
      case 'SyntaxError':
        return 'Orders-018';
      case 'QueryTimedOut':
        return 'Orders-019';
      case 'ResourceNotFound':
        return 'Orders-020';
      case 'ConcurrentModification':
        return 'Orders-021';
      case 'General':
        return 'Orders-022';
      case 'BadGateway':
        return 'Orders-023';
      case 'OverCapacity':
        return 'Orders-024';
      case 'PendingOperation':
        return 'Orders-025';
      case 'OutOfStock':
        return 'Orders-026';
      case 'PriceChanged':
        return 'Orders-027';
      case 'DiscountCodeNonApplicable':
        return 'Orders-028';
      case 'ShippingMethodDoesNotMatchCart':
        return 'Orders-029';
      case 'InvalidItemShippingDetails':
        return 'Orders-030';
      case 'MatchingPriceNotFound':
        return 'Orders-031';
      case 'MissingTaxRateForCountry':
        return 'Orders-032';
      case 'CountryNotConfiguredInStore':
        return 'Orders-033';
      default:
        return code ?? undefined;
    }
  }
}
