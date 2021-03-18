import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import { JWT_SECRET_KEY } from 'src/modules/config/conts';
import { UserService } from 'src/modules/user/servise/user.service';

import { User, UserPermissions } from '../../user/entity/user';
import { AuthJWT } from '../dto/auth-models';
import { AuthProvider } from '../dto/auth-provider.enum';

@Injectable()
export class AuthService {

    constructor(private usersService: UserService) {
    };

    async validateOAuthLogin(userResolver: () => Promise<User>, thirdPartyId: string, provider: AuthProvider): Promise<string> {
        try {

            let user = await this.usersService.findOneByGoogleId(thirdPartyId);

            if (!user)
                user = await this.usersService.registerOAuthUser(await userResolver(), thirdPartyId, provider);

            const payload: AuthJWT = {
                userId: user.id,
                permissions: user.isAdmin ? [UserPermissions.ADMIN] : [],
                provider
            }

            const jwt: string = sign(payload, JWT_SECRET_KEY, { expiresIn: '1d' });
            return jwt;
        }
        catch (err) {
            throw new InternalServerErrorException('validateOAuthLogin', err.message);
        }
    }
}
