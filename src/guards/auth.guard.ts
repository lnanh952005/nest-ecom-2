import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from 'src/decorators/public.decorator';
import { AccessTokenPayload } from 'src/modules/auth/auth.type';
import { PrismaService } from 'src/modules/share/services/prisma.service';
import { TokenService } from 'src/modules/share/services/token.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private tokenService: TokenService,
    private prismaService: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (this.isPublicRoute(context)) {
      return true;
    }
    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    const payload = await this.validateAccessToken(token);
    await this.validateUserPermission({
      method: request.method,
      path: request.route.path,
      roleId: payload.roleId,
    });
    request['user'] = payload;
    return true;
  }

  private extractTokenFromHeader(request: Request) {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    if (type == 'Bearer') {
      return token;
    }
    throw new UnauthorizedException('token is required');
  }

  private isPublicRoute(ctx: ExecutionContext) {
    return this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
  }

  private async validateAccessToken(
    token: string,
  ): Promise<AccessTokenPayload> {
    try {
      return await this.tokenService.verifyAccessToken(token);
    } catch {
      throw new UnauthorizedException('invalid access token');
    }
  }

  private async validateUserPermission({
    method,
    path,
    roleId,
  }: {
    roleId: number;
    path: string;
    method: string;
  }) {
    const role = await this.prismaService.role
      .findUniqueOrThrow({
        where: {
          id: roleId,
        },
        include: {
          permissions: true,
        },
      })
      .catch(() => {
        throw new ForbiddenException();
      });
    const isCanAccess = role.permissions.some(
      (e) => e.path == path && e.method == method,
    );
    if (!isCanAccess) {
      throw new ForbiddenException('can not access');
    }
  }
}
