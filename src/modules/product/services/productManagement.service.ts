import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ProductNotFoundException } from '@product/product.error';
import { CreateProductDtoType, GetProductManagementQueryDtoType, UpdateProductDtoType } from '@product/product.type';
import { ProductRepository } from '@share/repositories/product.repository';

@Injectable()
export class ProductManagementService {
  constructor(private productRepository: ProductRepository) {}

  checkPrivilleg({
    createdBy,
    userId,
    roleId,
  }: {
    userId: number;
    createdBy: number;
    roleId: number;
  }) {
    if (createdBy != userId && roleId != 1) {
      throw new ForbiddenException();
    }
  }

  async findAll({
    languageId,
    query,
    roleId,
    userId,
  }: {
    query: GetProductManagementQueryDtoType;
    languageId: string;
    userId: number;
    roleId: number;
  }) {
    this.checkPrivilleg({ createdBy: query.createdBy, roleId, userId });
    const { items, totalItems } = await this.productRepository.findAll({
      query,
      languageId,
      isPublish: query.isPublish,
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

  async findById({
    id,
    languageId,
    roleId,
    userId,
  }: {
    id: number;
    languageId: string;
    userId: number;
    roleId: number;
  }) {
    const product = await this.productRepository
      .findById({ id, languageId })
      .catch(() => {
        throw ProductNotFoundException;
      });
    this.checkPrivilleg({ createdBy: product.createdBy, roleId, userId });
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

  async create({
    userId,
    data,
  }: {
    data: CreateProductDtoType;
    userId: number;
  }) {
    try {
      return await this.productRepository.create({ data, createdBy: userId });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updateById({
    id,
    data,
    userId,
    roleId,
  }: {
    id: number;
    data: UpdateProductDtoType;
    userId: number;
    roleId: number;
  }) {
    const product = await this.productRepository.existsById(id).catch(() => {
      throw ProductNotFoundException;
    });

    this.checkPrivilleg({ createdBy: product.createdBy, roleId, userId });

    try {
      return await this.productRepository.updateById({
        id,
        data,
        updatedBy: userId,
      });
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  }

  async deleteById({
    id,
    userId,
    roleId,
  }: {
    id: number;
    userId: number;
    roleId: number;
  }) {
    const product = await this.productRepository.existsById(id).catch(() => {
      throw ProductNotFoundException;
    });
    this.checkPrivilleg({ createdBy: product.createdBy, userId, roleId });
    try {
      await this.productRepository.deleteById(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
