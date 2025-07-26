import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PasswordEncoderService } from '../share/passwordEncoder.service';
import { PrismaService } from '../share/prisma.service';
import { TokenService } from '../share/token.service';
import { LoginType, RefreshTokenType, RegisterType } from './auth.dto';
import e from 'express';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private tokenService: TokenService,
    private passwordEncoderService: PasswordEncoderService,
  ) {}

  async register({ email, password, phoneNumber, name }: RegisterType) {
    const isEmail = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (isEmail) {
      throw new ConflictException('email already existed');
    }

    const isPhone = await this.prismaService.user.findUnique({
      where: {
        phoneNumber,
      },
    });

    if (isPhone) {
      throw new ConflictException('phone number already existed');
    }

    return await this.prismaService.user.create({
      data: {
        email,
        password: await this.passwordEncoderService.hash(password),
        phoneNumber,
        name,
      },
    });
  }

  async login({ email, password }: LoginType) {
    try {
      const user = await this.prismaService.user.findUniqueOrThrow({
        where: {
          email,
        },
      });
      const isMatching = await this.passwordEncoderService.compare(
        password,
        user.password,
      );
      if (!isMatching) {
        throw new Error('password not equal');
      }
      const [accessToken, refreshToken] =
        await this.tokenService.createTokens(user);
      const { exp } = this.tokenService.decodeToken(refreshToken);
      await this.prismaService.refreshToken.create({
        data: {
          token: refreshToken,
          expireIn: new Date(exp * 1000),
          userId: user.id,
        },
      });
      return { accessToken, refreshToken };
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('user not found');
    }
  }

  async refresh({ token }: RefreshTokenType) {
    try {
      const { userId } = await this.tokenService.verifyRefreshToken(token);
      await this.prismaService.refreshToken.findUniqueOrThrow({
        where: {
          token,
        },
      });
      const user = await this.prismaService.user.findUniqueOrThrow({
        where: {
          id: userId,
        },
      });
      const [accessToken, refreshToken] =
        await this.tokenService.createTokens(user);
      const { exp } = this.tokenService.decodeToken(refreshToken);
      this.prismaService.refreshToken.create({
        data: {
          token: refreshToken,
          userId: user.id,
          expireIn: new Date(exp * 1000),
        },
      });
      return { accessToken, refreshToken };
    } catch (error) {
      // đã refresh token rồi, thông báo cho user biết token của họ bị đánh cắp
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code == 'P2025'
      ) {
        throw new UnauthorizedException('refresh token has been revoked');
      }
      throw new UnauthorizedException('invalid refresh token');
    }
  }
}
