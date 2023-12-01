import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { userHeaderRoles } from '../constants/headers';

@Injectable()
export class TransformHeaderGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    if (request.headers[userHeaderRoles]) {
      try {
        request.headers[userHeaderRoles] = JSON.parse(request.headers[userHeaderRoles]);

        if (!Array.isArray(request.headers[userHeaderRoles])) {
          throw new BadRequestException('Bad roles format');
        }
      } catch (error) {
        throw new BadRequestException('Bad roles format');
      }
    }

    return true;
  }
}
