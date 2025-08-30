import {
  Body,
  Controller,
  Get,
  HttpCode,
  Ip,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';

import {
  Disable2FaDto,
  ForgotPasswordDto,
  LoginDto,
  RefreshTokenDto,
  RegisterDto,
  Reset2FaDto,
  SendOtpDto,
} from '@auth/dtos/auth.request';
import { GoogleCalbackType } from '@auth/auth.type';
import { User } from 'src/decorators/user.decorator';
import { EnvService } from '@share/services/env.service';
import { Public } from 'src/decorators/public.decorator';
import { AuthService } from '@auth/services/auth.service';
import { Message } from 'src/decorators/message.decorator';
import { EmailService } from '@share/services/email.service';
import { GoogleService } from '@auth/services/google.service';
import { UserAgent } from 'src/decorators/userAgent.decorator';
import { TwoFactorAuthService } from '@auth/services/twoFactorAuth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private envService: EnvService,
    private authService: AuthService,
    private emailService: EmailService,
    private googleService: GoogleService,
    private twoFactorAuthService: TwoFactorAuthService,
  ) {}

  @Post('register')
  @Public()
  @HttpCode(200)
  async register(@Body() body: RegisterDto) {
    return await this.authService.register(body);
  }

  /**
   * 1. kiểm tra tk mk có hợp lệ không
   * 2. kiểm tra user có bật 2fa chưa, nếu có thì kiểm tra totp gửi lên có đúng k
   * 3. tạo device
   * 4. trả tokens
   */
  @Post('login')
  @Public()
  @HttpCode(200)
  async login(
    @Body() body: LoginDto,
    @Ip() ip: string,
    @UserAgent() userAgent: string,
  ) {
    return await this.authService.login({ body, ip, userAgent });
  }

  @Post('refresh')
  @Public()
  @HttpCode(200)
  async refresh(
    @Body() body: RefreshTokenDto,
    @Ip() ip: string,
    @UserAgent() userAgent: string,
  ) {
    return await this.authService.refresh({ token: body.token, ip, userAgent });
  }

  @Post('logout')
  @Public()
  @HttpCode(200)
  @Message('logout successfully')
  async logout(@Body() body: RefreshTokenDto) {
    await this.authService.logout(body);
  }

  @Post('Otp')
  @Public()
  @HttpCode(200)
  @Message('check your email to receive otp code, if not please try again!')
  async sendOtpCode(@Body() body: SendOtpDto) {
    await this.emailService.sendOtpCode(body);
  }

  @Post('forgot-password')
  @Public()
  @HttpCode(200)
  @Message('reset password successfully')
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    await this.authService.forgotPassword(body);
  }

  @Get('google')
  @Public()
  googleOAuth(@Ip() ip: string, @UserAgent() userAgent: string) {
    return this.googleService.getGoogleLoginLink({ ip, userAgent });
  }

  @Get('google/callback')
  @Public()
  async googleOAuthCallback(
    @Res() res: Response,
    @Query() query: GoogleCalbackType,
  ) {
    const { code, state } = query;
    const { accessToken, refreshToken } =
      await this.googleService.googleOAuthCallback({ code, state });
    res.redirect(
      `${this.envService.GG_CLIENT_REDIRECT_URI}?accessToken=${accessToken}&refreshToken=${refreshToken}`,
    );
  }

  @Post('2fa/enable')
  async enable2FA(@User('userId') userId: string) {
    return await this.twoFactorAuthService.enable2FA(+userId);
  }

  @Post('2fa/reset')
  @Public()
  // @UseInterceptors(new ValidationInterceptor({ validate: reset2FaDto }))
  async reset2FA(@Body() body: Reset2FaDto) {
    return await this.twoFactorAuthService.reset2Fa(body);
  }

  @Post('2fa/disable')
  @HttpCode(200)
  @Message('disable 2fa successfully')
  async disable2FA(
    @Body() body: Disable2FaDto,
    @User('userId') userId: number,
  ) {
    await this.twoFactorAuthService.disable2FA({
      id: userId,
      data: body,
    });
  }
}
