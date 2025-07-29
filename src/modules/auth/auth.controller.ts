import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { LoginDto, RefreshTokenDto, RegisterDto, SendOtpDto } from './auth.dto';
import { AuthService } from './service/auth.service';
import { User } from 'src/decorators/user.decorator';
import { Public } from 'src/decorators/public.decorator';
import { profileSerialization } from './auth.model';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @Public()
  @HttpCode(200)
  async register(@Body() body: RegisterDto) {
    return await this.authService.register(body);
  }

  @Post('login')
  @Public()
  @HttpCode(200)
  async login(@Body() body: LoginDto) {
    return await this.authService.login(body);
  }

  @Post('refresh')
  @Public()
  @HttpCode(200)
  async refresh(@Body() body: RefreshTokenDto) {
    return await this.authService.refresh(body);
  }

  @Post('logout')
  @Public()
  @HttpCode(200)
  async logout(@Body() body: RefreshTokenDto) {
    return await this.authService.logout(body);
  }

  @Get('profile')
  async getProfile(@User('userId') userId: number) {
    return profileSerialization.parse(
      await this.authService.getProfile(userId),
    );
  }

  @Post('Otp')
  @HttpCode(200)
  @Public()
  async sendOtp(@Body() body: SendOtpDto) {
    return await this.authService.sendOtp(body);
  }
}
