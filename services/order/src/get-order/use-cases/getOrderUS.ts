import { IOrderModel } from '/opt/nodejs/models/order.model';
import { IOrderRepository } from '/opt/nodejs/repositories/order.repository';

export interface IGetOrderUS {
  execute(id: number): Promise<IOrderModel>;
}

export class GetOrderUS implements IGetOrderUS {
  constructor(private readonly repository: IOrderRepository) {}

  public async execute(id: number): Promise<IOrderModel> {
    return this.repository.getOrder(id);
  }
}
