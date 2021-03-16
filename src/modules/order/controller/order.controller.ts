import { Body, Controller, Post } from '@nestjs/common';
import { CheckPermissions } from 'src/modules/config/decorators/user-decorator';
import { UserPermissions } from 'src/modules/user/entity/user';
import { OrderService } from './../service/order.service';
import { Order } from './../entity/order';

@Controller('order')
export class OrderController {
    constructor(private orderService: OrderService){

    }

    @Post()
    @CheckPermissions(UserPermissions.ADMIN)
    async create(@Body() order: Order){
        return this.orderService.create(order);
    }
}
