import { NotFoundException } from '@nestjs/common';

export const ProductNotFoundException = new NotFoundException(
  'Error.ProductNotFound',
);

export const ProductTranslationNotFoundException = new NotFoundException(
  'Error.ProductTranslationNotFound',
);

export const ProductTranslationAlreadyExistsException = new NotFoundException(
  'Error.ProductTranslationAlreadyExists',
);

