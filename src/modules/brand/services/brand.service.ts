import { Injectable } from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';
import {
  BrandAlreadyExistsException,
  BrandNotFoundException,
} from 'src/modules/brand/brand.error';
import {
  CreateBrandDtoType,
  UpdateBrandDtoType,
} from 'src/modules/brand/brand.type';
import { BrandRepository } from 'src/modules/share/repositories/brand.repository';
import { isUniqueConstraintPrismaError } from 'src/modules/share/utils/prismaError.util';

@Injectable()
export class BrandService {
  constructor(
    private brandRepository: BrandRepository,
    private i18nService: I18nService<I18nTranslations>,
  ) {}

  async findById(id: number) {
    try {
      return await this.brandRepository.findById({
        id,
        languageId: I18nContext.current()?.lang as string,
      });
    } catch (error) {
      throw BrandNotFoundException;
    }
  }

  async findAll({ limit, page }: { page: number; limit: number }) {
    const { items, totalItems } = await this.brandRepository.findAll({
      limit,
      page,
      languageId: I18nContext.current()?.lang as string,
    });
    return {
      page,
      limit,
      totalPages: Math.ceil(totalItems / limit),
      totalItems,
      items,
    };
  }

  async create(data: CreateBrandDtoType) {
    try {
      return await this.brandRepository.create(data);
    } catch (error) {
      throw BrandAlreadyExistsException;
    }
  }

  async updateById({ id, data }: { id: number; data: UpdateBrandDtoType }) {
    try {
      return this.brandRepository.updateById({ id, data });
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw BrandAlreadyExistsException;
      }
      throw BrandNotFoundException;
    }
  }

  async deleteById(id: number) {
    try {
      await this.brandRepository.deleteById(id);
    } catch (error) {
      throw BrandNotFoundException;
    }
  }
}
