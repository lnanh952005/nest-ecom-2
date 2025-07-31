import fs from 'fs';
import path from 'path';
import { Resend } from 'resend';
import ms, { StringValue } from 'ms';
import { Injectable } from '@nestjs/common';

import { UserRepository } from 'src/modules/share/repositories/user.repository';
import { VerificationCodeRepository } from 'src/modules/share/repositories/verificationCode.repository';
import { EnvService } from 'src/modules/share/services/env.service';
import { createOtpCode } from 'src/modules/share/utils/createOtpCode.util';
import { SendOtpDto } from '../auth.dto';
import {
  EmailExistedException,
  EmailNotFoundException,
  InvalidOtpException,
} from '../auth.error';

@Injectable()
export class EmailService {
  private resend: Resend;
  constructor(
    private envService: EnvService,
    private userRepository: UserRepository,
    private verificationCodeRepository: VerificationCodeRepository,
  ) {
    this.resend = new Resend(this.envService.RESEND_API_KEY);
  }

  async sendOtpCode({ email, type }: SendOtpDto) {
    const isEmail = await this.userRepository.findByEmail(email);
    if (isEmail && type == 'REGISTER') {
      throw EmailExistedException;
    }
    if (!isEmail && type == 'FORGOT_PASSWORD') {
      throw EmailNotFoundException;
    }
    const code = createOtpCode();
    const expireAt = new Date(
      Date.now() + ms(this.envService.OTP_EXPIRE as StringValue),
    );
    await this.verificationCodeRepository.upsertVerificationCode({
      where: {
        email,
      },
      create: {
        code,
        email,
        type,
        expireAt,
      },
      update: {
        code,
        expireAt,
      },
    });
    const html = fs.readFileSync(
      path.resolve() + '\\src\\templates\\sendOtp.html',
      { encoding: 'utf-8' },
    );
    const subject = type == 'FORGOT_PASSWORD' ? 'reset password' : 'register';
    const { error } = await this.resend.emails.send({
      from: 'ecommerce <no-reply@nhatanh.top>',
      to: [email],
      subject: subject.toUpperCase(),
      html: html.replace('{{OTP_CODE}}', code).replace('{{TYPE}}', subject),
    });
    if (error) {
      throw InvalidOtpException;
    }
  }
}
