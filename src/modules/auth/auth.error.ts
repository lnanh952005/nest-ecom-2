import {
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

export const InvalidOTPException = new UnprocessableEntityException({
  path: 'otp',
  message: 'Error.InvalidOtp',
});

export const OTPExpiredException = new UnprocessableEntityException({
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

export const TOTPAlreadyEnabledException = new UnprocessableEntityException({
  path: 'totpCode',
  message: 'Error.TOTPAlreadyEnabled',
});

export const TOTPNotEnabledException = new UnprocessableEntityException({
  path: 'totpCode',
  message: 'Error.TOTPAlreadyEnabled',
});

export const InvalidTOTPException = new UnprocessableEntityException({
  path: 'totpCode',
  message: 'Error.InvalidTOTP',
});

export const TOTPRequiredException = new UnprocessableEntityException({
  path: 'totpCode',
  message: 'Error.RequiredTOTP',
});
