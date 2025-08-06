import { UnprocessableEntityException } from '@nestjs/common';

export const PermissionNotFoundException = new UnprocessableEntityException({
  path: 'permission',
  message: 'Error.PermissionNotFound',
});

export const PermissionAlreadyExistedException =
  new UnprocessableEntityException({
    path: 'permission',
    message: 'Error.PermissionAlreadyExisted',
  });
