import OTPAuth from 'otpauth';
import { Injectable } from '@nestjs/common';
import {
  EmailNotFoundException,
  InvalidOTPException,
  InvalidTOTPException,
  OTPExpiredException,
  TOTPAlreadyEnabledException,
  TOTPNotEnabledException,
  UserNotFoundException,
} from '../auth.error';
import { EnvService } from 'src/modules/share/services/env.service';
import { UserRepository } from 'src/modules/share/repositories/user.repository';
import { VerificationCodeRepository } from 'src/modules/share/repositories/verificationCode.repository';
import { Disable2FaDtoType, Reset2FaDtoType } from '../auth.type';

@Injectable()
export class TwoFactorAuthService {
  constructor(
    private envService: EnvService,
    private userRepository: UserRepository,
    private verificationCodeRepository: VerificationCodeRepository,
  ) {}

  private createTOTP({ email, secret }: { email: string; secret?: string }) {
    return new OTPAuth.TOTP({
      issuer: this.envService.APP_NAME,
      label: email,
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: secret || new OTPAuth.Secret(),
    });
  }

  async enable2FA(id: number) {
    const user = await this.userRepository.findByIdOrEmail({ id });
    if (!user) {
      throw UserNotFoundException;
    }
    if (user.totpSecret) {
      throw TOTPAlreadyEnabledException;
    }
    const totp = this.createTOTP({ email: user.email });
    const secret = totp.secret.base32;
    const uri = totp.toString();
    await this.userRepository.updateByIdOrEmail({
      unique: { id: user.id },
      data: { totpSecret: secret },
    });
    return {
      secret,
      uri,
    };
  }

  async disable2FA({ id, data }: { id: number; data: Disable2FaDtoType }) {
    const user = await this.userRepository.findByIdOrEmail({ id });
    if (!user) {
      throw UserNotFoundException;
    }
    if (!user.totpSecret) {
      throw TOTPNotEnabledException;
    }
    const isValid = this.verify({
      email: user.email,
      secret: user.totpSecret,
      totpCode: data.totpCode,
    });
    if (!isValid) {
      throw InvalidTOTPException;
    }
    await this.userRepository.updateByIdOrEmail({
      unique: { id },
      data: {
        totpSecret: null,
      },
    });
  }

  async reset2Fa({ code, email }: Reset2FaDtoType) {
    const user = await this.userRepository.findByIdOrEmail({ email });
    if (!user) {
      throw EmailNotFoundException;
    }
    const verificationCode =
      await this.verificationCodeRepository.findByEmailAndCodeAndType({
        code,
        email: user.email,
        type: 'RESET_2FA',
      });
    if (!verificationCode) {
      throw InvalidOTPException;
    }
    if (verificationCode.expireAt < new Date()) {
      throw OTPExpiredException;
    }
    const totp = this.createTOTP({ email: user.email });
    const secret = totp.secret.base32;
    const uri = totp.toString();
    await Promise.all([
      this.userRepository.updateByIdOrEmail({
        unique: { id: user.id },
        data: {
          totpSecret: secret,
        },
      }),
      this.verificationCodeRepository.deleteById(verificationCode.id),
    ]);
    return {
      secret,
      uri,
    };
  }

  verify({
    email,
    totpCode,
    secret,
  }: {
    email: string;
    totpCode: string;
    secret: string;
  }) {
    const totp = this.createTOTP({
      email,
      secret: secret,
    });
    const delta = totp.validate({ token: totpCode, window: 1 });
    return delta != null;
  }
}
