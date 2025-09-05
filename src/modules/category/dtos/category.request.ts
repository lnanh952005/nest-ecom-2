import {
  categorySchema,
  categoryTranslationSchema,
} from '@category/category.schema';
import { createZodDto } from 'nestjs-zod';

// const getParentCategoryIdQueryDto = z.strictObject({
//   parentCategoryId: z.number().optional(),
// });

const createCategoryDto = categorySchema
  .pick({
    parentCategoryId: true,
    name: true,
    logo: true,
  })
  .strict();

const updateCategoryDto = createCategoryDto;

const createCategoryTranslationDto = categoryTranslationSchema
  .pick({
    categoryId: true,
    languageId: true,
    name: true,
    desc: true,
  })
  .strict();

const updateCategoryTranslationDto = createCategoryTranslationDto;

export class CreateCategoryDto extends createZodDto(createCategoryDto) {}
export class UpdateCategoryDto extends createZodDto(updateCategoryDto) {}

export class CreateCategoryTranslationDto extends createZodDto(
  createCategoryTranslationDto,
) {}
export class UpdateCategoryTranslationDto extends createZodDto(
  updateCategoryTranslationDto,
) {}
