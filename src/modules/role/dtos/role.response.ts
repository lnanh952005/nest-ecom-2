import z from 'zod';

export const roleResDto = z.object({
  id: z.number(),
  name: z.string(),
  desc: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
  permissions: z.array(
    z.object({
      id: z.number(),
      path: z.string(),
      method: z.string(),
    }),
  ),
});

export const roleListResDto = z.array(
  roleResDto.pick({
    id: true,
    name: true,
    desc: true,
  }),
);
