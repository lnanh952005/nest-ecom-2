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

  GG_CLIENT_ID: string;
  GG_CLIENT_SECRET: string;
  GG_REDIRECT_URI: string;
  GG_CLIENT_REDIRECT_URI: string;

  constructor() {
    this.ACCESS_TOKEN_KEY = process.env.ACCESS_TOKEN_KEY as string;
    this.REFRESH_TOKEN_KEY = process.env.REFRESH_TOKEN_KEY as string;
    this.ACCESS_TOKEN_EXPIRE = process.env.ACCESS_TOKEN_EXPIRE as string;
    this.REFRESH_TOKEN_EXPIRE = process.env.REFRESH_TOKEN_EXPIRE as string;
    this.OTP_EXPIRE = process.env.OTP_EXPIRE as string;
    this.X_API_KEY = process.env.X_API_KEY as string;
    this.RESEND_API_KEY = process.env.RESEND_API_KEY as string;
    this.GG_CLIENT_ID = process.env.GG_CLIENT_ID as string;
    this.GG_CLIENT_SECRET = process.env.GG_CLIENT_SECRET as string;
    this.GG_REDIRECT_URI = process.env.GG_REDIRECT_URI as string;
    this.GG_CLIENT_REDIRECT_URI = process.env.GG_CLIENT_REDIRECT_URI as string;
  }
}
