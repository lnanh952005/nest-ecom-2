import z from 'zod';

export const permissionSchema = z.object({
  id: z.number(),
  name: z.string(),
  desc: z.string().nullable(),
  path: z.string(),
  method: z.string(),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
  deletedAd: z.date().nullable(),
});

export const permissionResDto = permissionSchema.omit({
  deletedAd: true,
});

export const permissionListResDto = z.object({
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
  totalItems: z.number(),
  items: z.array(
    permissionResDto.pick({
      id: true,
      path: true,
      method: true,
    }),
  ),
});
