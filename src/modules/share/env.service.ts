import { Injectable } from '@nestjs/common';

@Injectable()
export class EnvService {
  ACCESS_TOKEN_KEY: string;
  REFRESH_TOKEN_KEY: string;

  ACCESS_TOKEN_EXPIRE: string;
  REFRESH_TOKEN_EXPIRE: string;
  constructor() {
    this.ACCESS_TOKEN_KEY = process.env.ACCESS_TOKEN_KEY as string;
    this.REFRESH_TOKEN_KEY = process.env.REFRESH_TOKEN_KEY as string;
    this.ACCESS_TOKEN_EXPIRE = process.env.ACCESS_TOKEN_EXPIRE as string;
    this.REFRESH_TOKEN_EXPIRE = process.env.REFRESH_TOKEN_EXPIRE as string;
  }
}
