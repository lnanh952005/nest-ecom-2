import {
  brandSchema,
  brandTranslationSchema,
} from '@share/schemas/brand.schema';

export const createBrandDto = brandSchema
  .pick({
    name: true,
    logo: true,
  })
  .strict();

export const updateBrandDto = createBrandDto;

export const createBrandTranslationDto = brandTranslationSchema
  .pick({
    brandId: true,
    languageId: true,
    desc: true,
  })
  .strict();

export const updateBrandTranslationDto = createBrandTranslationDto;
