import { OrderController } from './controller/order.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entity/user';
import { Order } from './entity/order';
import { OrderService } from './service/order.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Order]),
    ],
    controllers: [
        OrderController,]
    ,
    providers: [
        OrderService,
    ],
    exports: [
        OrderService,
    ]
})
export class OrderModule { }
