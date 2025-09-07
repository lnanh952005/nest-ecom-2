import { Injectable } from '@nestjs/common';

@Injectable()
export class EnvService {
  APP_NAME: string;
  ROOT_ENDPOINT: string;

  ACCESS_TOKEN_KEY: string;
  REFRESH_TOKEN_KEY: string;

  ACCESS_TOKEN_EXPIRE: string;
  REFRESH_TOKEN_EXPIRE: string;

  OTP_EXPIRE: string;

  PAYMENT_API_KEY: string;

  RESEND_API_KEY: string;

  GG_CLIENT_ID: string;
  GG_CLIENT_SECRET: string;
  GG_REDIRECT_URI: string;
  GG_CLIENT_REDIRECT_URI: string;

  UPLOAD_DIR: string;

  S3_BUCKET_NAME: string;

  S3_REGION: string;

  S3_ACCESS_KEY: string;

  S3_SECRET_KEY: string;

  S3_ENDPOINT: string;

  REDIS_URL: string;

  constructor() {
    this.APP_NAME = process.env.APP_NAME as string;
    this.ROOT_ENDPOINT = process.env.ROOT_ENDPOINT as string;
    this.ACCESS_TOKEN_KEY = process.env.ACCESS_TOKEN_KEY as string;
    this.REFRESH_TOKEN_KEY = process.env.REFRESH_TOKEN_KEY as string;
    this.ACCESS_TOKEN_EXPIRE = process.env.ACCESS_TOKEN_EXPIRE as string;
    this.REFRESH_TOKEN_EXPIRE = process.env.REFRESH_TOKEN_EXPIRE as string;
    this.OTP_EXPIRE = process.env.OTP_EXPIRE as string;
    this.PAYMENT_API_KEY = process.env.PAYMENT_API_KEY as string;
    this.RESEND_API_KEY = process.env.RESEND_API_KEY as string;
    this.GG_CLIENT_ID = process.env.GG_CLIENT_ID as string;
    this.GG_CLIENT_SECRET = process.env.GG_CLIENT_SECRET as string;
    this.GG_REDIRECT_URI = process.env.GG_REDIRECT_URI as string;
    this.GG_CLIENT_REDIRECT_URI = process.env.GG_CLIENT_REDIRECT_URI as string;
    this.UPLOAD_DIR = process.env.UPLOAD_DIR as string;
    this.S3_BUCKET_NAME = process.env.S3_BUCKET_NAME as string;

    this.S3_REGION = process.env.S3_REGION as string;

    this.S3_ACCESS_KEY = process.env.S3_ACCESS_KEY as string;

    this.S3_SECRET_KEY = process.env.S3_SECRET_KEY as string;
    this.S3_ENDPOINT = process.env.S3_ENDPOINT as string;
    this.REDIS_URL = process.env.REDIS_URL as string;
  }
}
