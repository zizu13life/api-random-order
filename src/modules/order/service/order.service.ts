import { Order } from './../entity/order';
import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Connection, FindOperator, IsNull, LessThan, Not, Repository } from "typeorm";

export const PAGE_SIZE = 10;

@Injectable()
export class OrderService {

  constructor(@InjectRepository(Order) private orderRepository: Repository<Order>,
    private connection: Connection) { }

  async getUnlinked(page: number) {
    return this.orderRepository.find({
      where: {
        'linkedAt': IsNull(),
      },
      take: PAGE_SIZE,
      skip: page * PAGE_SIZE,
      order: {
        'priority': 'DESC',
        'id': 'ASC',
      }
    });
  }

  async getLinked(date: Date) {
    return this.orderRepository.find({
      relations: ['user'],
      where: {
        "linkedAt": LessThan(date),
      },
      take: PAGE_SIZE,
      order: {
        'linkedAt': 'DESC',
      }
    });
  }

  async create(order: Order) {
    order.linkedAt = null;
    order.userId = null;
    order.user = null;
    order.createdAt = new Date();

    return this.orderRepository.save(order);
  }

  async remove(id: number) {
    const order = await this.orderRepository.findOne(id);
    if (order == null || order.linkedAt) {
      throw new ForbiddenException();
    }
    return this.orderRepository.delete(id);
  }

  async linkToUserRandomTask(userId: number) {
    const orders = await this.connection.createQueryBuilder()
      .select('order.id')
      .from<number>('order', 'order')
      .where(qb => {
        const subQuery = qb.subQuery()
          .select("MAX(order.priority)")
          .from(Order, "order")
          .where('order.linkedAt is null')
          .getQuery();
        return "order.priority IN " + subQuery;
      })
      .where('order.linkedAt is null')
      .getMany();
    if (orders.length == 0) throw new NotFoundException();
    const randomOrderIndex = Math.floor(Math.random() * orders.length);
    return this.linkToUser(userId, orders[randomOrderIndex])
  }

  async linkToUser(userId: number, orderId: number) {
    const order = await this.orderRepository.findOne(orderId);
    order.userId = userId;
    order.linkedAt = new Date();
    return this.orderRepository.save(order);
  }

  async markAsDone(userId: number, orderId: number) {
    const order = await this.orderRepository.findOne(orderId);

    if (userId != order.userId) throw new ForbiddenException();
    order.doneAt = new Date();
    this.orderRepository.save(order);
  }
}
