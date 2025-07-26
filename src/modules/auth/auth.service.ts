import { Injectable } from '@nestjs/common';
import { PrismaService } from '../share/prisma.service';
import { PasswordEncoderService } from '../share/passwordEncoder.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private passwordEncoderService: PasswordEncoderService,
  ) {}

  async register() {
    
  }
}
