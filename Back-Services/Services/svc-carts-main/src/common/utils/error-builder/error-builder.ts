import { ApiError, API_ERROR } from '../../errors/api.error';

export class ErrorBuilder {
  static buildError(type, meta?) {
    switch (type) {
      case 'apiError':
        return new ApiError({
          status: meta?.statusCode || 400,
          code: API_ERROR,
          title: 'Api Error',
          detail: 'Api Error',
          meta: meta?.error
        });
      case 'productNotFound':
        return new ApiError({
          status: 400,
          code: 'Carts-034',
          title: 'Product not found',
          detail: 'Product not found',
          meta
        });
      case 'buNotFound':
        return new ApiError({
          status: 404,
          code: 'Carts-035',
          title: 'Business Unit not found',
          detail: 'Business Unit not found',
          meta
        });
      case 'noStock':
        return new ApiError({
          status: 400,
          code: 'Carts-026',
          title: 'There are not enough units in stock',
          detail: 'There are not enough units in stock',
          meta
        });
      case 'discountCodeDoesNotExist':
        return new ApiError({
          status: 404,
          code: 'Carts-027',
          title: 'Discount code does not exist',
          detail: 'Discount code does not exist',
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
        return 'Carts-001';
      case 'DuplicateField':
        return 'Carts-002';
      case 'DuplicateFieldWithConflictingResource':
        return 'Carts-003';
      case 'FeatureRemoved':
        return 'Carts-004';
      case 'InvalidInput':
        return 'Carts-005';
      case 'InvalidJsonInput':
        return 'Carts-006';
      case 'InvalidOperation':
        return 'Carts-007';
      case 'InvalidField':
        return 'Carts-008';
      case 'InternalConstraintViolated':
        return 'Carts-009';
      case 'MaxResourceLimitExceeded':
        return 'Carts-010';
      case 'MoneyOverflow':
        return 'Carts-011';
      case 'ObjectNotFound':
        return 'Carts-012';
      case 'ReferenceExists':
        return 'Carts-013';
      case 'ReferencedResourceNotFound':
        return 'Carts-014';
      case 'RequiredField':
        return 'Carts-015';
      case 'ResourceSizeLimitExceeded':
        return 'Carts-016';
      case 'SemanticError':
        return 'Carts-017';
      case 'SyntaxError':
        return 'Carts-018';
      case 'QueryTimedOut':
        return 'Carts-019';
      case 'ResourceNotFound':
        return 'Carts-020';
      case 'ConcurrentModification':
        return 'Carts-021';
      case 'General':
        return 'Carts-022';
      case 'BadGateway':
        return 'Carts-023';
      case 'OverCapacity':
        return 'Carts-024';
      case 'PendingOperation':
        return 'Carts-025';
      case 'OutOfStock':
        return 'Carts-026';
      case 'PriceChanged':
        return 'Carts-027';
      case 'DiscountCodeNonApplicable':
        return 'Carts-028';
      case 'ShippingMethodDoesNotMatchCart':
        return 'Carts-029';
      case 'InvalidItemShippingDetails':
        return 'Carts-030';
      case 'MatchingPriceNotFound':
        return 'Carts-031';
      case 'MissingTaxRateForCountry':
        return 'Carts-032';
      case 'CountryNotConfiguredInStore':
        return 'Carts-033';
      default:
        return code ?? undefined;
    }
  }
}
