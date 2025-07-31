import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  AdditionTokenPayload,
  AccessTokenPayload,
  RefreshTokenPayload,
} from '../../auth/auth.type';
import { EnvService } from './env.service';

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private envService: EnvService,
  ) {}

  async createTokens({ email, roleId, userId, deviceId }: AccessTokenPayload) {
    const accessPayload: AccessTokenPayload = {
      userId,
      email,
      roleId,
      deviceId,
    };
    const refreshPayload: RefreshTokenPayload = {
      userId,
    };

    return Promise.all([
      this.jwtService.sign(accessPayload, {
        secret: this.envService.ACCESS_TOKEN_KEY,
        expiresIn: this.envService.ACCESS_TOKEN_EXPIRE,
        jwtid: crypto.randomUUID(),
      }),
      this.jwtService.sign(refreshPayload, {
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

  async verifyRefreshToken(token: string): Promise<RefreshTokenPayload> {
    return await this.jwtService.verify(token, {
      secret: this.envService.REFRESH_TOKEN_KEY,
    });
  }

  decodeToken(token: string): AccessTokenPayload & AdditionTokenPayload {
    return this.jwtService.decode(token);
  }
}
