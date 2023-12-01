import { applyDecorators } from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';

export function AuthorizationParams() {
  return applyDecorators(ApiParam({ name: 'id', type: 'string', required: true }), ApiParam({ name: 'lineItemId', type: 'string', required: true }));
}
