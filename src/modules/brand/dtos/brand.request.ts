import z from 'zod';

export const createBrandDto = z.strictObject({
  name: z.string(),
  logo: z.string(),
});

export const updateBrandDto = z.strictObject({
  name: z.string().optional(),
  logo: z.string().optional(),
});

export const createBrandTranslationDto = z.strictObject({
  languageId: z.string(),
  brandId: z.number(),
  desc: z.string(),
});

export const updateBrandTranslationDto = z.strictObject({
  languageId: z.string().optional(),
  brandId: z.number().optional(),
  desc: z.string().optional(),
});
