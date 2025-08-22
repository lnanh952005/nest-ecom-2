import z from 'zod';

export const categoryTranslation = z.object({
  id: z.number(),
  desc: z.string(),
  categoryId: z.number(),
  languageId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const categoryResDto = z.object({
  id: z.number(),
  name: z.string(),
  logo: z.string(),
  parentCategoryId: z.number().nullable(),
  categoryTranslations: z.array(
    categoryTranslation.pick({
      id: true,
      desc: true,
      categoryId: true,
      languageId: true,
    }),
  ),
  createdAt:z.date(),
  updatedAt: z.date()
});

export const categoryListResDto = z.array(categoryResDto);
