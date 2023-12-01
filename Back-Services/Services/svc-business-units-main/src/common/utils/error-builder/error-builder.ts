import { ApiError } from '../../errors/api.error';

export class ErrorBuilder {
  static buildError(type, data?) {
    switch (type) {
      case 'invalidRut':
        return new ApiError({
          status: 400,
          code: 'BU-001',
          title: 'Invalid RUT',
          detail: 'RUT is not valid or does not exist.'
        });
      case 'keycloakUserAlreadyRegister':
        return new ApiError({
          status: 400,
          code: 'BU-002',
          title: 'Keycloak user already registered.',
          detail: 'User already registered. Please recover your password.'
        });
      case 'usernameAlreadyRegistered':
        return new ApiError({
          status: 409,
          code: 'BU-003',
          title: 'User is already associated with another Company.',
          detail: 'User is already associated with another Company.'
        });
      case 'rutAlreadyRegistered':
        return new ApiError({
          status: 400,
          code: 'BU-004',
          title: 'RUT is already registered.',
          detail: 'RUT is already registerered. Please choose another email.'
        });
      case 'buNotAssociateCustomer':
        return new ApiError({
          status: 400,
          code: 'BU-005',
          title: 'Customer not associated to Business Unit or lacks access',
          detail: 'Customer is not associated to this Business Unit or lacks permissions to perform the action'
        });
      case 'externalServiceError':
        return new ApiError({
          status: 503,
          code: 'BU-006',
          title: 'External Rut Verification Service Error',
          detail: 'External rut verification service is experiencing problems. Please try later'
        });
      case 'noAssociatedBU':
        return new ApiError({
          status: 400,
          code: 'BU-007',
          title: 'No Associated Business Unit',
          detail: 'Valid Rut but no associated business unit'
        });
      case 'userAlreadyAssociatedToBu':
        return new ApiError({
          status: 409,
          code: 'BU-008',
          title: 'User is already associated to this Business Unit',
          detail: 'User is already associated to this Business Unit'
        });
      case 'invalidCode':
        return new ApiError({
          status: 400,
          code: 'BU-009',
          title: 'Invalid Verification Code',
          detail: 'The Verification Code is expired or blocked.'
        });
      case 'invalidUsername':
        return new ApiError({
          status: 400,
          code: 'BU-010',
          title: 'Invalid username',
          detail: 'The username or email not allowed'
        });
      case 'wrongVerificationAttempt':
        return new ApiError({
          status: 400,
          code: 'BU-011',
          title: 'Wrong code verification attempt',
          detail: 'The Verification Code is invalid',
          data
        });
      case 'newVerificationCodeNotRequest':
        return new ApiError({
          status: 400,
          code: 'BU-012',
          title: 'New verification code not being requested',
          detail: 'New verification code should be requested before reset password'
        });
      case 'businessUnitDoesNotExist':
        return new ApiError({
          status: 404,
          code: 'BU-013',
          title: 'Business Unit does not exist',
          detail: 'Business Unit does not exist for the id provided'
        });
      case 'noDeliveryZoneAssociated':
        return new ApiError({
          status: 400,
          code: 'BU-014',
          title: 'Delivery zone no associated',
          detail: 'There is no delivery zone associated with the provided address.'
        });
      case 'multipleBUAssociated':
        return new ApiError({
          status: 400,
          code: 'BU-015',
          title: 'RUT with company have more than one business unit associated',
          detail: 'RUT with company have more than one business unit associated'
        });
      case 'customerAlreadyRegistered':
        return new ApiError({
          status: 400,
          code: 'BU-016',
          title: 'The Customer is already registered to another Business Unit or Division',
          detail: 'The Customer is already registered to another Business Unit or Division'
        });
      case undefined:
      default:
        return new ApiError({ status: 500, title: 'Internal server error' });
    }
  }
}
