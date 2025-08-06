import {
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';

export const RoleAlreadyExistedException = new UnprocessableEntityException({
  path: 'name',
  message: 'Error.RoleAlreadyExisted',
});

export const RoleNotFoundException = new NotFoundException(
  'Error.RoleNotFound',
);
