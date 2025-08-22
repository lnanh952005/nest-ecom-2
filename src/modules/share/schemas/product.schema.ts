import z from 'zod';

export const productSchema = z.object({
  id: z.number(),
  name: z.string(),
  basePrice: z.number(),
  virtualPrice: z.number(),
  images: z.array(z.string()).optional(),
  brandId: z.number(),
  publishedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const productTranslationSchema = z.object({
  id: z.number(),
  name: z.string(),
  desc: z.string(),
  productId: z.number(),
  languageId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const skuShema = z.object({
  id: z.number(),
  value: z.string(),
  price: z.number(),
  stock: z.number(),
  image: z.string(),
  productId: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});