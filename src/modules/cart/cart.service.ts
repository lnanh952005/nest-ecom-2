import { Injectable } from '@nestjs/common';
import { ProductNotFoundException } from '@product/product.error';
import { CartRepository } from '@share/repositories/cartItem.repository';
import { SkuRepository } from '@share/repositories/sku.repository';

import {
  SkuAlreadyOutOfStockException,
  SkuNotFoundException,
} from 'src/modules/cart/cart.error';
import { AddSkuToCartDto, UpdateCartItemDto } from 'src/modules/cart/dtos/cart.request';

@Injectable()
export class CartService {
  constructor(
    private cartRepository: CartRepository,
    private skuRepository: SkuRepository,
  ) {}

  getCard({
    languageId,
    limit,
    page,
    userId,
  }: {
    userId: number;
    languageId: string;
    page: number;
    limit: number;
  }) {
    return this.cartRepository.findAll({ languageId, limit, page, userId });
  }

  async addToCart({
    data,
    userId,
  }: {
    data: AddSkuToCartDto;
    userId: number;
  }) {
    await this.validateSku(data);
    return await this.cartRepository.upsert({ data, userId });
  }

  async updateById({ data, id }: { id: number; data: UpdateCartItemDto }) {
    await this.validateSku(data);
    return await this.cartRepository.updateById({ data, id });
  }

  deleteById({ ids, userId }: { userId: number; ids: number[] }) {
    return this.cartRepository.deleteById({ userId, ids });
  }

  async validateSku({ quantity, skuId }: AddSkuToCartDto) {
    const sku = await this.skuRepository.getDetailById(skuId).catch(() => {
      throw SkuNotFoundException;
    });
    if (sku.stock == 0 || sku.stock < quantity) {
      throw SkuAlreadyOutOfStockException;
    }
    if (
      !sku.product ||
      sku.product.publishedAt == null ||
      sku.product.publishedAt > new Date()
    ) {
      throw ProductNotFoundException;
    }
  }
}
