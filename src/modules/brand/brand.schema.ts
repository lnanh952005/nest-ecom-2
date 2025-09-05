import z from 'zod';

export const brandSchema = z.object({
  id: z.number(),
  name: z.string(),
  logo: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
});

export const brandTranslationSchema = z.object({
  id: z.number(),
  desc: z.string(),
  brandId: z.number(),
  languageId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});