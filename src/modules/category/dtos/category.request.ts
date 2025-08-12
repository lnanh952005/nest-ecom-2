import z from 'zod';

export const getParentCategoryIdQueryDto = z.strictObject({
  parentCategoryId: z.number().optional(),
});

export const createCategoryDto = z.strictObject({
  parentCategoryId: z.number().optional(),
  name: z.string(),
  logo: z.string(),
});

export const updateCategoryDto = z.strictObject({
  name: z.string().optional(),
  logo: z.string().optional(),
  parentCategoryId: z.number().nullable().optional(),
});

export const createCategoryTranslationDto = z.strictObject({
  categoryId: z.number(),
  languageId: z.string(),
  name: z.string(),
  desc: z.string(),
});

export const updateCategoryTranslationDto = z.strictObject({
  categoryId: z.number().optional(),
  languageId: z.string().optional(),
  name: z.string().optional(),
  desc: z.string().optional(),
});
