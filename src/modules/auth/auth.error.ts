import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';

export const EmailExistedException = new UnprocessableEntityException({
  path: 'email',
  message: 'Error.EmailExisted',
});

export const EmailNotFoundException = new UnprocessableEntityException({
  path: 'email',
  message: 'Error.EmailNotFound',
});

export const InvalidOtpException = new UnprocessableEntityException({
  path: 'otp',
  message: 'Error.InvalidOtp',
});

export const OtpExpiredException = new UnprocessableEntityException({
  path: 'otp',
  message: 'Error.ExpiredOtp',
});

export const UserNotFoundException = new NotFoundException(
  'Error.UserNotFound',
);

export const RefreshTokenNotFoundException = new UnauthorizedException(
  'Error.RefreshTokenNotFound',
);

export const InvalidRefreshTokenException = new UnauthorizedException(
  'Error.InvalidRefreshToken',
);

export const RefreshTokenExpiredException = new UnauthorizedException(
  'Error.RefreshTokenExpired',
);
