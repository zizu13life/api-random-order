import { WebsoketModule } from './../websocket/websoket.module';
import { OrderController } from './controller/order.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entity/user';
import { Order } from './entity/order';
import { OrderService } from './service/order.service';
import { UserModule } from '../user/user.module';

@Module({
    imports: [
        WebsoketModule, UserModule,
        TypeOrmModule.forFeature([User, Order]),        
    ],
    controllers: [
        OrderController,
    ]
    ,
    providers: [
        OrderService,
    ],
    exports: [
        OrderService,
    ]
})
export class OrderModule { }
