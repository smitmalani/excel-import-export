import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';
import { User } from '../../../generated/prisma';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true; // No roles specified, access granted
    }
    const { user }: { user: User } = context.switchToHttp().getRequest();

    // If user is not available or does not have a role, deny access
    if (!user || !user.Role) {
      return false;
    }

    return requiredRoles.some((role) => user.Role === role);
  }
}
