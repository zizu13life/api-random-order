import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from 'src/modules/user/servise/user.service';

import { UserController } from './controller/user.controller';
import { User } from './entity/user';

@Module({
    imports: [
    TypeOrmModule.forFeature([User]),
    ],
    controllers: [
        UserController,
    ],
    providers: [
        UserService,
    ],
    exports: [
        UserService,
    ]
})
export class UserModule { }
