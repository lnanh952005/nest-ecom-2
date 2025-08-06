import {
  Body,
  Controller,
  Get,
  HttpCode,
  Ip,
  Post,
  Query,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';

import {
  Disable2FaDtoType,
  ForgotPasswordDtoType,
  GoogleCalbackType,
  LoginDtoType,
  RefreshTokenDtoType,
  RegisterDtoType,
  Reset2FaDtoType,
  SendOtpDtoType,
} from './auth.type';
import {
  disable2FaDto,
  forgotPasswordDto,
  loginDto,
  refreshTokenDto,
  reset2FaDto,
  sendOtpDto,
} from './dtos/auth.request';
import { User } from 'src/decorators/user.decorator';
import { AuthService } from './services/auth.service';
import { EmailService } from './services/email.service';
import { Public } from 'src/decorators/public.decorator';
import { GoogleService } from './services/google.service';
import { EnvService } from '../share/services/env.service';
import { Message } from 'src/decorators/message.decorator';
import { UserAgent } from 'src/decorators/userAgent.decorator';
import { TwoFactorAuthService } from './services/twoFactorAuth.service';
import { ValidationInterceptor } from 'src/interceptors/validation.interceptor';

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
  async register(@Body() body: RegisterDtoType) {
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
  @UseInterceptors(new ValidationInterceptor({ validate: loginDto }))
  async login(
    @Body() body: LoginDtoType,
    @Ip() ip: string,
    @UserAgent() userAgent: string,
  ) {
    return await this.authService.login({ body, ip, userAgent });
  }

  @Post('refresh')
  @Public()
  @HttpCode(200)
  @UseInterceptors(new ValidationInterceptor({ validate: refreshTokenDto }))
  async refresh(
    @Body() body: RefreshTokenDtoType,
    @Ip() ip: string,
    @UserAgent() userAgent: string,
  ) {
    return await this.authService.refresh({ token: body.token, ip, userAgent });
  }

  @Post('logout')
  @Public()
  @HttpCode(200)
  @Message('logout successfully')
  @UseInterceptors(new ValidationInterceptor({ validate: refreshTokenDto }))
  async logout(@Body() body: RefreshTokenDtoType) {
    await this.authService.logout(body);
  }

  @Post('Otp')
  @Public()
  @HttpCode(200)
  @Message('check your email to receive otp code, if not please try again!')
  @UseInterceptors(new ValidationInterceptor({ validate: sendOtpDto }))
  async sendOtpCode(@Body() body: SendOtpDtoType) {
    await this.emailService.sendOtpCode(body);
  }

  @Post('forgot-password')
  @Public()
  @HttpCode(200)
  @Message('reset password successfully')
  @UseInterceptors(new ValidationInterceptor({ validate: forgotPasswordDto }))
  async forgotPassword(@Body() body: ForgotPasswordDtoType) {
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
  @UseInterceptors(new ValidationInterceptor({ validate: reset2FaDto }))
  async reset2FA(@Body() body: Reset2FaDtoType) {
    return await this.twoFactorAuthService.reset2Fa(body);
  }

  @Post('2fa/disable')
  @HttpCode(200)
  @Message('disable 2fa successfully')
  @UseInterceptors(new ValidationInterceptor({ validate: disable2FaDto }))
  async disable2FA(
    @Body() body: Disable2FaDtoType,
    @User('userId') userId: number,
  ) {
    await this.twoFactorAuthService.disable2FA({
      id: userId,
      data: body,
    });
  }
}
