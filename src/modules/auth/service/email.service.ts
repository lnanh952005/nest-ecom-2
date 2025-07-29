import { Resend } from 'resend';
import { Injectable } from '@nestjs/common';
import { EnvService } from 'src/modules/share/services/env.service';

@Injectable()
export class EmailService {
  private resend: Resend;
  constructor(private envService: EnvService) {
    this.resend = new Resend(this.envService.RESEND_API_KEY);
  }

  async sendOtpCode({
    toEmail,
    otpCode,
  }: {
    toEmail: string;
    otpCode: string;
  }) {
    return await this.resend.emails.send({
      from: 'ecommerce <custom@resend.dev>',
      to: [toEmail],
      subject: 'Otp Code',
      html: `<p>${otpCode}</p>`,
    });
  }
}
