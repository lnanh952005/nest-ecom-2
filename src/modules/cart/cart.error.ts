import { BadRequestException, NotFoundException } from "@nestjs/common";

export const SkuNotFoundException = new NotFoundException("Error.SkuNotFound")
export const SkuAlreadyOutOfStockException = new BadRequestException("Error.OutOfStock")
