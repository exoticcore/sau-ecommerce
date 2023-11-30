import { HttpService } from '@nestjs/axios';
import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { catchError, lastValueFrom, map } from 'rxjs';
import { Role } from './role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly httpService: HttpService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles) return false;

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    const resp = this.httpService
      .get('http://localhost:3000/api/v1/auth/user/info', {
        headers: {
          Authorization: authHeader,
        },
      })
      .pipe(
        map((response) => {
          return response.data;
        }),
        catchError((e) => {
          throw new HttpException(e.response.data, e.response.status);
        }),
      );
    const data = await lastValueFrom(resp);
    return this.validateRoles(roles, data.roles);
  }

  validateRoles(roles: string[], userRoles: string[]) {
    return roles.some((role) => userRoles.includes(role));
  }
}
