import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { AuthJWT } from 'src/modules/auth/dto/auth-models';
import { JwtAuthGuard, PermissionsGuard } from 'src/modules/auth/service/jwt-auth-provider.service';
import { UserService } from 'src/modules/user/servise/user.service';
import { UserPermissions } from '../entity/user';
import { CheckPermissions, PERMISSIONS_KEY, Principal } from '../../config/decorators/user-decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UserController {

    constructor(private userService: UserService) { }

    @Get('/me')
    @CheckPermissions(UserPermissions.ADMIN)
    async get(@Req() req, @Principal() principal: number) {
        return this.userService.findOne(principal);
    }

    @Get('/me/account')
    async getAccountWithExpiration(@Req() req, @Principal() principal: number) {
        return {
            user: await this.userService.findOne(principal),
            exp: req.user.exp,
            permissions: (req.user as AuthJWT).permissions,
        };
    }

    @Get('/active')
    async getAllActive(@Req() req, @Principal() principal: number) {
        return this.userService.findAllActive();
    }

    @Get('/')
    async getAll(@Req() req, @Principal() principal: number) {
        return this.userService.findAll();
    }
}
