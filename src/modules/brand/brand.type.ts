import z from 'zod';
import {
  createBrandDto,
  createBrandTranslationDto,
  updateBrandDto,
  updateBrandTranslationDto,
} from 'src/modules/brand/dtos/brand.request';
import {
  brandListResDto,
  brandResDto,
} from 'src/modules/brand/dtos/brand.response';

export type CreateBrandDtoType = z.infer<typeof createBrandDto>;
export type UpdateBrandDtoType = z.infer<typeof updateBrandDto>;
export type CreateBrandTranslationDtoType = z.infer<
  typeof createBrandTranslationDto
>;
export type UpdateBrandTranslationDtoType = z.infer<
  typeof updateBrandTranslationDto
>;

export type BrandResDto = z.infer<typeof brandResDto>;
export type BrandListResDto = z.infer<typeof brandListResDto>;
