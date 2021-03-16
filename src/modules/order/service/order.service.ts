import { ForbiddenException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Order } from "../entity/order";

@Injectable()
export class OrderService {

  constructor(@InjectRepository(Order) private orderRepository: Repository<Order>) { }

  async create(order: Order) {
    order.linkedAt = null;
    order.userId = null;
    order.user = null;

    return this.orderRepository.create(order);
  }

  async linkToUser(userId: number, orderId: number){
    const order = await this.orderRepository.findOne(orderId);
    order.userId = userId;
    order.linkedAt = new Date();
    this.orderRepository.save(order);
  }

  async markAsDone(userId: number, orderId: number){
    const order = await this.orderRepository.findOne(orderId);

    if(userId != order.userId) throw new ForbiddenException();
    order.doneAt = new Date();
    this.orderRepository.save(order);
  }
}
