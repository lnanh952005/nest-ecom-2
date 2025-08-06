import { UnprocessableEntityException } from '@nestjs/common';

export const PhoneNumberAlreadyExistsException =
  new UnprocessableEntityException({
    path: 'phone',
    message: 'Error.PhoneNumberAlreadyExists',
  });

export const PasswordIsIncorrectException = new UnprocessableEntityException({
  path: 'password',
  message: 'Error.PasswordIsIncorrect',
});
