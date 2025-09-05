import z from 'zod';
import { productTranslationSchema, skuShema } from '@product/product.schema';
import { generateSkus } from '@share/utils/generateSku';
import { createZodDto } from 'nestjs-zod';

const upsertSkuDto = skuShema.pick({
  value: true,
  price: true,
  stock: true,
  image: true,
});

const createProductDto = z
  .strictObject({
    name: z.string(),
    basePrice: z.number().min(0),
    virtualPrice: z.number().min(0),
    images: z.array(z.string()),
    brandId: z.number(),
    categoryIds: z.array(z.number()).nonempty(),
    publishedAt: z.coerce.date().nullable(),
    variants: z.array(
      z.object({
        name: z.string(),
        options: z.array(z.string().toUpperCase()),
      }),
    ),
    skus: z.array(upsertSkuDto),
  })
  .superRefine(({ variants, skus }, ctx) => {
    const validateSku = generateSkus(variants);
    const isMatching = validateSku.every(
      (val, idx) => skus[idx].value == val.value,
    );
    if (skus.length != validateSku.length || !isMatching) {
      ctx.addIssue({
        code: 'custom',
        path: ['skus'],
        message: 'skus is incorrect with variants',
      });
    }
    const set = new Set(variants.map((e) => e.name));
    if (set.size != variants.length) {
      ctx.addIssue({
        code: 'custom',
        path: ['variants'],
        message: "variant's name duplicates",
      });
    }
  });

const updateProductDto = createProductDto;

const createProductTranslationDto = productTranslationSchema
  .pick({
    productId: true,
    languageId: true,
    name: true,
    desc: true,
  })
  .strict();

const updateProductTranslationDto = createProductTranslationDto;

/**
 * dành cho client và guest
 */
const getProductQueryDto = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),
  name: z.string().optional(),
  brandIds: z
    .string()
    .transform((val, ctx) => {
      return val.split(',').map((e) => +e);
    })
    .optional(),
  categoryIds: z
    .string()
    .transform((val, ctx) => {
      return val.split(',').map((e) => +e);
    })
    .optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  createdBy: z.coerce.number().optional(),
  sortBy: z.enum(['price', 'createdAt', 'sale']).default('createdAt'),
  orderBy: z.enum(['asc', 'desc']).default('desc'),
});

/**
 * danh cho admin va seller
 */
const getProductManagementQueryDto = getProductQueryDto.extend({
  isPublish: z
    .string()
    .transform((vla, ctx) => {
      return vla == 'true' ? true : false;
    })
    .optional(),
  createdBy: z.coerce.number(),
});

export class GetProductQueryDto extends createZodDto(getProductQueryDto) {}

export class GetProductManangementQueryDto extends createZodDto(
  getProductManagementQueryDto,
) {}

export class CreateProductDto extends createZodDto(createProductDto) {}
export class UpdateProductDto extends createZodDto(updateProductDto) {}

export class CreateProductTranslationDto extends createZodDto(
  createProductTranslationDto,
) {}

export class UpdateProductTranslationDto extends createZodDto(
  updateProductTranslationDto,
) {}
