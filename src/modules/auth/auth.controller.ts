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
import { Message } from 'src/decorators/message.decorator';
import { Public } from 'src/decorators/public.decorator';
import { User } from 'src/decorators/user.decorator';
import { UserAgent } from 'src/decorators/userAgent.decorator';
import { EnvService } from '../share/services/env.service';
import {
  ForgotPasswordDto,
  LoginDto,
  RefreshTokenDto,
  RegisterDto,
  SendOtpDto,
} from './auth.dto';
import { profileSerialization } from './auth.model';
import { GoogleRedirectType } from './auth.type';
import { AuthService } from './service/auth.service';
import { EmailService } from './service/email.service';
import { GoogleService } from './service/google.service';

@Controller('auth')
export class AuthController {
  constructor(
    private envService: EnvService,
    private authService: AuthService,
    private emailService: EmailService,
    private googleService: GoogleService,
  ) {}
  @Get('profile')
  async getProfile(@User('userId') userId: number) {
    return profileSerialization.parse(
      await this.authService.getProfile(userId),
    );
  }

  @Post('register')
  @Public()
  @HttpCode(200)
  async register(@Body() body: RegisterDto) {
    return await this.authService.register(body);
  }

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
  async sendOtp(@Body() body: SendOtpDto) {
    await this.emailService.sendOtpCode(body);
  }

  @Post("forgot-password")
  @Public()
  @HttpCode(200)
  @Message("reset password successfully")
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
  async googleOAuthRedirect(
    @Res() res: Response,
    @Query() query: GoogleRedirectType,
  ) {
    const { code, state } = query;
    const { accessToken, refreshToken } =
      await this.googleService.googleOAuthRedirect({ code, state });
    res.redirect(
      `${this.envService.GG_CLIENT_REDIRECT_URI}?accessToken=${accessToken}&refreshToken=${refreshToken}`,
    );
  }
}
