import { Injectable } from '@nestjs/common';
import { VerificationCodeType } from '@prisma/client';

import { InvalidOTPException, OTPExpiredException } from '../auth.error';
import { VerificationCodeRepository } from '@auth/repositories/verificationCode.repository';

@Injectable()
export class VerificationCodeService {
  constructor(private verificationCodeRepository: VerificationCodeRepository) {}

  async deleteById(id: number) {
    await this.verificationCodeRepository.deleteById(id);
  }

  async validate({
    email,
    code,
    type,
  }: {
    email: string;
    code: string;
    type: VerificationCodeType;
  }) {
    const verificationCode =
      await this.verificationCodeRepository.findByEmailAndCodeAndType({
        code,
        email,
        type,
      });
    if (!verificationCode) {
      throw InvalidOTPException;
    }
    if (verificationCode.expireAt < new Date()) {
      throw OTPExpiredException;
    }
    return verificationCode;
  }
}
