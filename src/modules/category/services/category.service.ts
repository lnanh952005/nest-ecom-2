import { Injectable } from '@nestjs/common';
import {
  CategoryAlreadyExistsException,
  CategoryNotFoundException,
  ParentCategoryNotFoundException,
} from 'src/modules/category/category.error';
import {
  CreateCategoryDtoType,
  UpdateCategoryDtoType,
} from 'src/modules/category/category.type';
import { CategoryRepository } from 'src/modules/share/repositories/category.repository';
import { isUniqueConstraintPrismaError } from 'src/modules/share/utils/prismaError.util';

@Injectable()
export class CategoryService {
  constructor(private categoryRepository: CategoryRepository) {}

  async findAll({
    parentCategoryId,
    languageId,
  }: {
    parentCategoryId?: number;
    languageId: string;
  }) {
    return await this.categoryRepository.findAll({
      parentCategoryId,
      languageId,
    });
  }

  async findById({ id, languageId }: { id: number; languageId: string }) {
    try {
      return await this.categoryRepository.findById({ id, languageId });
    } catch (error) {
      throw CategoryNotFoundException;
    }
  }

  async create(data: CreateCategoryDtoType) {
    try {
      return await this.categoryRepository.create(data);
    } catch (error) {
      throw CategoryAlreadyExistsException;
    }
  }

  async updateById({ id, data }: { id: number; data: UpdateCategoryDtoType }) {
    if (id == data.parentCategoryId) {
      throw ParentCategoryNotFoundException;
    }
    if (data.parentCategoryId) {
      await this.categoryRepository
        .findById({
          id: data.parentCategoryId,
          languageId: 'all',
        })
        .catch(() => {
          throw ParentCategoryNotFoundException;
        });
    }
    try {
      return await this.categoryRepository.updateById({
        id,
        data,
      });
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw CategoryAlreadyExistsException;
      }
      throw CategoryNotFoundException;
    }
  }

  async deleteById(id: number) {
    try {
      await this.categoryRepository.deleteById(id);
    } catch (error) {
      throw CategoryNotFoundException;
    }
  }
}
