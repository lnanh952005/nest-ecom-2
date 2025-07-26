import { createParamDecorator } from '@nestjs/common';

export const User = createParamDecorator((data: string, ctx) => {
  const req: Request = ctx.switchToHttp().getRequest();
  const user = (req as any).user;
  return data ? user[data] : user;
});
