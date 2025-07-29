import { createParamDecorator } from '@nestjs/common';
import {
  AccessTokenPayload,
  AdditionTokenPayload,
} from 'src/modules/auth/auth.type';

export const User = createParamDecorator(
  (data: keyof (AccessTokenPayload & AdditionTokenPayload), ctx) => {
    const req: Request = ctx.switchToHttp().getRequest();
    const user = (req as any).user;
    return data ? user[data] : user;
  },
);
