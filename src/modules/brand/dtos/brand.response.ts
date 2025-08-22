import z from 'zod';
import {
  brandSchema,
  brandTranslationSchema,
} from '@share/schemas/brand.schema';

export const brandResDto = brandSchema
  .omit({
    deletedAt: true,
  })
  .extend({
    brandTranslations: z.array(
      brandTranslationSchema.omit({
        createdAt: true,
        updatedAt: true,
      }),
    ),
  });

export const brandListResDto = z.object({
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
  totalItems: z.number(),
  items: z.array(
    brandResDto.omit({
      createdAt: true,
      updatedAt: true,
    }),
  ),
});
