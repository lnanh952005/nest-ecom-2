import z from 'zod';

export const profileResDto = z.object({
  email: z.string(),
  name: z.string(),
  phoneNumber: z.string().nullable(),
  avatar: z.string().nullable(),
});
