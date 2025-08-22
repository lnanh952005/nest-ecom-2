import z from 'zod';

export const categorySchema = z.object({
  id: z.number(),
  name: z.string(),
  logo: z.string(),
  parentCategoryId: z.number().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
});

export const categoryTranslationSchema = z.object({
  id: z.number(),
  name: z.string(),
  desc: z.string(),
  categoryId: z.number(),
  languageId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
