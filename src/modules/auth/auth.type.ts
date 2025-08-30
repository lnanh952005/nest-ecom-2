// import z from 'zod';
// import {
//   loginDto,
//   disable2FaDto,
//   forgotPasswordDto,
//   refreshTokenDto,
//   registerDto,
//   reset2FaDto,
//   sendOtpDto,
// } from './dtos/auth.request';

// export type LoginDtoType = z.infer<typeof loginDto>;
// export type RegisterDtoType = z.infer<typeof registerDto>;
// export type RefreshTokenDtoType = z.infer<typeof refreshTokenDto>;
// export type SendOtpDtoType = z.infer<typeof sendOtpDto>;
// export type ForgotPasswordDtoType = z.infer<typeof forgotPasswordDto>;
// export type Disable2FaDtoType = z.infer<typeof disable2FaDto>;
// export type Reset2FaDtoType = z.infer<typeof reset2FaDto>;

export type AdditionTokenPayload = {
  iat: number;
  exp: number;
  jti: string;
};

export type AccessTokenPayload = {
  userId: number;
  email: string;
  roleId: number;
  deviceId: number;
};

export type RefreshTokenPayload = Pick<AccessTokenPayload, 'userId'>;

export type GoogleCalbackType = {
  code: string;
  state: string;
};
