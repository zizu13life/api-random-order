import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';
import { UserPermissions } from 'src/modules/user/entity/user';

export const Principal = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user?.userId as number;
  },
);

export const PERMISSIONS_KEY = 'PERMISSIONS_KEY';
export const CheckPermissions = (...permissions: UserPermissions[]) => SetMetadata(PERMISSIONS_KEY, permissions);