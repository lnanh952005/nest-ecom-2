import { UnprocessableEntityException } from '@nestjs/common';

export const LanguageNotFoundException = new UnprocessableEntityException({
  path: 'id',
  message: 'Error.LanguageNotFound',
});

export const LanguageExistedException = new UnprocessableEntityException({
  path: 'id',
  message: 'Error.LanguageExisted',
});
