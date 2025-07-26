import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  LoginDto,
  LoginType,
  RefreshTokenDto,
  RefreshTokenType,
  RegisterDto,
  RegisterType,
} from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(200)
  async register(@Body() body: RegisterDto) {
    return await this.authService.register(body as RegisterType);
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() body: LoginDto) {
    return await this.authService.login(body as LoginType);
  }

  @Post('refresh')
  @HttpCode(200)
  async refresh(@Body() body: RefreshTokenDto) {
    return await this.authService.refresh(body as RefreshTokenType);
  }
}
