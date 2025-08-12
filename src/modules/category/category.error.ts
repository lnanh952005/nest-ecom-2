import {
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';

export const CategoryNotFoundException = new NotFoundException(
  'Error.CategoryNotFound',
);

export const CategoryAlreadyExistsException = new UnprocessableEntityException({
  path: 'name',
  message: 'Error.CategoryAlreadyExists',
});

export const CategoryTranslationNotFoundException = new NotFoundException(
  'Error.CategoryTranslationNotFound',
);

export const CategoryTranslationAlreadyExistsException =
  new UnprocessableEntityException({
    path: ['categoryId', 'languageId'],
    message: 'Error.CategoryTranslationAlreadyExists',
  });

export const ParentCategoryNotFoundException = new UnprocessableEntityException({
  path: "parentCategoryId",
  message: "Error.ParentCategoryNotFound"
})