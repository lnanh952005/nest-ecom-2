import { Injectable } from '@nestjs/common';
import { GetProductQueryDto } from '@product/dtos/product.request';

// import { GetProductQueryDtoType } from 'src/modules/product/product.type';
import { ProductNotFoundException } from 'src/modules/product/product.error';
import { ProductRepository } from '@product/repositories/product.repository';

@Injectable()
export class ProductService {
  constructor(private productRepository: ProductRepository) {}

  async findAll({
    languageId,
    query,
  }: {
    query: GetProductQueryDto;
    languageId: string;
  }) {
    const { items, totalItems } = await this.productRepository.findAll({
      query,
      languageId,
      isPublish: true,
    });
    const result = items.map((e) => {
      const { variants, ...data } = e;
      const newVariants = variants.map((e) => ({
        name: e.name,
        options: e.variantOptions.map((e) => e.value),
      }));
      return {
        ...data,
        variants: newVariants,
      };
    });

    return {
      page: query.page,
      limit: query.limit,
      totalPages: Math.ceil(totalItems / query.limit),
      totalItems,
      items: result,
    };
  }

  async findById({ id, languageId }: { id: number; languageId: string }) {
    const product = await this.productRepository
      .findById({ id, languageId })
      .catch(() => {
        throw ProductNotFoundException;
      });
    const { variants, ...data } = product;
    const newVariants = variants.map((e) => ({
      name: e.name,
      options: e.variantOptions.map((o) => o.value),
    }));
    return {
      ...data,
      variants: newVariants,
    };
  }
}
