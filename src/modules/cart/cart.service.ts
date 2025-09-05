import { CartRepository } from '@cart/cart.repository';
import { Injectable } from '@nestjs/common';
import { ProductNotFoundException } from '@product/product.error';
import { SkuRepository } from '@product/repositories/sku.repository';

import {
  SkuAlreadyOutOfStockException,
  SkuNotFoundException,
} from 'src/modules/cart/cart.error';
import {
  AddSkuToCartDto,
  UpdateCartItemDto,
} from 'src/modules/cart/dtos/cart.request';

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

  async addSkuToCart({
    data,
    userId,
  }: {
    data: AddSkuToCartDto;
    userId: number;
  }) {
    await this.validateSku({
      quantity: data.quantity,
      skuId: data.skuId,
      userId,
    });
    return await this.cartRepository.addSkuToCart({ data, userId });
  }

  async updateById({
    data,
    cartItemId,
    userId,
  }: {
    cartItemId: number;
    userId: number;
    data: UpdateCartItemDto;
  }) {
    await this.validateSku({
      quantity: data.quantity,
      skuId: data.skuId,
      userId,
    });
    return await this.cartRepository.updateById({ data, cartItemId });
  }

  deleteById({ ids, userId }: { userId: number; ids: number[] }) {
    return this.cartRepository.deleteById({ userId, ids });
  }

  async validateSku({
    quantity,
    skuId,
    userId,
  }: {
    quantity: number;
    skuId: number;
    userId: number;
  }) {
    const sku = await this.skuRepository.getDetailById(skuId).catch(() => {
      throw SkuNotFoundException;
    });
    if (sku.stock == 0 || sku.stock < quantity) {
      throw SkuAlreadyOutOfStockException;
    }
    if (
      sku.product.publishedAt == null ||
      sku.product.publishedAt > new Date()
    ) {
      throw ProductNotFoundException;
    }
    const cartIem = await this.cartRepository.findBySkuId({
      skuId,
      userId,
    });
    if (cartIem) {
      if (cartIem.sku.stock < cartIem.quantity + quantity) {
        throw SkuAlreadyOutOfStockException;
      }
    }
  }
}
