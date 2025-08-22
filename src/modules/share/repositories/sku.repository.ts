import { Injectable } from '@nestjs/common';
import { PrismaService } from '@share/services/prisma.service';

@Injectable()
export class SkuRepository {
  constructor(private prismaService: PrismaService) {}

  async getDetailById(id: number) {
    return await this.prismaService.sku.findUniqueOrThrow({
      where: { id },
      include: {
        product: true,
      },
    });
  }
}
