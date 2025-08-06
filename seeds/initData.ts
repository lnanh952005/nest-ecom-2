import bcrypt from 'bcrypt';
import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { PrismaClient, RoleEnum } from '@prisma/client';

const main = async () => {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  const server = app.getHttpAdapter().getInstance();
  const router = server.router;

  const prismaService = new PrismaClient();

  const [adminRole] = await prismaService.role.createManyAndReturn({
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
    skipDuplicates: true,
  });

  await prismaService.user.createMany({
    data: {
      email: 'admin@gmail.com',
      name: 'admin',
      password: await bcrypt.hash('123456', 10),
      phoneNumber: '0939271237',
      roleId: adminRole.id,
    },
    skipDuplicates: true,
  });

  const availableRoutes: [] = router.stack
    .map((layer) => {
      if (layer.route) {
        return {
          path: layer.route?.path,
          method: layer.route?.stack[0].method,
        };
      }
    })
    .filter((item) => item !== undefined);
  console.log(availableRoutes);
  for (const e of availableRoutes as any) {
    const method = e.method.toUpperCase();
    await prismaService.permission.createMany({
      data: {
        method,
        path: e.path,
        name: e.path + ' ' + method,
        moduel: String(e.path).split("/")[1]
      },
      skipDuplicates: true,
    });
  }
  const permissions = await prismaService.permission.findMany();
  for (const e of permissions) {
    await prismaService.permissionRole.createMany({
      data: {
        permissionId: e.id,
        roleId: adminRole.id,
      },
      skipDuplicates: true,
    });
  }
  process.exit(0);
};

main();
