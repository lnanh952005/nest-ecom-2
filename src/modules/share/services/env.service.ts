import { Injectable } from '@nestjs/common';

@Injectable()
export class EnvService {
  ACCESS_TOKEN_KEY: string;
  REFRESH_TOKEN_KEY: string;

  ACCESS_TOKEN_EXPIRE: string;
  REFRESH_TOKEN_EXPIRE: string;

  OTP_EXPIRE: string;

  X_API_KEY: string;

  RESEND_API_KEY: string;
  constructor() {
    this.ACCESS_TOKEN_KEY = process.env.ACCESS_TOKEN_KEY as string;
    this.REFRESH_TOKEN_KEY = process.env.REFRESH_TOKEN_KEY as string;
    this.ACCESS_TOKEN_EXPIRE = process.env.ACCESS_TOKEN_EXPIRE as string;
    this.REFRESH_TOKEN_EXPIRE = process.env.REFRESH_TOKEN_EXPIRE as string;
    this.OTP_EXPIRE = process.env.OTP_EXPIRE as string;
    this.X_API_KEY = process.env.X_API_KEY as string;
    this.RESEND_API_KEY = process.env.RESEND_API_KEY as string;
  }
}
