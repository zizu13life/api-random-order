import { ExtractJwt, JwtFromRequestFunction, Strategy } from 'passport-jwt';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JWT_SECRET_KEY } from 'src/modules/config/conts';
import { Reflector } from '@nestjs/core';
import { UserPermissions } from 'src/modules/user/entity/user';
import { PERMISSIONS_KEY } from 'src/modules/config/decorators/user-decorator';
import { AuthJWT } from '../dto/auth-models';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        const resolver: JwtFromRequestFunction = req => {
            return req.cookies['Authorization'];
        };
        super({
            jwtFromRequest: resolver,
            ignoreExpiration: false,
            secretOrKey: JWT_SECRET_KEY,
        });
    }

    async validate(payload: any) {
        return payload;
    }
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') { }


@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredPermissions = this.reflector.getAllAndOverride<UserPermissions[]>(PERMISSIONS_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredPermissions) {
            return true;
        }
        const user = context.switchToHttp().getRequest().user as AuthJWT;
        return requiredPermissions.some(p => user.permissions.includes(p));
    }
}
