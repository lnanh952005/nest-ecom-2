import z from 'zod';
import { createZodDto } from 'nestjs-zod';
import { brandSchema, brandTranslationSchema } from '@brand/brand.schema';
import { paginationSchema } from '@auth/auth.schema';

const brandDetailDto = brandSchema
  .omit({
    deletedAt: true,
  })
  .extend({
    brandTranslations: z.array(
      brandTranslationSchema.omit({
        createdAt: true,
        updatedAt: true,
      }),
    ),
  });

const brandListDto = paginationSchema.extend({
  items: z.array(
    brandDetailDto.omit({
      createdAt: true,
      updatedAt: true,
    }),
  ),
});

export class BrandDetailDto extends createZodDto(brandDetailDto) {}
export class BrandListDto extends createZodDto(brandListDto) {}
