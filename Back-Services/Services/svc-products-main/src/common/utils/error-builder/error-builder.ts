import { ApiError, T2_ZONE_OVERLAP_ERROR } from '../../errors/api.error';

export class ErrorBuilder {
  static buildError(type, meta?) {
    switch (type) {
      case 't2zOverlapError':
        return new ApiError({
          status: meta?.statusCode || 400,
          code: T2_ZONE_OVERLAP_ERROR,
          title: 'T2 zone does not match distribution center',
          detail: 'T2 zone does not match distribution center',
          meta: meta?.error
        });
      case undefined:
      default:
        return new ApiError({ status: 500, title: 'Internal server error' });
    }
  }
}
