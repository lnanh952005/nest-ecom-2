import z from 'zod';
import { userSchema } from '@share/schemas/user.schema';
import { paginationSchema, roleSchema } from '@share/schemas/auth.schema';
import { createZodDto } from 'nestjs-zod';

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
