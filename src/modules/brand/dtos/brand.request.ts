import { brandSchema, brandTranslationSchema } from '@brand/brand.schema';
import { createZodDto } from 'nestjs-zod';

const createBrandDto = brandSchema
  .pick({
    name: true,
    logo: true,
  })
  .strict();

const updateBrandDto = createBrandDto;

const createBrandTranslationDto = brandTranslationSchema
  .pick({
    brandId: true,
    languageId: true,
    desc: true,
  })
  .strict();

const updateBrandTranslationDto = createBrandTranslationDto;

export class CreateBrandDto extends createZodDto(createBrandDto) {}
export class UpdateBrandDto extends createZodDto(updateBrandDto) {}
export class CreateBrandTranslationDto extends createZodDto(
  createBrandTranslationDto,
) {}
export class UpdateBrandTranslationDto extends createZodDto(
  updateBrandTranslationDto,
) {}
