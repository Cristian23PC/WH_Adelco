import { userHeaderId, userHeaderRoles } from '@/common/constants/headers';
import { Roles } from '@/common/enum/roles.enum';
import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class HeaderInternalGuard implements CanActivate {
  constructor() {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user: string = request.headers[userHeaderId] || undefined;
    let roles: Roles[] = [];

    try {
      roles = JSON.parse(request.headers[userHeaderRoles] || '[]');
    } catch (error) {
      throw new BadRequestException(`Bad ${userHeaderRoles} format`);
    }

    if (!user) throw new BadRequestException(`User ID missing`);
    if (!roles.length) throw new BadRequestException(`User Roles missing`);

    if (roles.includes(Roles.Internal)) {
      return true;
    }

    throw new ForbiddenException('Insufficient permissions');
  }
}
