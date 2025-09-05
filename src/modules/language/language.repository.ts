import { Injectable } from '@nestjs/common';
import { PrismaService } from '@share/services/prisma.service';

@Injectable()
export class LanguageRepository {
  constructor(private prismaSerivce: PrismaService) {}

  async create(data: { id: string; name: string }) {
    return await this.prismaSerivce.language.create({
      data: {
        ...data,
      },
    });
  }

  async findAll() {
    return await this.prismaSerivce.language.findMany({});
  }

  async findById(id: string) {
    return await this.prismaSerivce.language.findUniqueOrThrow({
      where: {
        id,
      },
    });
  }

  async updateById({ id, data }: { id: string; data: { name: string } }) {
    return await this.prismaSerivce.language.update({
      where: { id },
      data: {
        ...data,
      },
    });
  }

  async deleteById(id: string) {
    await this.prismaSerivce.language.delete({
      where: { id },
    });
  }
}
