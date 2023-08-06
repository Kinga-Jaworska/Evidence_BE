import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetCurrentUserId = createParamDecorator(
  (_: undefined, context: ExecutionContext): number => {
    const request = context.switchToHttp().getRequest();
    console.log('USER id from current', request.user['sub']);
    return request.user['sub'];
  },
);
