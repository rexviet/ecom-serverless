import { IOrderServiceDS } from '../data-sources/order-service.ds';
import { IOrderModel } from '../models/order.model';

export interface IOrderRepository {
  getOrder(id: number): Promise<IOrderModel>;
}

export class OrderRepositoryImpl implements IOrderRepository {
  constructor(private readonly orderServiceDS: IOrderServiceDS) {}

  public async getOrder(id: number): Promise<IOrderModel> {
    return this.orderServiceDS.getOrder(id);
  }
}
