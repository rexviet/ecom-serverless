import { IOrderModel } from '/opt/nodejs/models/order.model';

export class IncreaseQuantityParams {
  constructor(readonly order: IOrderModel) {}
}
