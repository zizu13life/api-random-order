import { forkJoin, from, merge, Observable } from 'rxjs';
import { UserService } from 'src/modules/user/servise/user.service';
import { Order } from './../entity/order';
import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Connection, FindOperator, IsNull, LessThan, Not, Repository } from "typeorm";
import { EventsGateway } from 'src/modules/websocket/event/service/event-gateway.service';
import { tap } from 'rxjs/operators';

export const PAGE_SIZE = 25;

@Injectable()
export class OrderService {

  constructor(@InjectRepository(Order) private orderRepository: Repository<Order>,
    private eventsGateway: EventsGateway, private userService: UserService,
    private connection: Connection) { }

  async getUnlinked(page: number) {
    return this.orderRepository.find({
      where: {
        'linkedAt': IsNull(),
      },
      take: PAGE_SIZE,
      skip: page * PAGE_SIZE,
      order: {
        'priority': 'ASC',
        'id': 'ASC',
      }
    });
  }

  async getLinked(date: Date, filterDate: Date = null) {
    const q = this.orderRepository
      .createQueryBuilder('order')
      .select()
      .leftJoinAndSelect('order.user', 'user')
      .addOrderBy('order.linkedAt', 'DESC')
      .andWhere("order.linkedAt < :date", { date: date.toUTCString() })
      .limit(PAGE_SIZE);

    if (filterDate) {
      q.andWhere('DATE(order.linkedAt) = DATE(:filterDate)', { filterDate: filterDate.toUTCString() })
    }

    return q.getMany();
  }

  async create(order: Order) {
    order.linkedAt = null;
    order.userId = null;
    order.user = null;
    order.createdAt = new Date();

    const orders: Observable<Order>[] = [];
    const names = order.name.split(',').map(name => name.trim()).filter(name => name.length > 0);
    for (const orderName of names) {
      const _order = JSON.parse(JSON.stringify(order)) as Order;
      _order.name = orderName;
      orders.push(from(this.orderRepository.save(_order)));
    }
    return forkJoin(orders).pipe(tap(this.eventsGateway.sendUserUpdateOrderListEvent.bind(this.eventsGateway)));
  }

  async remove(id: number, userId: number) {
    const order = await this.orderRepository.findOne(id);
    if (order == null || order.rejectedAt) {
      throw new ForbiddenException();
    }

    if (order.linkedAt) {
      const copy = JSON.parse(JSON.stringify(order)) as Order;
      copy.id = null;
      copy.linkedAt = null;
      userId = null;

      order.rejectedById = userId;
      order.rejectedAt = new Date();
      return from(this.orderRepository.save([order, copy]))
        .pipe(tap(this.eventsGateway.sendUserUpdateOrderListEvent.bind(this.eventsGateway)));
    } else {
      return from(this.orderRepository.delete(id))
        .pipe(tap(this.eventsGateway.sendUserUpdateOrderListEvent.bind(this.eventsGateway)));
    }

  }

  async linkToUserRandomTask(userId: number) {
    const orders = await this.connection.createQueryBuilder()
      .select('order.id')
      .from<number>('order', 'order')
      .andWhere(qb => {
        const subQuery = qb.subQuery()
          .select("MIN(order.priority)")
          .from(Order, "order")
          .where('order.linkedAt is null')
          .getQuery();
        return "order.priority = " + subQuery;
      })
      .andWhere('order.linkedAt is null')
      .getMany();
    if (orders.length == 0) throw new NotFoundException();
    const randomOrderIndex = Math.floor(Math.random() * orders.length);
    return this.linkToUser(userId, orders[randomOrderIndex])
  }

  async linkToUser(userId: number, orderId: number) {
    let order = await this.orderRepository.findOne(orderId);
    order.userId = userId;
    order.linkedAt = new Date();
    order = await this.orderRepository.save(order);
    order.user = await this.userService.findOne(userId);
    this.eventsGateway.sendUserTakeOrderEvent(order);
    return order;
  }

  async markAsDone(userId: number, orderId: number) {
    const order = await this.orderRepository.findOne(orderId);

    if (userId != order.userId) throw new ForbiddenException();
    order.doneAt = new Date();
    this.orderRepository.save(order);
  }
}
