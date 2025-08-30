import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { faker } from '@faker-js/faker';
import { NestFactory } from '@nestjs/core';
import { PrismaClient, RoleEnum } from '@prisma/client';

import { AppModule } from 'src/app.module';
import { createVnPhone } from '@share/utils/helper.util';

const CLIENT_MODULE = ['auth', 'media', 'profile', 'cart', 'orders'];
const SELLER_MODULE = [
  'auth',
  'media',
  'product-management',
  'product-translations',
  'profile',
  'cart',
  'orders',
];

const main = async () => {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  const server = app.getHttpAdapter().getInstance();
  const router = server.router;

  const prismaService = new PrismaClient();

  const [adminRole, sellerRole, clientRole] =
    await prismaService.role.createManyAndReturn({
      data: [
        {
          name: RoleEnum.ADMIN,
        },
        {
          name: RoleEnum.SELLER,
        },
        {
          name: RoleEnum.CLIENT,
        },
      ],
      skipDuplicates: true,
    });

  await prismaService.user.createMany({
    data: [
      {
        email: 'admin@gmail.com',
        name: 'admin',
        password: await bcrypt.hash('123456', 10),
        phoneNumber: createVnPhone(),
        roleId: adminRole.id,
        avatar: faker.image.avatar(),
      },
      {
        email: 'seller2@gmail.com',
        name: 'seller2',
        password: await bcrypt.hash('123456', 10),
        phoneNumber: createVnPhone(),
        roleId: sellerRole.id,
        avatar: faker.image.avatar(),
      },
      {
        email: 'seller3@gmail.com',
        name: 'seller3',
        password: await bcrypt.hash('123456', 10),
        phoneNumber: createVnPhone(),
        roleId: sellerRole.id,
        avatar: faker.image.avatar(),
      },
      {
        email: 'seller4@gmail.com',
        name: 'seller4',
        password: await bcrypt.hash('123456', 10),
        phoneNumber: createVnPhone(),
        roleId: sellerRole.id,
        avatar: faker.image.avatar(),
      },
      {
        email: 'seller5@gmail.com',
        name: 'seller5',
        password: await bcrypt.hash('123456', 10),
        phoneNumber: createVnPhone(),
        roleId: sellerRole.id,
        avatar: faker.image.avatar(),
      },
      {
        email: 'seller6@gmail.com',
        name: 'seller6',
        password: await bcrypt.hash('123456', 10),
        phoneNumber: createVnPhone(),
        roleId: sellerRole.id,
        avatar: faker.image.avatar(),
      },
      {
        email: 'client@gmail.com',
        name: 'client',
        password: await bcrypt.hash('123456', 10),
        phoneNumber: createVnPhone(),
        roleId: clientRole.id,
        avatar: faker.image.avatar(),
      },
    ],
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
  for (const e of availableRoutes as any) {
    const method = e.method.toUpperCase();
    await prismaService.permission.create({
      data: {
        method,
        path: e.path,
        name: e.path + ' ' + method,
        module: String(e.path).split('/')[1],
      },
    });
  }
  const permissions = await prismaService.permission.findMany();
  const adminPermissionIds = permissions.map((e) => ({ id: e.id }));
  const sellerPermissionIds = permissions
    .filter((e) => SELLER_MODULE.includes(e.module))
    .map((e) => ({ id: e.id }));
  const clientPermissionIds = permissions
    .filter((e) => CLIENT_MODULE.includes(e.module))
    .map((e) => ({ id: e.id }));

  await Promise.all([
    updatePermission({
      permissionIds: adminPermissionIds,
      roleId: adminRole.id,
    }),
    updatePermission({
      permissionIds: sellerPermissionIds,
      roleId: sellerRole.id,
    }),
    updatePermission({
      permissionIds: clientPermissionIds,
      roleId: clientRole.id,
    }),
  ]);

  const brands = await prismaService.brand.createManyAndReturn({
    data: new Array(50).fill(0).map((e) => ({
      name: faker.company.name(),
      logo: 'https://',
    })),
    skipDuplicates: true,
  });

  await prismaService.language.createMany({
    data: new Array(10).fill(0).map((e) => {
      const lang = faker.location.language();
      return {
        id: lang.alpha2,
        name: lang.name,
      };
    }),
    skipDuplicates: true,
  });

  await prismaService.category.createMany({
    data: new Array(100).fill(0).map((e, i) => ({
      name: faker.commerce.department() + i,
      logo: faker.image.urlPicsumPhotos(),
      parentCategoryId:
        i > 0
          ? faker.helpers.arrayElement([null, crypto.randomInt(1, i + 1)])
          : null,
    })),
  });

  for (let i = 1; i <= 2000; i++) {
    const sizes = ['S', 'M', 'L', 'XL'];
    const colors = ['Red', 'Blue', 'Black'];

    // generate sku data
    const skuData = sizes.flatMap((size) =>
      colors.map((color) => ({
        value: `${size}-${color}`,
        price: crypto.randomInt(100000, 1000000),
        stock: crypto.randomInt(0, 500),
        image: faker.image.urlLoremFlickr({ category: 'product' }),
      })),
    );
    const createdById = crypto.randomInt(1, 7);
    await prismaService.product.create({
      data: {
        userId: createdById,
        name: faker.commerce.productName(),
        basePrice: crypto.randomInt(9999999),
        virtualPrice: crypto.randomInt(10000000, 50000000),
        images: new Array(5)
          .fill(0)
          .map((e) => faker.image.urlLoremFlickr({ category: 'product' })),
        publishedAt: faker.helpers.arrayElement([
          null,
          faker.date.past({ years: 2 }),
          faker.date.future({ years: 2 }),
        ]),
        createdBy: createdById,
        updatedBy: createdById,
        brandId: brands[crypto.randomInt(brands.length)].id,
        categories: {
          connect: new Array(100)
            .fill(0)
            .map((e) => ({ id: crypto.randomInt(1, 101) })),
        },
        skus: {
          createMany: {
            data: skuData,
          },
        },
      },
    });
  }

  async function updatePermission({
    permissionIds,
    roleId,
  }: {
    permissionIds: { id: number }[];
    roleId: number;
  }) {
    await prismaService.role.update({
      where: {
        id: roleId,
      },
      data: {
        permissions: {
          connect: permissionIds,
        },
      },
    });
  }

  process.exit(0);
};
main();
