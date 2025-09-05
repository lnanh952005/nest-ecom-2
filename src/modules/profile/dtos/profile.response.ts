import { userSchema } from '@user/user.schema';
import { createZodDto } from 'nestjs-zod';

const profileDto = userSchema.omit({
  password: true,
  totpSecret: true,
  createdAt: true,
  updatedAt: true,
});

export class ProfileDto extends createZodDto(profileDto) {}
