import z from 'zod';
import { userSchema } from '@share/schemas/user.schema';

export const updateProfileDto = userSchema
  .pick({
    name: true,
    avatar: true,
    phoneNumber: true,
  })
  .strict();

export const changePasswordDto = z.strictObject({
  password: z.string(),
  newPassword: z.string().min(6).max(30),
});
