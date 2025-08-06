import z from 'zod';

export const updateProfileDto = z.strictObject({
  name: z.string().optional(),
  phoneNumber: z.string().optional(),
  avatar: z.string().optional(),
});

export const changePasswordDto = z.strictObject({
  password: z.string(),
  newPassword: z.string().min(6).max(30),
});
