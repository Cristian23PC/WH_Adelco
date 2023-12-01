import { applyDecorators } from '@nestjs/common';
import { ApiHeader } from '@nestjs/swagger';

export function AuthorizationHeaders(requiredUserId = false) {
  return applyDecorators(
    ApiHeader({
      name: 'x-user-id',
      required: requiredUserId,
      description: 'ID of the user'
    }),
    ApiHeader({
      name: 'x-user-roles',
      required: true,
      description: 'Roles of the user'
    })
  );
}
