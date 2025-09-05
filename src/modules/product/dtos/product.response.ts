import z from 'zod';
import { brandSchema, brandTranslationSchema } from '@brand/brand.schema';
import {
  categorySchema,
  categoryTranslationSchema,
} from '@category/category.schema';
import {
  productSchema,
  productTranslationSchema,
  skuShema,
} from '@product/product.schema';
import { paginationSchema } from '@auth/auth.schema';
import { createZodDto } from 'nestjs-zod';

export const productDetailResDto = productSchema.extend({
  variants: z.array(
    z.object({
      name: z.string(),
      options: z.array(z.string()),
    }),
  ),
  productTranslations: z.array(
    productTranslationSchema.omit({ createdAt: true, updatedAt: true }),
  ),
  skus: z.array(skuShema.omit({ createdAt: true, updatedAt: true })),
  brand: brandSchema.extend({
    brandTranslations: z.array(
      brandTranslationSchema.omit({ createdAt: true, updatedAt: true }),
    ),
  }),
  categories: z.array(
    categorySchema.extend({
      categoryTranslations: z.array(
        categoryTranslationSchema.omit({ createdAt: true, updatedAt: true }),
      ),
    }),
  ),
});

export const productListResDto = paginationSchema.extend({
  items: z.array(
    productDetailResDto.omit({
      skus: true,
      createdAt: true,
      updatedAt: true,
    }),
  ),
});

export const productTranslationResDto = productTranslationSchema;

export class ProductListResDto extends createZodDto(productListResDto) {}
export class ProductDetailResDto extends createZodDto(productDetailResDto) {}
