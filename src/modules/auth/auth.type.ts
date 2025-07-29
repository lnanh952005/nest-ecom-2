import z from "zod";
import { loginSchema, refreshSchema, registerSchema } from "./auth.model";

export type AdditionTokenPayload = {
  iat: number;
  exp: number;
  jti: string;
};

export type AccessTokenPayload = {
  userId: number;
  email: string;
  name: string;
  phoneNumber: string;
};

export type RefreshtokenPayload = Omit<
  AccessTokenPayload,
  'name' | 'phoneNumber'
>;

// export type LoginDtoType = z.infer<typeof loginSchema>;
// export type RegisterDtoType = z.infer<typeof registerSchema>;
// export type RefreshDtoType = z.infer<typeof refreshSchema>;