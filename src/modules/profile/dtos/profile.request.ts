import z from 'zod';
import { createZodDto } from 'nestjs-zod';
import { userSchema } from '@user/user.schema';

const updateProfileDto = userSchema
  .pick({
    name: true,
    avatar: true,
    phoneNumber: true,
  })
  .strict();

const changePasswordDto = z.strictObject({
  password: z.string(),
  newPassword: z.string().min(6).max(30),
});

export class UpdateProfileDto extends createZodDto(updateProfileDto) {}
export class ChangePasswordDto extends createZodDto(changePasswordDto) {}
