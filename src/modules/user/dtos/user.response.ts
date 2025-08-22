import z from 'zod';
import { paginationSchema, roleSchema } from '@share/schemas/auth.schema';
import { userSchema } from '@share/schemas/user.schema';

export const userResDto = userSchema
  .omit({
    password: true,
  })
  .extend({
    role: roleSchema.omit({
      createdAt: true,
      updatedAt: true,
    }),
  });

export const userListResDto = paginationSchema.extend({
  items: z.array(
    userResDto.omit({
      createdAt: true,
      updatedAt: true,
    }),
  ),
});
