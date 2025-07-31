import { Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/share/services/prisma.service';

@Injectable()
export class DeviceRepository {
  constructor(private prismaService: PrismaService) {}

  async create(
    data: Prisma.XOR<
      Prisma.DeviceCreateInput,
      Prisma.DeviceUncheckedCreateInput
    >,
  ) {
    return await this.prismaService.device.create({
      data: {
        ...data,
      },
    });
  }

  async updateById({
    id,
    data,
  }: {
    id: number;
    data: Prisma.XOR<
      Prisma.DeviceUpdateInput,
      Prisma.DeviceUncheckedUpdateInput
    >;
  }) {
    return await this.prismaService.device.update({
      where: { id },
      data: {
        ...data,
      },
    });
  }

  async findById(id: number) {
    return await this.prismaService.device.findUnique({
      where: {
        id,
      },
    });
  }

  async deleteById(id: number) {
    await this.prismaService.device.delete({
      where: {
        id,
      },
    });
  }
}
