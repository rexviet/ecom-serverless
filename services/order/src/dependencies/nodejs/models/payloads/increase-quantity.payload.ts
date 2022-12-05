import { IOrderModel } from '../order.model';

export class IncreaseQuantityPayload {
  constructor(readonly order: IOrderModel) {}
}
