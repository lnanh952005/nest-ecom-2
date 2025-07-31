import bcrypt from 'bcrypt';
import { PrismaClient, Role, RoleEnum } from '@prisma/client';

const main = async () => {
  const prismaService = new PrismaClient();
  const count = await prismaService.role.count();
  if (count) {
    throw new Error('data existed');
  }
  await prismaService.role.createMany({
    data: [
      {
        name: RoleEnum.ADMIN,
      },
      {
        name: RoleEnum.CLIENT,
      },
      {
        name: RoleEnum.SELLER,
      },
    ],
  });
  const AdminRole = (await prismaService.role.findUnique({
    where: {
      name: RoleEnum.ADMIN,
    },
  })) as Role;
  const user = await prismaService.user.create({
    data: {
      email: 'admin@gmail.com',
      name: 'admin',
      password: await bcrypt.hash('123456', 10),
      phoneNumber: '0939271237',
      roleId: AdminRole.id,
    },
  });
};

main();
