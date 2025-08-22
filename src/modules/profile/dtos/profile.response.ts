import { userSchema } from '@share/schemas/user.schema';

export const profileResDto = userSchema.omit({
  password: true,
  totpSecret: true,
  createdAt: true,
  updatedAt: true,
});
