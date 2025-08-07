import {
  ForbiddenException,
  UnprocessableEntityException,
} from '@nestjs/common';

export const DoNotHavePermissionToCreateOrUpdateRoleException =
  new UnprocessableEntityException({
    path: 'role',
    message: 'Error.DoNotHavePermissionToCreateAGreaterRole',
  });

export const CannotUpdateOrDeleteYourSelfException = new ForbiddenException(
  'Error.CanNotUpdateYourSelf',
);
