import { applyDecorators } from '@nestjs/common';
import { ApiHeader } from '@nestjs/swagger';

export function AuthorizationHeaders() {
  return applyDecorators(
    ApiHeader({
      name: 'x-user-id', //TODO: We need to change this, when we need to modify the config.
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

export function AuthorizationAnonymousHeaders() {
  return applyDecorators(
    ApiHeader({
      name: 'x-anonymous-id',
      required: true,
      description: 'ID provided by the client'
    }),
    ApiHeader({
      name: 'x-user-id',
      required: false,
      description: 'ID of the user'
    })
  );
}
