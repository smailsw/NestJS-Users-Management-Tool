import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUserEmailFromRequest = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user.email;
  },
);