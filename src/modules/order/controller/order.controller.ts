import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { CheckPermissions, Principal } from 'src/modules/config/decorators/user-decorator';
import { UserPermissions } from 'src/modules/user/entity/user';
import { OrderService } from './../service/order.service';
import { Order } from './../entity/order';
import { JwtAuthGuard, PermissionsGuard } from 'src/modules/auth/service/jwt-auth-provider.service';

@Controller('orders')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class OrderController {
    constructor(private orderService: OrderService) {

    }

    @Get('/unlinked')
    async getUnlinked(@Query('page') page = 0) {
        return this.orderService.getUnlinked(page);
    }

    @Get('/linked')
    async getLinked(@Query('date') date = new Date(), @Query('flterDate') flterDate?: Date) {
        date = new Date(date);
        return this.orderService.getLinked(date, flterDate ? new Date(flterDate) : null);
    }

    @Post('/link/random/to/me')
    async linkMe(@Principal() principal: number) {
        return this.orderService.linkToUserRandomTask(principal);
    }

    @Post()
    @CheckPermissions(UserPermissions.ADMIN)
    async create(@Body() order: Order) {
        return this.orderService.create(order);
    }

    @Delete('/:id')
    @CheckPermissions(UserPermissions.ADMIN)
    async remove(@Param('id') id: number) {
        return this.orderService.remove(id);
    }
}
