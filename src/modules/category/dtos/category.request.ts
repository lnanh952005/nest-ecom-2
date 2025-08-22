import {
  categorySchema,
  categoryTranslationSchema,
} from '@share/schemas/category.schema';

// const getParentCategoryIdQueryDto = z.strictObject({
//   parentCategoryId: z.number().optional(),
// });

export const createCategoryDto = categorySchema
  .pick({
    parentCategoryId: true,
    name: true,
    logo: true,
  })
  .strict();

export const updateCategoryDto = createCategoryDto;

export const createCategoryTranslationDto = categoryTranslationSchema
  .pick({
    categoryId: true,
    languageId: true,
    name: true,
    desc: true,
  })
  .strict();

export const updateCategoryTranslationDto = createCategoryTranslationDto;
