import z from 'zod';
import {
  brandSchema,
  brandTranslationSchema,
} from '@share/schemas/brand.schema';
import {
  categorySchema,
  categoryTranslationSchema,
} from '@share/schemas/category.schema';
import {
  productSchema,
  productTranslationSchema,
  skuShema,
} from '@share/schemas/product.schema';
import { paginationSchema } from '@share/schemas/auth.schema';

export const productResDto = productSchema.extend({
  variants: z.array(
    z.object({
      name: z.string(),
      options: z.array(z.string()),
    }),
  ),
  productTranslations: z.array(
    productTranslationSchema.omit({ createdAt: true, updatedAt: true }),
  ),
  sku: z.array(skuShema.omit({ createdAt: true, updatedAt: true })),
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
    productResDto.omit({
      createdAt: true,
      updatedAt: true,
    }),
  ),
});
