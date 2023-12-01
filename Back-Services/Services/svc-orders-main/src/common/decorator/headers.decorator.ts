import { applyDecorators } from '@nestjs/common';
import { ApiHeader } from '@nestjs/swagger';

export function AuthorizationHeaders() {
  return applyDecorators(
    ApiHeader({
      name: 'x-user-id',
      required: true,
      description: 'ID of the user'
    }),
    ApiHeader({
      name: 'x-user-roles',
      required: false,
      description: 'Roles of the user'
    })
  );
}
