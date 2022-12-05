import { Repository } from 'typeorm';
import { OrderStatus } from '../common/order.enum';
import { AppDataSource } from '../data-sources/db';
import { OrderDetail } from '../data-sources/order-detail.entity';
import { Order } from '../data-sources/order.entity';
import { IOrderModel } from '../models/order.model';
import { CreateOrderPayload } from '../models/payloads/create-order.payload';

export interface IOrderRepository {
  createOrder(payload: CreateOrderPayload): Promise<IOrderModel>;
}

export class OrderRepositoryImpl implements IOrderRepository {
  private readonly repository: Repository<Order>;

  constructor() {
    this.repository = AppDataSource.getRepository(Order);
  }

  public async createOrder(payload: CreateOrderPayload): Promise<IOrderModel> {
    return AppDataSource.transaction(async (entityManager) => {
      let details = entityManager.create(OrderDetail, payload.detail);
      console.log('details:', details);
      // details = await entityManager.save(details);

      let order = new Order();
      order.user_name = payload.user_name;
      order.value = payload.value;
      order.address = payload.address;
      order.status = OrderStatus.CREATED;
      // order.detail = details;
      order = await entityManager.save(order);
      details = details.map((detail) => {
        const dt = new OrderDetail();
        dt.order = order;
        dt.product = detail.product;
        dt.quantity = detail.quantity;
        dt.value = detail.value;
        return dt;
      });
      details = await entityManager.save(details);
      const queryDetails = await entityManager
        .createQueryBuilder<OrderDetail>(OrderDetail, 'detail')
        .leftJoin('detail.order', 'order')
        .where('order.id = :oid', { oid: order.id })
        .getMany();
      console.log('queryDetails:', queryDetails);
      order.detail = queryDetails;
      return order;
    });
  }
}
