import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { EnvService } from './env.service';
import { User } from 'generated/prisma';
import { AccessTokenPayload, RefreshtokenPayload } from '../auth/auth.type';

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private envService: EnvService,
  ) {}

  async createTokens(user: User) {
    const payloadAccess: AccessTokenPayload = {
      userId: user.id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
    };
    const payloadRefresh = {
      userId: user.id,
      email: user.email,
    };
    return Promise.all([
      this.jwtService.sign(payloadAccess, {
        secret: this.envService.ACCESS_TOKEN_KEY,
        expiresIn: this.envService.ACCESS_TOKEN_EXPIRE,
        jwtid: crypto.randomUUID(),
      }),
      this.jwtService.sign(payloadRefresh, {
        secret: this.envService.REFRESH_TOKEN_KEY,
        expiresIn: this.envService.REFRESH_TOKEN_EXPIRE,
        jwtid: crypto.randomUUID(),
      }),
    ]);
  }

  async verifyAccessToken(token: string): Promise<AccessTokenPayload> {
    return await this.jwtService.verify(token, {
      secret: this.envService.ACCESS_TOKEN_KEY,
    });
  }

  async verifyRefreshToken(token: string): Promise<RefreshtokenPayload> {
    return await this.jwtService.verify(token, {
      secret: this.envService.REFRESH_TOKEN_KEY,
    });
  }

  decodeToken(token: string): AccessTokenPayload & {
    iat: number;
    exp: number;
    jti: string;
  } {
    return this.jwtService.decode(token);
  }
}
