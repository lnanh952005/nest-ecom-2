import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/share/services/prisma.service';

@Injectable()
export class RefreshTokenRepository {
  constructor(private prismaService: PrismaService) {}

  async create(data: {
    token: string;
    expireAt: Date;
    userId: number;
    deviceId: number;
  }) {
    return await this.prismaService.refreshToken.create({ data });
  }

  async findById(id: number) {
    return await this.prismaService.role.findUnique({
      where: {
        id,
      },
    });
  }

  async findByToken(token: string) {
    return await this.prismaService.refreshToken.findUnique({
      where: {
        token,
      },
    });
  }

  async deleteByToken(token: string) {
    return await this.prismaService.refreshToken.delete({
      where: {
        token,
      },
    });
  }
}
