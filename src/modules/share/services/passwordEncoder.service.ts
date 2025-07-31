import bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PasswordEncoderService {
  constructor() {}

  async hash(password: string) {
    return await bcrypt.hash(password, 10);
  }

  async compare(password: string, encrypted: string) {
    return await bcrypt.compare(password, encrypted);
  }

  randomPassword(){
    return crypto.randomUUID();
  }
}
