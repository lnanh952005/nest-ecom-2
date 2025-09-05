import { Role } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt';

import {
  EmailNotFoundException,
  InvalidRefreshTokenException,
  InvalidTOTPException,
  RefreshTokenExpiredException,
  RefreshTokenNotFoundException,
  TOTPRequiredException,
  UserNotFoundException,
} from '../auth.error';
import { TwoFactorAuthService } from './twoFactorAuth.service';
import { TokenService } from '../../share/services/token.service';
import { VerificationCodeService } from './verificationCode.service';
import { UserRepository } from '../../user/user.repository';
import { RoleRepository } from '../../role/role.repository';
import { DeviceRepository } from '@auth/repositories/device.repository';
import { PasswordEncoderService } from '../../share/services/passwordEncoder.service';
import { RefreshTokenRepository } from '@auth/repositories/refreshToken.repository';
import {
  ForgotPasswordDto,
  LoginDto,
  RefreshTokenDto,
  RegisterDto,
} from '@auth/dtos/auth.request';

@Injectable()
export class AuthService {
  constructor(
    private tokenService: TokenService,
    private twoFactorAuthService: TwoFactorAuthService,
    private userRepository: UserRepository,
    private roleRepository: RoleRepository,
    private deviceRepository: DeviceRepository,
    private refreshTokenRepository: RefreshTokenRepository,
    private passwordEncoderService: PasswordEncoderService,
    private verificationCodeService: VerificationCodeService,
  ) {}

  async getProfile(id: number) {
    return await this.userRepository.findByIdOrEmail({ unique: { id } });
  }

  async register({ email, password, name, code }: RegisterDto) {
    const verificationCode = await this.verificationCodeService.validate({
      code,
      email,
      type: 'REGISTER',
    });

    const clientRole = (await this.roleRepository.findByName('CLIENT')) as Role;
    const hashedPassword = await this.passwordEncoderService.hash(password);
    const [user] = await Promise.all([
      this.userRepository.register({
        email,
        name,
        password: hashedPassword,
        roleId: clientRole.id,
      }),
      this.verificationCodeService.deleteById(verificationCode.id),
    ]);
    return user;
  }

  async login({
    body,
    ip,
    userAgent,
  }: {
    body: LoginDto;
    userAgent: string;
    ip: string;
  }) {
    const user = await this.userRepository.findByIdOrEmail({
      unique: { email: body.email },
    });
    if (!user) {
      throw EmailNotFoundException;
    }
    const isMatching = await this.passwordEncoderService.compare(
      body.password,
      user.password,
    );
    if (!isMatching) {
      throw EmailNotFoundException;
    }

    if (user.totpSecret) {
      if (!body.totpCode) {
        throw TOTPRequiredException;
      }
      const idValid = this.twoFactorAuthService.verify({
        email: user.email,
        secret: user.totpSecret,
        totpCode: body.totpCode,
      });
      if (!idValid) {
        throw InvalidTOTPException;
      }
    }

    const device = await this.deviceRepository.create({
      ip,
      userAgent,
      userId: user.id,
    });
    const [accessToken, refreshToken] = await this.tokenService.createTokens({
      userId: user.id,
      email: user.email,
      roleId: user.roleId,
      deviceId: device.id,
    });
    const { exp } = this.tokenService.decodeToken(refreshToken);
    await this.refreshTokenRepository.create({
      token: refreshToken,
      expireAt: new Date(exp * 1000),
      userId: user.id,
      deviceId: device.id,
    });
    return { accessToken, refreshToken };
  }

  async refresh({
    token,
    ip,
    userAgent,
  }: {
    token: string;
    ip: string;
    userAgent: string;
  }) {
    try {
      const { userId } = await this.tokenService.verifyRefreshToken(token);
      const user = await this.userRepository.findByIdOrEmail({
        unique: { id: userId },
      });
      if (!user) {
        throw UserNotFoundException;
      }

      const tokenInDb = await this.refreshTokenRepository.findByToken(token);

      if (!tokenInDb) {
        // đã refresh token rồi, thông báo cho user biết token của họ bị đánh cắp
        throw RefreshTokenNotFoundException;
      }

      const $updateDevice = this.deviceRepository.updateById({
        id: tokenInDb.deviceId,
        data: {
          ip,
          userAgent,
        },
      });

      const $deleteRefreshToken =
        this.refreshTokenRepository.deleteByToken(token);

      const $tokens = this.tokenService.createTokens({
        userId: user.id,
        email: user.email,
        roleId: user.roleId,
        deviceId: tokenInDb.deviceId,
      });

      const [[accessToken, refreshToken]] = await Promise.all([
        $tokens,
        $updateDevice,
        $deleteRefreshToken,
      ]);
      const { exp } = this.tokenService.decodeToken(refreshToken);
      await this.refreshTokenRepository.create({
        token: refreshToken,
        userId: user.id,
        expireAt: new Date(exp * 1000),
        deviceId: tokenInDb.deviceId,
      });
      return { accessToken, refreshToken };
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw RefreshTokenExpiredException;
      } else if (error instanceof JsonWebTokenError) {
        throw InvalidRefreshTokenException;
      }
      throw error;
    }
  }

  async logout({ token }: RefreshTokenDto) {
    try {
      await this.tokenService.verifyRefreshToken(token);
      const { deviceId } =
        await this.refreshTokenRepository.deleteByToken(token);

      await this.deviceRepository.updateById({
        id: deviceId,
        data: {
          isActive: false,
        },
      });
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw RefreshTokenExpiredException;
      } else if (error instanceof JsonWebTokenError) {
        throw InvalidRefreshTokenException;
      }
      throw error;
    }
  }

  async forgotPassword({ code, email, newPassword }: ForgotPasswordDto) {
    const verificationCode = await this.verificationCodeService.validate({
      code,
      email,
      type: 'FORGOT_PASSWORD',
    });
    const hashedPassword = await this.passwordEncoderService.hash(newPassword);
    try {
      const [updatedUser] = await Promise.all([
        this.userRepository.updateByEmail({
          email,
          data: { password: hashedPassword },
        }),
        this.verificationCodeService.deleteById(verificationCode.id),
      ]);
      return updatedUser;
    } catch (error) {
      throw EmailNotFoundException;
    }
  }
}
