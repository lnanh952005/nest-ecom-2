import z from 'zod';
import { createZodDto } from 'nestjs-zod';
import { userSchema } from '@user/user.schema';
import { roleSchema } from '@role/role.schema';
import { paginationSchema } from '@auth/auth.schema';

const userDetailDto = userSchema
  .omit({
    password: true,
  })
  .extend({
    role: roleSchema.omit({
      createdAt: true,
      updatedAt: true,
    }),
  });

const userListDto = paginationSchema.extend({
  items: z.array(
    userDetailDto.omit({
      createdAt: true,
      updatedAt: true,
    }),
  ),
});

export class UserDetailDto extends createZodDto(userDetailDto) {}
export class UserListDto extends createZodDto(userListDto) {}
