import { Injectable } from '@nestjs/common';
import { RoleEnum } from 'generated/prisma';
import { PrismaService } from 'src/modules/share/services/prisma.service';

@Injectable()
export class RoleRepository {
  constructor(private prismaService: PrismaService) {}

  async findById(id: number) {
    return await this.prismaService.role.findUnique({
      where: {
        id
      },
    });
  }

  async findByName(name: RoleEnum) {
    return await this.prismaService.role.findUnique({
      where: {
        name,
      },
    });
  }
}
