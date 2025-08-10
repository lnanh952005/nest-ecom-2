import {
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';

export const BrandAlreadyExistsException = new UnprocessableEntityException({
  path: 'name',
  message: 'Error.BrandAlreadyExists',
});

export const BrandNotFoundException = new NotFoundException(
  'Error.BrandNotFound',
);

export const BrandTranslationNotFoundException = new NotFoundException(
  'Error.BrandTranslationNotFound',
);

export const BrandTranslationAlreadyExistsException = new NotFoundException({
  path: ['languageId', 'brandId'],
  message: 'Error.BrandTranslationAlreadyExists',
});
