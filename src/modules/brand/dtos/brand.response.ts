import z from 'zod';

export const brandResDto = z.object({
  id: z.number(),
  name: z.string(),
  logo: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const brandTranslation = z.object({
  id: z.number(),
  desc: z.string(),
  brandId: z.number(),
  languageId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const brandListResDto = z.object({
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
  totalItems: z.number(),
  items: z.array(
    brandResDto
      .pick({
        id: true,
        name: true,
        logo: true,
      })
      .extend({
        brandTranslations: z.array(
          brandTranslation.pick({
            id: true,
            desc: true,
            languageId: true,
          }),
        ),
      }),
  ),
});
